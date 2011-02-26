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

  person = Factory.create(:person)
  person.emails << Factory.create(:email, :person => person)
  person.emails << Factory.create(:email, :person => person)
  person.addresses << Factory.create(:address, :person => person)
  person.addresses << Factory.create(:address, :person => person)
  person.phones << Factory.create(:phone, :person => person)
  person.phones << Factory.create(:phone, :person => person)

  user = Factory.create(:user, :email => 'example@example.com', :login => 'login')

  till = Factory.create(:till)
  till.entries << Factory.create(:entry, :till => till)
  till.entries << Factory.create(:entry, :till => till)
  till.users << user

  good = Factory.create(:good)
  good.properties << Factory.create(:property, :good => good)
  good.properties << Factory.create(:property, :good => good)

  transaction = Factory.create(:transaction, :till => till, :customer => customer)
  transaction.items << Factory.create(:item, :good => good, :transaction => transaction)
  transaction.payments << Factory.create(:payment, :transaction => transaction)
  transaction.payments << Factory.create(:payment, :transaction => transaction)
  
end