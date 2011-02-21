class CreatePeople < ActiveRecord::Migration
  def self.up
    create_table :people do |t|
      t.integer :user_id
      t.integer :customer_id
      t.integer :employee_id
      t.string  :first_name
      t.string  :middle_name
      t.string  :last_name

      t.timestamps
    end
  end

  def self.down
    drop_table :people
  end
end
