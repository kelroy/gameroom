Factory.define :line do |f|
  f.association :transaction_id, :factory => :transaction
  f.association :item_id,        :factory => :item
  f.title "Title"
end