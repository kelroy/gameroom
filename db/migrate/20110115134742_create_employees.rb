class CreateEmployees < ActiveRecord::Migration
  def self.up
    create_table :employees do |t|
      t.string  :title
      t.integer :rate,        :null => false, :default => 0
      t.integer :pin,         :null => false
      t.boolean :active,      :null => false, :default => true

      t.timestamps
    end
  end

  def self.down
    drop_table :employees
  end
end
