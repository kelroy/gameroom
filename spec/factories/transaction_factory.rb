Factory.define :transaction do |f|
  f.association :account_id, :factory => :account
  f.association :store_id, :factory => :store
  f.association :till_id, :factory => :till
  f.association :customer_id, :factory => :customer
  f.association :employee_id, :factory => :employee
  f.payments ''
  f.tax_rate 0.07
  f.complete true
  f.locked true
end