class CreateItems < ActiveRecord::Migration
  def self.up
    create_table :items do |t|
      t.integer :transaction_id,  :null => false
      t.integer :good_id
      t.string  :title,           :null => false
      t.string  :description
      t.integer :price,           :null => false, :default => 0
      t.integer :quantity,        :null => false, :default => 0

      t.timestamps
    end
  end

  def self.down
    drop_table :items
  end
end
