class CreateAddresses < ActiveRecord::Migration
  def self.up
    create_table :addresses do |t|
      t.integer :person_id,   :null => false
      t.string :first_line,   :null => false
      t.string :second_line
      t.string :city,         :null => false
      t.string :state,        :null => false
      t.string :province
      t.string :country,      :null => false
      t.string :zip,          :null => false

      t.timestamps
    end
  end

  def self.down
    drop_table :addresses
  end
end
