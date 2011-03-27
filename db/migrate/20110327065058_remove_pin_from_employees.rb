class RemovePinFromEmployees < ActiveRecord::Migration
  def self.up
    remove_column :employees, :pin
  end

  def self.down
    add_column :employees, :pin, :string
  end
end
