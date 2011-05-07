Factory.sequence :location do |n|
  n
end

Factory.define :location do |f|
  f.association :account_id, :factory => :account
  f.association :store_id, :factory => :store
  f.title 'Title'
  f.description 'Lorem Ipsum...'
  f.sequence(:lft) { |n| Factory.next(:location) }
  f.sequence(:rgt) { |n| Factory.next(:location) }
  f.active true
end