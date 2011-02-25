class Employee < ActiveRecord::Base
  validates_presence_of     :pin
  validates_inclusion_of    :pin, :in => 1000..9999
  
  has_one     :person
end