# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20110308214821) do

  create_table "addresses", :force => true do |t|
    t.integer  "person_id",   :null => false
    t.string   "first_line",  :null => false
    t.string   "second_line"
    t.string   "city",        :null => false
    t.string   "state",       :null => false
    t.string   "province"
    t.string   "country",     :null => false
    t.string   "zip",         :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "customers", :force => true do |t|
    t.integer  "credit",                 :default => 0,    :null => false
    t.string   "drivers_license_number"
    t.string   "drivers_license_state"
    t.boolean  "active",                 :default => true, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "emails", :force => true do |t|
    t.integer  "person_id",  :null => false
    t.string   "address",    :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "employees", :force => true do |t|
    t.string   "title"
    t.integer  "rate",       :default => 0,    :null => false
    t.integer  "pin",                          :null => false
    t.boolean  "active",     :default => true, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "entries", :force => true do |t|
    t.integer  "till_id",                                        :null => false
    t.string   "title"
    t.string   "description"
    t.datetime "time",        :default => '2011-03-12 02:45:33', :null => false
    t.integer  "amount"
    t.string   "action"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "items", :force => true do |t|
    t.string   "title",                           :null => false
    t.string   "description"
    t.string   "sku",                             :null => false
    t.integer  "price",        :default => 0,     :null => false
    t.boolean  "taxable",      :default => true,  :null => false
    t.boolean  "discountable", :default => true,  :null => false
    t.boolean  "locked",       :default => false, :null => false
    t.boolean  "active",       :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "lines", :force => true do |t|
    t.integer  "transaction_id"
    t.integer  "item_id"
    t.integer  "quantity",       :null => false
    t.integer  "price",          :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "payments", :force => true do |t|
    t.integer  "transaction_id",                :null => false
    t.string   "form",                          :null => false
    t.integer  "amount",         :default => 0, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "people", :force => true do |t|
    t.integer  "user_id"
    t.integer  "customer_id"
    t.integer  "employee_id"
    t.string   "first_name"
    t.string   "middle_name"
    t.string   "last_name"
    t.datetime "date_of_birth"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "phones", :force => true do |t|
    t.integer  "person_id",  :null => false
    t.string   "title"
    t.string   "number",     :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "properties", :force => true do |t|
    t.integer  "item_id",    :null => false
    t.string   "key",        :null => false
    t.string   "value",      :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tills", :force => true do |t|
    t.string   "title"
    t.string   "description"
    t.integer  "minimum_transfer"
    t.integer  "minimum_balance"
    t.boolean  "retainable",       :default => true, :null => false
    t.boolean  "active",           :default => true, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tills_users", :id => false, :force => true do |t|
    t.integer "till_id"
    t.integer "user_id"
  end

  create_table "transactions", :force => true do |t|
    t.integer  "till_id"
    t.integer  "customer_id",                    :null => false
    t.decimal  "tax_rate",    :default => 0.0,   :null => false
    t.boolean  "complete",    :default => true,  :null => false
    t.boolean  "locked",      :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "login",                                 :null => false
    t.string   "email",                                 :null => false
    t.string   "password_hash",                         :null => false
    t.string   "password_salt",                         :null => false
    t.string   "persistence_token",                     :null => false
    t.string   "perishable_token",                      :null => false
    t.integer  "login_count",        :default => 0,     :null => false
    t.integer  "failed_login_count", :default => 0,     :null => false
    t.datetime "last_request_at"
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.string   "current_login_ip"
    t.string   "last_login_ip"
    t.boolean  "administrator",      :default => false, :null => false
    t.boolean  "active",             :default => true,  :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
