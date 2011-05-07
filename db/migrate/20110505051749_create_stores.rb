class CreateStores < ActiveRecord::Migration
  def self.up
    create_table :stores do |t|
      t.integer :account_id
      t.string :title
      t.string :description
      t.string :url
      t.boolean :active

      t.timestamps
    end
  end

  def self.down
    drop_table :stores
  end
end
