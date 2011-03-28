class Timecard < ActiveRecord::Base
  attr_readonly           :employee_id
  validates_presence_of   :begin
  
  belongs_to              :employee
end