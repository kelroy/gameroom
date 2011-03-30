class CreateItems < ActiveRecord::Migration
  def self.up
    create_table :items do |t|
      t.string  :title,                 :null => false
      t.string  :description
      t.string  :sku
      t.integer :price,                 :null => false, :default => 0
      t.integer :credit,                :null => false, :default => 0
      t.integer :cash,                  :null => false, :default => 0
      t.boolean :taxable,               :null => false, :default => true
      t.boolean :discountable,          :null => false, :default => true
      t.boolean :locked,                :null => false, :default => false
      t.boolean :active,                :null => false, :default => false

      t.timestamps
    end
  end

  def self.down
    drop_table :items
  end
end