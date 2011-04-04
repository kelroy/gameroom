class Address < ActiveRecord::Base
  validates_presence_of :first_line, :city, :state, :zip

  belongs_to  :person
end