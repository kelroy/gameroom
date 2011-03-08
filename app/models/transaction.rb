class Transaction < ActiveRecord::Base
  attr_readonly           :till_id, :customer_id
  
  belongs_to  :till
  belongs_to  :customer
  has_many    :lines
  has_many    :payments
  has_many    :items,    :through => :lines
  
  accepts_nested_attributes_for :customer
  accepts_nested_attributes_for :lines
  accepts_nested_attributes_for :payments
  
  # Is transaction complete?
  def complete?
    self.complete
  end
  
  # Is transaction locked?
  def locked?
    self.locked
  end
end