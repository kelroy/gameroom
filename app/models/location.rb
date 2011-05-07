class Location < ActiveRecord::Base
  validates_presence_of         :title, :lft, :rgt
  validates_inclusion_of        :active, :in => [true, false]
  validates_uniqueness_of       :lft, :rgt
  
  after_initialize              :_default
  
  belongs_to  :account
  belongs_to  :store
  has_many    :units
  
  private
  
  def _default
    self.active   ||= true if new_record?
  end
end