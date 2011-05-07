Factory.define :article do |f|
  f.sequence(:token) { |n| "article_#{n}" }
  f.title 'Title'
  f.body 'Lorem Ipsum...'
end