class CreateTransactions < ActiveRecord::Migration
  def self.up
    create_table :transactions do |t|
      t.integer :account_id
      t.integer :store_id
      t.integer :till_id
      t.integer :customer_id
      t.integer :user_id
      t.string :payments
      t.decimal :tax_rate
      t.boolean :complete
      t.boolean :locked

      t.timestamps
    end
  end

  def self.down
    drop_table :transactions
  end
end
