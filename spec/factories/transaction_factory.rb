Factory.define :transaction do |f|
  f.association :till_id, :factory => :till
  f.association :customer_id, :factory => :customer
end