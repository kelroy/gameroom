class CreateTimecards < ActiveRecord::Migration
  def self.up
    create_table :timecards do |t|
      t.integer :account_id
      t.integer :user_id
      t.datetime :begin
      t.datetime :end

      t.timestamps
    end
  end

  def self.down
    drop_table :timecards
  end
end
