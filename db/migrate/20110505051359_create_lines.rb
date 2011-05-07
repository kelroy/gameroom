class CreateLines < ActiveRecord::Migration
  def self.up
    create_table :lines do |t|
      t.integer :account_id
      t.integer :transaction_id
      t.integer :item_id
      t.integer :unit_id
      t.string :title
      t.integer :quantity
      t.decimal :condition
      t.decimal :discount
      t.integer :price
      t.integer :credit
      t.integer :cash
      t.boolean :purchase
      t.boolean :taxable

      t.timestamps
    end
  end

  def self.down
    drop_table :lines
  end
end
