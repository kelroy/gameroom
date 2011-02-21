class Good < ActiveRecord::Base
  validates_presence_of   :title, :sku
  validates_uniqueness_of :sku
  
  has_many                :properties
  has_many                :transactions,  :through => :entries
  
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