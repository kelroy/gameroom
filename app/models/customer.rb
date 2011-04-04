class Customer < ActiveRecord::Base
  validates_presence_of   :credit
  
  belongs_to  :person
  has_many    :transactions
end