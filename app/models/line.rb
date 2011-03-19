class Line < ActiveRecord::Base
  validates_presence_of   :quantity, :price
  
  belongs_to                    :transaction
  belongs_to                    :item
  accepts_nested_attributes_for :item
  
  # Calculate subtotal in pennies
  def subtotal
    self.quantity * self.price
  end
  
  # Is line taxable?
  def taxable?
    self.taxable
  end
end