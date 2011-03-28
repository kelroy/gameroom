class Employee < ActiveRecord::Base
  
  has_one     :person
  has_many    :timecards
end