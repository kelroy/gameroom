class Till < ActiveRecord::Base
  validates_presence_of   :title, :minimum_transfer, :minimum_balance
  
  has_many :entries
  has_many :transactions
end