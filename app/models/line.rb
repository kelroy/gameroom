class Line < ActiveRecord::Base
  validates_presence_of   :quantity, :price
  
  belongs_to                 :transaction
  belongs_to                 :item
  
  # Calculate subtotal in pennies
  def subtotal
    self.quantity * self.price
  end
end