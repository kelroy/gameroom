class CreateEntries < ActiveRecord::Migration
  def self.up
    create_table :entries do |t|
      t.integer :account_id
      t.integer :till_id
      t.integer :employee_id
      t.string :title
      t.string :description
      t.datetime :time
      t.integer :amount

      t.timestamps
    end
  end

  def self.down
    drop_table :entries
  end
end
