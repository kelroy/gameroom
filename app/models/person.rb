class Person < ActiveRecord::Base
  has_one     :customer
  has_one     :user
  has_many    :emails
  has_many    :phones
  has_many    :addresses
  
  accepts_nested_attributes_for :customer
  accepts_nested_attributes_for :emails
  accepts_nested_attributes_for :addresses
  accepts_nested_attributes_for :phones
end
