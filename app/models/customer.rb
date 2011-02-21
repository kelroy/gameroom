class Customer < ActiveRecord::Base
  validates_presence_of   :credit
  
  has_many    :transactions
  has_one     :person
end