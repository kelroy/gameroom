class AddPinToUsers < ActiveRecord::Migration
  def self.up
    add_column :users, :pin, :string
  end

  def self.down
    remove_column :users, :pin
  end
end
