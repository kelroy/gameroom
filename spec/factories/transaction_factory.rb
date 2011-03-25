Factory.define :transaction do |f|
  f.association :till_id, :factory => :till
  f.association :customer_id, :factory => :customer
  f.association :user_id, :factory => :user
end