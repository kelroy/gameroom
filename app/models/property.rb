class Property < ActiveRecord::Base
  attr_readonly           :item_id
  validates_presence_of   :key, :value
  
  belongs_to              :item
end