class Timecard < ActiveRecord::Base
  validates_presence_of   :begin
  
  belongs_to              :user
end