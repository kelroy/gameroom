class CreateTransactions < ActiveRecord::Migration
  def self.up
    create_table :transactions do |t|
      t.integer :till_id
      t.integer :customer_id, :null => false
      t.decimal :tax_rate,    :null => false, :default => 0
      t.boolean :complete,    :null => false, :default => true
      t.boolean :locked,      :null => false, :default => false

      t.timestamps
    end
  end

  def self.down
    drop_table :transactions
  end
end
