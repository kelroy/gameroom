class Item < ActiveRecord::Base
  validates_presence_of   :title
  
  has_many                      :lines
  has_many                      :transactions,  :through => :lines
  has_and_belongs_to_many       :properties
  accepts_nested_attributes_for :properties
  
  # Is item taxable?
  def taxable?
    self.taxable
  end
  
  # Is item discountable?
  def discountable?
    self.discountable
  end
  
  # Is item locked?
  def locked?
    self.locked
  end
  
  # Is item active?
  def active?
    self.active
  end
end