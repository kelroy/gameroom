Factory.define :user do |f|
  f.sequence(:login) { |n| "login_#{n}" }
  f.sequence(:email) { |n| "email#{n}@example.com" }
  f.password 'password'
  f.password_confirmation { |u| u.password }
end