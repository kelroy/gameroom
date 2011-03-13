class Employee < ActiveRecord::Base
  validates_presence_of     :pin
  validates_length_of       :pin, :is => 4
  
  has_one     :person
end