Factory.define :shift do |f|
  f.association :account_id, :factory => :account
  f.association :user_id, :factory => :user
  f.title 'Title'
  f.description 'Lorem Ipsum...'
  f.begin Time.now
  f.end Time.now
  f.active true
end