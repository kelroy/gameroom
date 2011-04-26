class CreateTimecards < ActiveRecord::Migration
  def self.up
    create_table :timecards do |t|
      t.integer   :user_id
      t.datetime  :begin,           :null => false, :default => Time.now
      t.datetime  :end

      t.timestamps
    end
  end

  def self.down
    drop_table :timecards
  end
end
