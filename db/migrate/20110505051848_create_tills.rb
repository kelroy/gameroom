class CreateTills < ActiveRecord::Migration
  def self.up
    create_table :tills do |t|
      t.integer :account_id
      t.integer :store_id
      t.string :title
      t.string :description
      t.integer :minimum_transfer
      t.integer :minimum_balance
      t.boolean :retainable
      t.boolean :active

      t.timestamps
    end
  end

  def self.down
    drop_table :tills
  end
end
