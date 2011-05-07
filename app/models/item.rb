class Item < ActiveRecord::Base
  validates_presence_of         :title, :sku, :price, :credit, :cash
  validates_inclusion_of        :taxable, :in => [true, false]
  validates_inclusion_of        :discountable, :in => [true, false]
  validates_inclusion_of        :locked, :in => [true, false]
  validates_inclusion_of        :active, :in => [true, false]
  
  after_initialize              :_default
  
  belongs_to                    :account
  has_many                      :lines
  has_many                      :units
  has_many                      :transactions,  :through => :lines
  serialize                     :properties
  serialize                     :tags
  
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
  
  private
  
  def _default
    self.price          ||= 0 if new_record?
    self.credit         ||= 0 if new_record?
    self.cash           ||= 0 if new_record?
    self.taxable        ||= true if new_record?
    self.discountable   ||= true if new_record?
    self.locked         ||= true if new_record?
    self.active         ||= true if new_record?
  end
end