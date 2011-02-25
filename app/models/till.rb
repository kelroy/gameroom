class Till < ActiveRecord::Base
  validates_presence_of   :title, :minimum_transfer, :minimum_balance
  
  has_many :entries
  has_many :transactions
  has_and_belongs_to_many :users
end