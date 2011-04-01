class CreateProperties < ActiveRecord::Migration
  def self.up
    create_table :properties do |t|
      t.string  :key,         :null => false
      t.string  :value,       :null => false

      t.timestamps
    end
  end

  def self.down
    drop_table :properties
  end
end
