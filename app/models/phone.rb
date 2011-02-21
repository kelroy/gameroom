class Phone < ActiveRecord::Base
  attr_readonly         :person_id
  validates_presence_of :number
  
  belongs_to  :person
end