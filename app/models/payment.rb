class Payment < ActiveRecord::Base
  attr_readonly           :transaction_id
  validates_presence_of   :form, :amount
  validates_inclusion_of  :form, :in => %w(cash credit check gift_card store_credit), :message => "%{value} is not a valid payment type"
  
  belongs_to              :transaction
end