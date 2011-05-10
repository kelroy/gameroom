class Timecard < ActiveRecord::Base
  validates_presence_of   :begin
  
  after_initialize        :_default
  
  belongs_to              :account
  belongs_to              :user
  
  private
  
  def _default
    self.begin  ||= Time.now if new_record?
  end
end