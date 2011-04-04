class Payment < ActiveRecord::Base
  validates_presence_of   :form, :amount
  validates_inclusion_of  :form, :in => %w(cash check credit_card gift_card store_credit), :message => "%{value} is not a valid payment type"
  
  belongs_to              :transaction
end