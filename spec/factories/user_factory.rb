Factory.define :user do |f|
  f.association :account_id, :factory => :account
  f.association :person_id, :factory => :person
  f.title 'Title'
  f.sequence(:token) { |n| "user_#{n}" }
  f.password 'password'
  f.password_confirmation 'password'
  f.rate 1000
  f.administrator true
  f.active true
end