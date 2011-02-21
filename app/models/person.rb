class Person < ActiveRecord::Base
                        
  belongs_to  :customer
  belongs_to  :employee
  belongs_to  :user
  has_many    :emails
  has_many    :phones
  has_many    :addresses
  
  accepts_nested_attributes_for :emails
  accepts_nested_attributes_for :addresses
  accepts_nested_attributes_for :phones
end
