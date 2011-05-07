class Entry < ActiveRecord::Base
  validates_presence_of   :title, :time, :amount
  
  after_initialize        :_default
  
  belongs_to              :account
  belongs_to              :till
  belongs_to              :employee
  
  private
  
  def _default
    self.time   ||= Time.now if new_record?
    self.amount ||= 0 if new_record?
  end
end