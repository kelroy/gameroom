class CreatePhones < ActiveRecord::Migration
  def self.up
    create_table :phones do |t|
      t.integer :person_id,   :null => false
      t.string :title
      t.string :number,       :null => false

      t.timestamps
    end
  end

  def self.down
    drop_table :phones
  end
end
