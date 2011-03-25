class Transaction < ActiveRecord::Base
  after_create            :finish
  attr_readonly           :till_id
  
  belongs_to  :till
  belongs_to  :customer
  belongs_to  :user
  has_many    :payments
  has_many    :lines
  has_many    :items,    :through => :lines
  
  accepts_nested_attributes_for :customer
  accepts_nested_attributes_for :lines
  accepts_nested_attributes_for :payments
  
  # Calculate subtotal in pennies
  def subtotal
    subtotal = 0
    self.lines.each do |line|
      subtotal += line.subtotal
    end
    subtotal
  end
  
  # Calculate tax in pennies
  def tax
    if self.subtotal > 0
      purchase_subtotal = self.purchase_subtotal
      taxable_subtotal = 0
      self.lines.each do |line|
        taxable_subtotal += line.subtotal if line.taxable?
      end
      if taxable_subtotal < purchase_subtotal
        return (taxable_subtotal * self.tax_rate).round
      else
        return (purchase_subtotal * self.tax_rate).round
      end
    else
      return 0
    end
  end
  
  # Calculate total in pennies
  def total
    self.purchase_subtotal + self.tax
  end
  
  # Calculate the purchase subtotal
  def purchase_subtotal
    subtotal = self.subtotal
    if subtotal >= 0
      store_credit_payment = 0
      self.payments.each do |payment|
        if payment.form == 'store_credit'
          store_credit_payment += payment.amount
        end
      end
      return subtotal - store_credit_payment
    else
      return subtotal
    end
  end
  
  # Calculate change in pennies
  def change
    change = 0
    if(self.subtotal > 0)
      payment_total = 0
      self.payments.each do |payment|
        if payment.form != 'store_credit'
          payment_total += payment.amount
        end
      end
      change = payment_total - self.total
    else
      payment_total = 0
      self.payments.each do |payment|
        if(payment.form == 'cash')
          payment_total += payment.amount
        end
      end
      change = payment_total
    end
    change.abs
  end
  
  # Update customer
  def update_customer
    unless self.customer.nil?
      credit = 0
      self.payments.each do |payment|
        if payment.form == 'store_credit'
          credit = payment.amount
        end
      end
      self.customer.credit = self.customer.credit - credit
    end
  end
  
  # Update till
  def update_till
    unless self.till.nil?
      cash_total = 0
      self.payments.each do |payment|
        if payment.form == 'cash'
          cash_total += payment.amount
        end
      end
      if self.total < 0
        if cash_total != 0
          self.till.entries.create(:title => "Transaction: #{self.id}", :amount => cash_total)
        end
      elsif self.total > 0
        amount = cash_total - self.change
        if amount != 0
          self.till.entries.create(:title => "Transaction: #{self.id}", :amount => amount)
        end
      end
    end
  end
  
  # Finish the transaction
  def finish
    self.update_customer
    self.update_till
  end
  
  # Is transaction complete?
  def complete?
    self.complete
  end
  
  # Is transaction locked?
  def locked?
    self.locked
  end
end