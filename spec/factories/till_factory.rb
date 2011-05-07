Factory.define :till do |f|
  f.association :account_id, :factory => :account
  f.association :store_id, :factory => :store
  f.title 'Title'
  f.description 'Lorem Ipsum...'
  f.minimum_transfer 0
  f.minimum_balance 0
  f.retainable true
  f.active true
end