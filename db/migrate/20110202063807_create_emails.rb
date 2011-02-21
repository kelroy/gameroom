class CreateEmails < ActiveRecord::Migration
  def self.up
    create_table :emails do |t|
      t.integer :person_id, :null => false
      t.string :address,    :null => false

      t.timestamps
    end
  end

  def self.down
    drop_table :emails
  end
end
