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
  employees = []
  (1..20).each do
    first = (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize
    middle = (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize
    last = (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize
    person = Factory.create(:person, :first_name => first, :middle_name => middle, :last_name => last)
    person.emails << Factory.create(:email, :person => person)
    person.addresses << Factory.create(:address, :person => person)
    person.phones << Factory.create(:phone, :person => person)
    
    customer = Factory.create(:customer, :person => person, :credit => (rand(9999) + 1), :drivers_license_number => (1...(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.upcase, :drivers_license_state => 'NE', :active => true)
    employee = Factory.create(:employee, :person => person, :rate => (rand(19) + 1), :active => true)
    employee.timecards << Factory.create(:timecard, :employee => employee, :begin => Time.now, :end => Time.now)
    employee.timecards << Factory.create(:timecard, :employee => employee, :begin => Time.now, :end => Time.now)

    persons.push(person)
    customers.push(customer)
    employees.push(employee)
  end
  
  person = Factory.create(:person, :first_name => 'Joe', :middle_name => 'Q', :last_name => 'Example')
  person.emails << Factory.create(:email, :person => person)
  person.addresses << Factory.create(:address, :person => person)
  person.phones << Factory.create(:phone, :person => person)
  user = Factory.create(:user, :person => person, :pin => '1111', :email => 'example@example.com', :login => 'login', :administrator => true)
  
  tills = []
  (1..3).each do |n|
    till = Factory.create(:till, :title => "Till #{n}", :retainable => true, :active => true)
    till.entries << Factory.create(:entry, :till => till, :title => 'Initial Deposit', :amount => 50000)
    till.entries << Factory.create(:entry, :till => till, :title => 'Initial Audit', :amount => 50000)
    till.users << user
    tills.push(till)
  end

  items = []
  (1..100).each do |n|
    title = (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize
    description = (1..(rand(99) + 1)).map{ (1...(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join }.join(' ').capitalize
    sku = (1...10).map{ ('a'..'z').to_a[rand(26)] }.join.upcase
    price = (rand(9999) + 1)
    credit_price = (price * 0.8).round
    cash_price = (credit_price / 2).round
    item = Factory.create(:item, :title => title, :description => description, :sku => sku, :price => price, :credit => credit_price, :cash => cash_price,:taxable => rand(100).even?, :locked => true, :active => true)
    item.properties << Factory.create(:property, :item => item, :key => 'Foo', :value => 'Bar')
    items.push(item)
  end
  
  transaction = Factory.create(:transaction, :tax_rate => 0.07, :till => tills[0], :customer => customers[0], :user => user)
  (1...5).each do |n|
    item = items[n]
    transaction.lines << Factory.create(:line, :title => item.title, :quantity => (rand(9) + 1), :price => item.price, :credit => item.credit, :cash => item.cash, :taxable => item.taxable, :item => item, :transaction => transaction)
  end
  transaction.payments << Factory.create(:payment, :transaction => transaction, :form => 'cash', :amount => transaction.total)

else
  
  User.create(:person => Person.create(:first_name => 'Root', :last_name => 'User'), :email => 'root@example.com', :login => 'root', :password => 'password', :password_confirmation => 'password', :administrator => true)
  
end