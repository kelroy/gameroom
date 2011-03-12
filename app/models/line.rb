class Line < ActiveRecord::Base
  validates_presence_of   :quantity, :price
  
  belongs_to                 :transaction
  belongs_to                 :item
end