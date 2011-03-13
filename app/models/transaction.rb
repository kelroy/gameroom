class Transaction < ActiveRecord::Base
  attr_readonly           :till_id, :customer_id
  
  belongs_to  :till
  belongs_to  :customer
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
    self.subtotal * self.tax_rate
  end
  
  # Calculate total in pennies
  def total
    self.subtotal + self.tax
  end
  
  # Calculate change in pennies
  def change
    change = 0
    if(self.subtotal > 0)
      payment_total = 0
      self.payments.each do |payment|
        payment_total += payment.amount
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
    change
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