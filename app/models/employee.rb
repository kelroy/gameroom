class Employee < ActiveRecord::Base
  
  belongs_to  :person
  has_many    :timecards
  
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
end