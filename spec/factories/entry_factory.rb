Factory.define :entry do |f|
  f.association :account_id, :factory => :account
  f.association :till_id, :factory => :till
  f.association :user_id, :factory => :user
  f.title 'Title'
  f.description 'Lorem Ipsum...'
  f.time Time.now
  f.amount 0
end