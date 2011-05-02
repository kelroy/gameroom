class CreateLines < ActiveRecord::Migration
  def self.up
    create_table :lines do |t|
      t.integer :transaction_id
      t.integer :item_id
      t.string  :title,                         :null => false
      t.string  :description,                   :null => false
      t.integer :quantity,                      :null => false, :default => 0
      t.decimal :condition,                     :null => false, :default => 1, :precision => 2, :scale => 1
      t.decimal :discount,                      :null => false, :default => 1, :precision => 2, :scale => 1
      t.integer :price,                         :null => false, :default => 0
      t.integer :credit,                        :null => false, :default => 0
      t.integer :cash,                          :null => false, :default => 0
      t.boolean :purchase,                      :null => false, :default => true
      t.boolean :taxable,                       :null => false, :default => true
      t.boolean :discountable,                  :null => false, :default => true

      t.timestamps
    end
  end

  def self.down
    drop_table :lines
  end
end
