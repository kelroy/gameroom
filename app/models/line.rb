class Line < ActiveRecord::Base
  
  belongs_to                    :transaction
  belongs_to                    :item
  accepts_nested_attributes_for :item
  
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
  
  # Is line discountable?
  def discountable?
    self.discountable
  end
end