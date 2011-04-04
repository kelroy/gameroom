class Property < ActiveRecord::Base
  validates_presence_of   :key, :value
  
  has_and_belongs_to_many :items
end