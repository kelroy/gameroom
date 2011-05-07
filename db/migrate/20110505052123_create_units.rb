class CreateUnits < ActiveRecord::Migration
  def self.up
    create_table :units do |t|
      t.integer :account_id
      t.integer :item_id
      t.integer :location_id
      t.decimal :condition
      t.boolean :active

      t.timestamps
    end
  end

  def self.down
    drop_table :units
  end
end
