class CreatePeople < ActiveRecord::Migration
  def self.up
    create_table :people do |t|
      t.integer :account_id
      t.string :first_name
      t.string :middle_name
      t.string :last_name
      t.datetime :date_of_birth
      t.string :drivers_license
      t.string :ssn
      t.string :emails
      t.string :phones
      t.string :addresses

      t.timestamps
    end
  end

  def self.down
    drop_table :people
  end
end
