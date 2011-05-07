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

ActiveRecord::Schema.define(:version => 20110505052123) do

  create_table "accounts", :force => true do |t|
    t.string   "title"
    t.string   "token"
    t.string   "api_key"
    t.string   "api_secret"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "customers", :force => true do |t|
    t.integer  "account_id"
    t.integer  "person_id"
    t.integer  "credit"
    t.string   "notes"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "employees", :force => true do |t|
    t.integer  "account_id"
    t.integer  "person_id"
    t.string   "title"
    t.string   "pin_hash"
    t.string   "pin_salt"
    t.integer  "rate"
    t.boolean  "manager"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "entries", :force => true do |t|
    t.integer  "account_id"
    t.integer  "till_id"
    t.integer  "employee_id"
    t.string   "title"
    t.string   "description"
    t.datetime "time"
    t.integer  "amount"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "items", :force => true do |t|
    t.integer  "account_id"
    t.string   "title"
    t.string   "description"
    t.string   "image"
    t.string   "tags"
    t.string   "properties"
    t.string   "sku"
    t.integer  "price"
    t.integer  "credit"
    t.integer  "cash"
    t.boolean  "taxable"
    t.boolean  "discountable"
    t.boolean  "locked"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "lines", :force => true do |t|
    t.integer  "account_id"
    t.integer  "transaction_id"
    t.integer  "item_id"
    t.integer  "unit_id"
    t.string   "title"
    t.integer  "quantity"
    t.decimal  "condition"
    t.decimal  "discount"
    t.integer  "price"
    t.integer  "credit"
    t.integer  "cash"
    t.boolean  "purchase"
    t.boolean  "taxable"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "locations", :force => true do |t|
    t.integer  "account_id"
    t.integer  "store_id"
    t.string   "title"
    t.string   "description"
    t.integer  "lft"
    t.integer  "rgt"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "people", :force => true do |t|
    t.integer  "account_id"
    t.string   "first_name"
    t.string   "middle_name"
    t.string   "last_name"
    t.datetime "date_of_birth"
    t.string   "drivers_license"
    t.string   "ssn"
    t.string   "emails"
    t.string   "phones"
    t.string   "addresses"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "shifts", :force => true do |t|
    t.integer  "account_id"
    t.integer  "employee_id"
    t.string   "title"
    t.string   "description"
    t.datetime "begin"
    t.datetime "end"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "stores", :force => true do |t|
    t.integer  "account_id"
    t.string   "title"
    t.string   "description"
    t.string   "url"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "tills", :force => true do |t|
    t.integer  "account_id"
    t.integer  "store_id"
    t.string   "title"
    t.string   "description"
    t.integer  "minimum_transfer"
    t.integer  "minimum_balance"
    t.boolean  "retainable"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "timecards", :force => true do |t|
    t.integer  "account_id"
    t.integer  "employee_id"
    t.datetime "begin"
    t.datetime "end"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "transactions", :force => true do |t|
    t.integer  "account_id"
    t.integer  "store_id"
    t.integer  "till_id"
    t.integer  "customer_id"
    t.integer  "employee_id"
    t.string   "payments"
    t.decimal  "tax_rate"
    t.boolean  "complete"
    t.boolean  "locked"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "units", :force => true do |t|
    t.integer  "account_id"
    t.integer  "item_id"
    t.integer  "location_id"
    t.decimal  "condition"
    t.boolean  "active"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
