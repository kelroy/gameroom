Factory.define :item do |f|
  f.association :account_id, :factory => :account
  f.title 'Title'
  f.description 'Lorem Ipsum...'
  f.image ''
  f.tags ''
  f.properties ''
  f.sequence(:sku) { |n| "#{n}" }
  f.price 1000
  f.credit 500
  f.cash 300
  f.taxable true
  f.discountable true
  f.locked false
  f.active true
end