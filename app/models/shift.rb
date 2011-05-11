class Shift < ActiveRecord::Base
  validates_presence_of   :title, :begin, :end
  validates_inclusion_of        :active, :in => [true, false]
  
  after_initialize        :_default
  
  belongs_to  :account
  belongs_to  :user
  
  private
  
  def _default
    self.begin    ||= Time.now if new_record?
    self.end      ||= Time.now if new_record?
    self.active   = true if new_record? && self.active.nil?
  end
end