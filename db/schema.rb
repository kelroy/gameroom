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

ActiveRecord::Schema.define(:version => 20110202063807) do

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
    t.integer  "credit",     :default => 0, :null => false
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
    t.integer  "transaction_id",                :null => false
    t.integer  "good_id"
    t.integer  "service_id"
    t.integer  "unit_id"
    t.string   "title",                         :null => false
    t.string   "description"
    t.integer  "price",          :default => 0, :null => false
    t.integer  "quantity",       :default => 0, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "goods", :force => true do |t|
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

  create_table "people", :force => true do |t|
    t.integer  "user_id"
    t.integer  "customer_id"
    t.integer  "employee_id"
    t.string   "first_name"
    t.string   "middle_name"
    t.string   "last_name"
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
    t.integer  "good_id",    :null => false
    t.string   "key",        :null => false
    t.string   "value",      :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "transactions", :force => true do |t|
    t.integer  "store_id"
    t.integer  "customer_id",                    :null => false
    t.decimal  "tax_rate",    :default => 0.0,   :null => false
    t.boolean  "complete",    :default => true,  :null => false
    t.boolean  "locked",      :default => false, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "login",                                :null => false
    t.string   "email",                                :null => false
    t.string   "password_hash",                        :null => false
    t.string   "password_salt",                        :null => false
    t.string   "persistence_token",                    :null => false
    t.string   "perishable_token",                     :null => false
    t.integer  "login_count",        :default => 0,    :null => false
    t.integer  "failed_login_count", :default => 0,    :null => false
    t.datetime "last_request_at"
    t.datetime "current_login_at"
    t.datetime "last_login_at"
    t.string   "current_login_ip"
    t.string   "last_login_ip"
    t.boolean  "active",             :default => true, :null => false
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
