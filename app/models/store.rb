class Store < ActiveRecord::Base
  validates_presence_of   :title
  validates_inclusion_of  :active, :in => [true, false]
  
  after_initialize        :_default
  
  belongs_to  :account
  has_many    :locations
  has_many    :transactions
  has_many    :tills
  
  private
  
  def _default
    self.active   = true if new_record? && self.active.nil?
  end
end