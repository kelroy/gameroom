Factory.define :line do |f|
  f.association :account_id,      :factory => :account
  f.association :transaction_id,  :factory => :transaction
  f.association :item_id,         :factory => :item
  f.association :unit_id,         :factory => :unit
  f.title 'Title'
  f.quantity 1
  f.condition 1.0
  f.discount 1.0
  f.price 1000
  f.credit 500
  f.cash 300
  f.purchase true
  f.taxable true
end