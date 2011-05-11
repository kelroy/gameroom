class Line < ActiveRecord::Base
  validates_presence_of         :title, :quantity, :condition, :discount, :price, :credit, :cash
  validates_inclusion_of        :purchase, :in => [true, false]
  validates_inclusion_of        :taxable, :in => [true, false]
  
  after_initialize              :_default
  
  belongs_to                    :account
  belongs_to                    :transaction
  belongs_to                    :item
  belongs_to                    :unit
  
  # Calculate subtotal in pennies
  def subtotal
    if self.purchase?
      (self.quantity * self.discount * self.condition * self.price).round.to_i
    else
      (self.quantity * self.discount * self.condition * self.credit * -1).round.to_i
    end
  end
  
  # Is line purchase?
  def purchase?
    self.purchase
  end
  
  # Is line taxable?
  def taxable?
    self.taxable
  end
  
  private
  
  def _default
    self.quantity   ||= 1 if new_record?
    self.condition  ||= 1 if new_record?
    self.discount   ||= 1 if new_record?
    self.price      ||= 0 if new_record?
    self.credit     ||= 0 if new_record?
    self.cash       ||= 0 if new_record?
    self.purchase   = true if new_record? && self.purchase.nil?
    self.taxable    = true if new_record? && self.taxable.nil?
  end
end