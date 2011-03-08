class Line < ActiveRecord::Base
  validates_presence_of   :quantity, :price
  
  has_one                 :transaction
  has_one                 :item
end