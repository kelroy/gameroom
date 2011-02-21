Factory.define :entry do |f|
  f.association :transaction_id, :factory => :transaction
  f.title 'Title'
  f.price 0
  f.quantity 0
end