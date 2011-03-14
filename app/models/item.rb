class Item < ActiveRecord::Base
  validates_presence_of   :title
  
  has_many                      :properties
  has_many                      :lines
  has_many                      :transactions,  :through => :lines
  accepts_nested_attributes_for :properties
  
  # Is good taxable?
  def taxable?
    self.taxable
  end
  
  # Is good discountable?
  def discountable?
    self.discountable
  end
  
  # Is good locked?
  def locked?
    self.locked
  end
  
  # Is good active?
  def active?
    self.active
  end
end