class Property < ActiveRecord::Base
  attr_readonly           :item_id
  validates_presence_of   :key, :value
  validates_uniqueness_of :key
  
  belongs_to              :item
end