class Employee < ActiveRecord::Base
  validates_presence_of     :rate, :pin_hash, :pin_salt
  validates_inclusion_of    :manager, :in => [true, false]
  validates_inclusion_of    :active, :in => [true, false]
  
  after_initialize          :_default
  
  belongs_to  :account
  belongs_to  :person
  has_many    :transactions
  has_many    :timecards
  has_many    :shifts
  has_many    :entries
  
  def self.in
    employees = []
    all_employees = self.all
    all_employees.each do |employee|
      if employee.in?
        employees.push(employee)
      end
    end
    employees
  end
  
  def self.out
    employees = []
    all_employees = self.all
    all_employees.each do |employee|
      if employee.out?
        employees.push(employee)
      end
    end
    employees
  end
  
  def stamp
    active_timecards = self.timecards.where('end IS NULL')
    if active_timecards.length > 0
      active_timecards.each do |timecard|
        timecard.end = Time.now
        timecard.save
      end
    else
      Timecard.create(:employee => self, :begin => Time.now)
    end
  end
  
  def in?
    active_timecards = self.timecards.where('end IS NULL')
    if active_timecards.length > 0
      return true
    end
    return false
  end
  
  def out?
    active_timecards = self.timecards.where('end IS NULL')
    if active_timecards.length == 0
      return true
    end
    return false
  end
  
  def manager?
    self.manager
  end
  
  def active?
    self.active
  end
  
  private
  
  def _default
    self.rate     ||= 0 if new_record?
    self.pin_hash ||= '' if new_record?
    self.pin_salt ||= '' if new_record?
    self.manager  ||= false if new_record?
    self.active   ||= true if new_record?
  end
end