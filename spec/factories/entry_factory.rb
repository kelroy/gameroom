Factory.define :entry do |f|
  f.association :account_id, :factory => :account
  f.association :till_id, :factory => :till
  f.association :employee_id, :factory => :employee
  f.title 'Title'
  f.description 'Lorem Ipsum...'
  f.time Time.now
  f.amount 0
end