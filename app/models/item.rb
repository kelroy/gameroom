class Item < ActiveRecord::Base
  attr_readonly           :transaction_id
  validates_presence_of   :title, :price, :quantity
  
  belongs_to              :transaction
  belongs_to              :good
end