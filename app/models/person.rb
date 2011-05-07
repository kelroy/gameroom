class Person < ActiveRecord::Base
  validates_presence_of     :first_name, :last_name
  
  belongs_to    :account
  has_one       :customer
  has_one       :employee
  serialize     :emails
  serialize     :phones
  serialize     :addresses
end