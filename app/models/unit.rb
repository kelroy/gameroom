class Unit < ActiveRecord::Base
  validates_presence_of     :condition
  validates_inclusion_of    :active, :in => [true, false]
  
  after_initialize          :_default
  
  belongs_to  :account
  belongs_to  :location
  belongs_to  :item
  has_many    :lines
  
  private
  
  def _default
    self.condition  ||= 1 if new_record?
    self.active     ||= true if new_record?
  end
end