class CreateCustomers < ActiveRecord::Migration
  def self.up
    create_table :customers do |t|
      t.integer :account_id
      t.integer :person_id
      t.integer :credit
      t.string :notes
      t.boolean :active

      t.timestamps
    end
  end

  def self.down
    drop_table :customers
  end
end
