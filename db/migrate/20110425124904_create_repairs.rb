class CreateRepairs < ActiveRecord::Migration
  def self.up
    create_table :repairs do |t|
      t.string    :name
      t.string    :phone
      t.string    :item
      t.string    :description
      t.string    :serial
      t.string    :symptoms
      t.string    :notes
      t.string    :warranty
      t.integer   :cost,              :null => false, :default => 0
      t.string    :receiver
      t.string    :technician
      t.datetime  :started,           :null => false, :default => Time.now
      t.datetime  :finished,          :null => false, :default => Time.now
      t.integer   :status,            :null => false, :default => 0
      t.boolean   :contacted,         :null => false, :default => false
      t.boolean   :active,            :null => false, :default => true

      t.timestamps
    end
  end

  def self.down
    drop_table :repairs
  end
end
