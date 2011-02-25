class CreateTills < ActiveRecord::Migration
  def self.up
    create_table :tills do |t|
      t.string  :title
      t.string  :description
      t.integer :minimum_transfer
      t.integer :minimum_balance
      t.boolean :retainable,        :null => false, :default => true
      t.boolean :active,            :null => false, :default => true

      t.timestamps
    end
  end

  def self.down
    drop_table :tills
  end
end
