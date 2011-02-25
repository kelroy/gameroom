class CreateTillsUsers < ActiveRecord::Migration
  def self.up
    create_table :tills_users, :id => false do |t|
      t.integer  :till_id
      t.integer  :user_id
    end
  end

  def self.down
    drop_table :tills_users
  end
end