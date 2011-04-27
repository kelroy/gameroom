class Entry < ActiveRecord::Base
  validates_presence_of   :title, :amount
  
  belongs_to              :till
  belongs_to              :user
end