class CreateLocations < ActiveRecord::Migration
  def self.up
    create_table :locations do |t|
      t.integer :account_id
      t.integer :store_id
      t.string :title
      t.string :description
      t.integer :lft
      t.integer :rgt
      t.boolean :active

      t.timestamps
    end
  end

  def self.down
    drop_table :locations
  end
end
