Factory.define :entry do |f|
  f.association :till_id, :factory => :till
  f.association :user_id, :factory => :user
  f.title 'Title'
  f.amount 0
end