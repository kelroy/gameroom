class CreateItems < ActiveRecord::Migration
  def self.up
    create_table :items do |t|
      t.integer :account_id
      t.string :title
      t.string :description
      t.string :image
      t.string :tags
      t.string :properties
      t.string :sku
      t.integer :price
      t.integer :credit
      t.integer :cash
      t.boolean :taxable
      t.boolean :discountable
      t.boolean :locked
      t.boolean :active

      t.timestamps
    end
  end

  def self.down
    drop_table :items
  end
end
