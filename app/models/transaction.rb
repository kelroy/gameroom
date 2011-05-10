class Transaction < ActiveRecord::Base
  validates_presence_of     :tax_rate
  validates_inclusion_of    :complete, :in => [true, false]
  validates_inclusion_of    :locked, :in => [true, false]
  
  after_initialize          :_default
  
  belongs_to  :account
  belongs_to  :till
  belongs_to  :customer
  belongs_to  :user
  belongs_to  :store
  has_many    :lines
  has_many    :items,    :through => :lines
  serialize   :payments
  
  def subtotal
    subtotal = 0
    self.lines.each do |line|
      subtotal += line.subtotal
    end
    subtotal
  end

  def tax
    if self.subtotal > 0
      purchase_subtotal = self.purchase_subtotal
      taxable_subtotal = 0
      self.lines.each do |line|
        if line.taxable? && line.subtotal > 0
          taxable_subtotal += line.subtotal
        end
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
  
  def total
    self.purchase_subtotal + self.tax
  end
  
  def purchase_subtotal
    subtotal = self.subtotal
    if subtotal >= 0
      store_credit_payment = 0
      self.payments.each do |payment|
        if payment[:form] == 'store_credit'
          store_credit_payment += payment[:amount]
        end
      end
      return subtotal - store_credit_payment
    else
      return subtotal
    end
  end
  
  def change
    change = 0
    if(self.subtotal > 0)
      payment_total = 0
      self.payments.each do |payment|
        if payment[:form] != 'store_credit'
          payment_total += payment[:amount]
        end
      end
      change = payment_total - self.total
    else
      payment_total = 0
      self.payments.each do |payment|
        if(payment[:form] == 'cash')
          payment_total += payment[:amount]
        end
      end
      change = payment_total
    end
    change.abs
  end
  
  def complete?
    self.complete
  end
  
  def locked?
    self.locked
  end
  
  private
  
  def _default
    self.payments   ||= [] if new_record?
    self.tax_rate   ||= 0 if new_record?
    self.complete   ||= false if new_record?
    self.locked     ||= false if new_record?
  end
end