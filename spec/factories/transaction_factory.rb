Factory.define :transaction do |f|
  f.association :store_id, :factory => :store
  f.association :customer_id, :factory => :customer
end