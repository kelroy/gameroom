class Transaction < ActiveRecord::Base
  attr_readonly           :till_id, :customer_id
  
  belongs_to  :till
  belongs_to  :customer
  has_many    :items
  has_many    :goods,    :through => :items
  
  accepts_nested_attributes_for :customer
  accepts_nested_attributes_for :items
  
  # Is transaction complete?
  def complete?
    self.complete
  end
  
  # Is transaction locked?
  def locked?
    self.locked
  end
end