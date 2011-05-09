class CreateEmployees < ActiveRecord::Migration
  def self.up
    create_table :employees do |t|
      t.integer :account_id
      t.integer :person_id
      t.string  :title
      t.string  :token
      t.string  :password_hash
      t.string  :password_salt
      t.integer :rate
      t.boolean :administrator
      t.boolean :active

      t.timestamps
    end
  end

  def self.down
    drop_table :employees
  end
end
