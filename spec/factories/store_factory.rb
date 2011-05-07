Factory.define :store do |f|
  f.association :account_id, :factory => :account
  f.title 'Title'
  f.description 'Lorem Ipsum...'
  f.url 'http://www.example.com'
  f.active true
end