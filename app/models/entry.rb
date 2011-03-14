class Entry < ActiveRecord::Base
  attr_readonly           :till_id
  validates_presence_of   :title, :amount
  
  belongs_to              :till
end