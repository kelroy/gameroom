class Customer < ActiveRecord::Base
  validates_presence_of     :credit
  validates_inclusion_of    :active, :in => [true, false]
  
  after_initialize          :_default
  
  belongs_to  :account
  belongs_to  :person
  has_many    :transactions
  
  def active?
    self.active
  end
  
  private
  
  def _default
    self.credit   ||= 0 if new_record?
    self.active   = true if new_record? && self.active.nil?
  end
end