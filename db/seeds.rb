# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

unless Rails.env.production?
  
  persons = []
  customers = []
  users = []
  (1..20).each do
    first = (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize
    middle = (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize
    last = (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize
    person = Factory.create(:person, :first_name => first, :middle_name => middle, :last_name => last)
    person.emails << Factory.create(:email, :person => person)
    person.addresses << Factory.create(:address, :person => person)
    person.phones << Factory.create(:phone, :person => person)
    
    customer = Factory.create(:customer, :person => person, :credit => (rand(9999) + 1), :drivers_license_number => (1...(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.upcase, :drivers_license_state => 'NE', :active => rand(2).even?)
    user = Factory.create(:user, :person => person, :rate => (rand(19) + 1), :pin => 4.times.map{ rand(9) }.join, :email => "#{person.first_name}@example.com", :login => 5.times.map{ ('a'..'z').to_a[rand(26)] }.join, :administrator => rand(2).even?)
    (1..(rand(99) + 1)).each do
      user.stamp()
    end
    
    persons.push(person)
    customers.push(customer)
    users.push(user)
  end
  
  (1..20).each do
    Factory.create(
      :repair, 
      :name => (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize,
      :phone => '555-555-5555',
      :item => (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize,
      :description => (1..(rand(99) + 1)).map{ (1...(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join }.join(' ').capitalize,
      :serial => (1...10).map{ ('a'..'z').to_a[rand(26)] }.join.upcase,
      :symptoms => (1..(rand(99) + 1)).map{ (1...(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join }.join(' ').capitalize,
      :notes => (1..(rand(99) + 1)).map{ (1...(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join }.join(' ').capitalize,
      :warranty => (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize,
      :cost => rand(10000),
      :receiver => (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize,
      :technician => (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize,
      :started => Time.now,
      :finished => Time.now,
      :status => rand(3),
      :contacted => rand(2).even?,
      :active => rand(2).even?)
  end
  
  person = Factory.create(:person, :first_name => 'Joe', :middle_name => 'Q', :last_name => 'Example')
  person.emails << Factory.create(:email, :person => person)
  person.addresses << Factory.create(:address, :person => person)
  person.phones << Factory.create(:phone, :person => person)
  user = Factory.create(:user, :person => person, :pin => '1111', :email => 'example@example.com', :login => 'login', :administrator => true)
  
  tills = []
    (1..3).each do |n|
      till = Factory.create(:till, :title => "Till #{n}", :retainable => true, :active => true)
      till.entries << Factory.create(:entry, :till => till, :user => user, :title => 'Initial Deposit', :amount => 50000)
      till.entries << Factory.create(:entry, :till => till, :user => user, :title => 'Initial Audit', :amount => 50000)
      tills.push(till)
    end

  items = []
    (1..100).each do |n|
      title = (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize
      description = (1..(rand(99) + 1)).map{ (1...(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join }.join(' ').capitalize
      tags = 'Foo, Bar'
      sku = (1...10).map{ ('a'..'z').to_a[rand(26)] }.join.upcase
      price = (rand(9999) + 1)
      credit_price = (price * 0.8).round
      cash_price = (credit_price / 2).round
      item = Factory.create(:item, :title => title, :description => description, :tags => tags, :sku => sku, :price => price, :credit => credit_price, :cash => cash_price,:taxable => rand(2).even?, :discountable => rand(2).even?, :locked => true, :active => true)
      item.properties << Factory.create(:property, :key => 'Foo', :value => 'Bar')
      items.push(item)
    end
  
  transaction = Factory.create(:transaction, :tax_rate => 0.07, :till => tills[0], :customer => customers[0], :user => user)
  (1...5).each do |n|
   item = items[n]
   transaction.lines << Factory.create(:line, :title => item.title, :description => item.description, :quantity => (rand(9) + 1), :price => item.price, :credit => item.credit, :cash => item.cash, :taxable => item.taxable, :discountable => item.discountable, :item => item, :transaction => transaction)
  end
  transaction.payments << Factory.create(:payment, :transaction => transaction, :form => 'cash', :amount => transaction.total)

else
  
  User.create(:person => Person.create(:first_name => 'Root', :last_name => 'User'), :email => 'root@example.com', :login => 'root', :password => 'password', :password_confirmation => 'password', :administrator => true)
  
end