class Transaction < ActiveRecord::Base
  attr_readonly           :store_id, :customer_id
  
  belongs_to  :customer
  has_many    :entries
  has_many    :goods,    :through => :entries
  
  accepts_nested_attributes_for :customer
  accepts_nested_attributes_for :entries
  
  # Is transaction complete?
  def complete?
    self.complete
  end
  
  # Is transaction locked?
  def locked?
    self.locked
  end
end