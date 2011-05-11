class Till < ActiveRecord::Base
  validates_presence_of         :title, :minimum_transfer, :minimum_balance
  validates_inclusion_of        :retainable, :in => [true, false]
  validates_inclusion_of        :active, :in => [true, false]
  
  after_initialize              :_default
  
  belongs_to  :account
  belongs_to  :store
  has_many    :entries
  has_many    :transactions
  
  def balance
    balance = 0
    self.entries.each do |entry|
      balance += entry.amount
    end
    balance
  end
  
  private
  
  def _default
    self.minimum_transfer   ||= 0 if new_record?
    self.minimum_balance    ||= 0 if new_record?
    self.retainable         = true if new_record? && self.retainable.nil?
    self.active             = true if new_record? && self.active.nil?
  end
end