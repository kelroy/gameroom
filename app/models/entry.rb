class Entry < ActiveRecord::Base
  attr_readonly           :till_id
  validates_presence_of   :title, :amount, :action
  validates_inclusion_of  :action, :in => %w(debit credit audit modify deposit withdrawal), :message => "%{value} is not a valid till action"
  
  belongs_to              :till
end