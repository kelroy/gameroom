class Address < ActiveRecord::Base
  attr_readonly         :person_id
  validates_presence_of :first_line, :city, :state, :country, :zip

  belongs_to  :person
end