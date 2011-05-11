class Account < ActiveRecord::Base
  validates_presence_of     :title, :token, :api_key, :api_secret
  validates_inclusion_of    :active, :in => [true, false]
  validates_uniqueness_of   :token
  validates_format_of       :token, :with => /\A[a-z0-9_]+\z/, 
                                    :message => "Token must contain only letters, numbers and underscores."
  validates_length_of       :api_key,     :is => 64
  validates_length_of       :api_secret,  :is => 64
  
  after_initialize          :_default
  
  has_many :customers, :dependent => :delete_all
  has_many :users, :dependent => :delete_all
  has_many :entries, :dependent => :delete_all
  has_many :items, :dependent => :delete_all
  has_many :lines, :dependent => :delete_all
  has_many :locations, :dependent => :delete_all
  has_many :people, :dependent => :delete_all
  has_many :shifts, :dependent => :delete_all
  has_many :stores, :dependent => :delete_all
  has_many :tills, :dependent => :delete_all
  has_many :timecards, :dependent => :delete_all
  has_many :transactions, :dependent => :delete_all
  has_many :units, :dependent => :delete_all
  
  def self.find_by_id_or_token(param)
    find_by_id(param) || find_by_token(param)
  end
  
  def active?
    self.active
  end
  
  private
  
  def _default
    self.api_key    ||= Digest::SHA256.hexdigest(Time.now.to_s) if new_record?
    self.api_secret ||= Digest::SHA256.hexdigest(Time.now.to_s.reverse) if new_record?
    self.active     = true if new_record? && self.active.nil?
  end
end