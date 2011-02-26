class CreatePayments < ActiveRecord::Migration
  def self.up
    create_table :payments do |t|
      t.integer :transaction_id,     :null => false
      t.string  :form,               :null => false
      t.integer :amount,             :null => false, :default => 0

      t.timestamps
    end
  end

  def self.down
    drop_table :payments
  end
end
