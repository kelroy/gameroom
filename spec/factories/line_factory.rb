Factory.define :line do |f|
  f.association :transaction_id, :factory => :transaction
  f.association :item_id,        :factory => :item
  f.quantity 0
  f.price 0
end