class CreateEntries < ActiveRecord::Migration
  def self.up
    create_table :entries do |t|
      t.integer   :till_id,     :null => false
      t.string    :title
      t.string    :description
      t.datetime  :time,        :null => false, :default => Time.now
      t.integer   :amount
      t.string    :action

      t.timestamps
    end
  end

  def self.down
    drop_table :entries
  end
end
