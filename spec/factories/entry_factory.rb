Factory.define :entry do |f|
  f.association :till_id, :factory => :till
  f.title 'Title'
  f.amount 0
  f.action 'debit'
end