class CreateCustomers < ActiveRecord::Migration
  def self.up
    create_table :customers do |t|
      t.integer :credit,                  :null => false, :default => 0
      t.string  :drivers_license_number
      t.string  :drivers_license_state
      t.boolean :active,                  :null => false, :default => 1
      
      t.timestamps
    end
  end

  def self.down
    drop_table :customers
  end
end
