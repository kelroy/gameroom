class CreateShifts < ActiveRecord::Migration
  def self.up
    create_table :shifts do |t|
      t.integer :account_id
      t.integer :employee_id
      t.string :title
      t.string :description
      t.datetime :begin
      t.datetime :end
      t.boolean :active

      t.timestamps
    end
  end

  def self.down
    drop_table :shifts
  end
end
