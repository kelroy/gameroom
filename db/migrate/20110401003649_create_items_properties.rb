class CreateItemsProperties < ActiveRecord::Migration
  def self.up
    create_table :items_properties, :id => false do |t|
      t.integer  :item_id
      t.integer  :property_id
    end
  end

  def self.down
    drop_table :items_properties
  end
end
