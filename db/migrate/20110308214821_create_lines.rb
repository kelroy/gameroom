class CreateLines < ActiveRecord::Migration
  def self.up
    create_table :lines do |t|
      t.integer :transaction_id
      t.integer :item_id
      t.integer :quantity,                      :null => false
      t.integer :price,                         :null => false

      t.timestamps
    end
  end

  def self.down
    drop_table :lines
  end
end
