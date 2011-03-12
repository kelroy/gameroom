# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

unless Rails.env.production?

  customer = Factory.create(:customer)
  employee = Factory.create(:employee)

  person = Factory.create(:person, :first_name => 'Joe', :middle_name => 'C', :last_name => 'Example')
  person.emails << Factory.create(:email, :person => person)
  person.emails << Factory.create(:email, :person => person)
  person.addresses << Factory.create(:address, :person => person)
  person.addresses << Factory.create(:address, :person => person)
  person.phones << Factory.create(:phone, :person => person)
  person.phones << Factory.create(:phone, :person => person)

  user = Factory.create(:user, :person => person, :email => 'example@example.com', :login => 'login', :administrator => true)

  till = Factory.create(:till)
  till.entries << Factory.create(:entry, :till => till)
  till.entries << Factory.create(:entry, :till => till)
  till.users << user

  item = Factory.create(:item)
  item.properties << Factory.create(:property, :item => item)
  item.properties << Factory.create(:property, :item => item)
  
  transaction = Factory.create(:transaction, :till => till, :customer => customer)
  transaction.lines << Factory.create(:line, :item => item, :transaction => transaction)
  transaction.payments << Factory.create(:payment, :transaction => transaction)
  transaction.payments << Factory.create(:payment, :transaction => transaction)
  
end