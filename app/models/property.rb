class Property < ActiveRecord::Base
  attr_readonly           :good_id
  validates_presence_of   :key, :value
  validates_uniqueness_of :key
  
  belongs_to              :good
end