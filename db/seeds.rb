# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ :name => 'Chicago' }, { :name => 'Copenhagen' }])
#   Mayor.create(:name => 'Daley', :city => cities.first)

unless Rails.env.production?
  
  account = Factory.create(:account, :title => 'Example', :token => 'example')
  store = Factory.create(:store, :account => account)
  
  locations = []
  (1..5).each do
    location = Factory.create(:location, :account => account, :store => store)
    locations.push(location)
  end
  
  customers = []
  users = []
  (1..20).each do
    first = (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize
    middle = (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize
    last = (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize
    person = Factory.create(:person, :account => account, :first_name => first, :middle_name => middle, :last_name => last, :date_of_birth => Time.now, :ssn => '555-55-5555', :drivers_license => (1...(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.upcase)
    person.emails = ['example@example.com']
    person.addresses = ['555 Street Way, Lincoln, NE 68508']
    person.phones = ['444-5555']
    person.save
    
    customer = Factory.create(:customer, :account => account, :person => person, :credit => (rand(9999) + 1), :notes => 'Lorem Ipsum...', :active => rand(2).even?)
    user = Factory.create(:user, :account => account, :person => person, :rate => (rand(19) + 1), :administrator => rand(2).even?)
    (1..(rand(99) + 1)).each do
      user.stamp()
      Factory.create(:shift, :account => account, :user => user)
    end
    
    customers.push(customer)
    users.push(user)
  end
  
  first = 'Joe'
  middle = 'Q'
  last = 'Example'
  person = Factory.create(:person, :account => account, :first_name => first, :middle_name => middle, :last_name => last, :date_of_birth => Time.now, :ssn => '555-55-5555', :drivers_license => (1...(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.upcase)
  person.emails = ['example@example.com']
  person.addresses = ['555 Street Way, Lincoln, NE 68508']
  person.phones = ['444-5555']
  person.save
  
  user = Factory.create(:user, :account => account, :person => person, :token => 'login', :rate => (rand(19) + 1), :administrator => rand(2).even?)
  (1..(rand(99) + 1)).each do
    user.stamp()
    Factory.create(:shift, :account => account, :user => user)
  end
  
  tills = []
  (1..3).each do |n|
    till = Factory.create(:till, :account => account, :store => store, :title => "Till #{n}", :retainable => true, :active => true)
    till.entries << Factory.create(:entry, :account => account, :till => till, :user => User.first, :title => 'Audit', :amount => 50000)
    tills.push(till)
  end

  items = []
  units = []
  (1..100).each do |n|
    price = (rand(9999) + 1)
    credit = (price * 0.8).round
    params = {
      :account => account,
      :title => (1..(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join.capitalize,
      :description => (1..(rand(99) + 1)).map{ (1...(rand(9) + 1)).map{ ('a'..'z').to_a[rand(26)] }.join }.join(' ').capitalize,
      :tags => ['Foo', 'Bar'],
      :properties => [{:key => 'Foo', :value => 'Bar'}, {:key => 'Foo', :value => 'Bar'}],
      :sku => (1...10).map{ ('a'..'z').to_a[rand(26)] }.join.upcase,
      :price => price,
      :credit => credit,
      :cash => (credit / 2).round,
      :taxable => rand(2).even?,
      :discountable => rand(2).even?,
      :locked => rand(2).even?,
      :active => rand(2).even?
    }
    item = Factory.create(:item, params)
    items.push(item)
    
    (1..(rand(9) + 1)).each do |n|
      unit = Factory.create(:unit, :account => account, :item => item, :location => locations[rand(4)], :condition => rand(100) * 0.01)
      units.push(unit)
    end
  end
  
  (1..100).each do |n|
    transaction = Factory.create(:transaction, :account => account, :store => store, :till => tills[rand(2)], :customer => customers[rand(19)], :user => users[rand(19)], :tax_rate => 0.07)
    
    (1..(rand(9) + 1)).each do |n|
      if rand(2).even?
        item = items[rand(99)]
        unit = Unit.new
      else
        item = items[rand(99)]
        unit = Unit.where('item_id = ?', item.id).first
      end
      
      params = {
        :account => account,
        :transaction => transaction,
        :item => item,
        :unit => unit,
        :title => item.title,
        :quantity => rand(9),
        :condition => unit.condition,
        :discount => rand(100) * 0.01,
        :price => item.price,
        :credit => item.credit,
        :cash => item.cash,
        :purchase => rand(2).even?,
        :taxable => item.taxable
      }
      transaction.lines << Factory.create(:line, params)
    end
    
    transaction.payments = [{:form => 'store_credit', :amount => transaction.total}]
    transaction.save
  end
end