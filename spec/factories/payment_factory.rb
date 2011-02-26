Factory.define :payment do |f|
  f.association :transaction_id, :factory => :transaction
  f.form 'cash'
  f.amount 0
end