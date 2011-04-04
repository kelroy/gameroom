Factory.define :user do |f|
  f.association :person_id, :factory => :person
  f.sequence(:login) { |n| "login_#{n}" }
  f.sequence(:email) { |n| "email#{n}@example.com" }
  f.sequence(:pin)   { |n| "#{(n + 1000).to_s}" } # Pin must have 4 digits
  f.password 'password'
  f.password_confirmation { |u| u.password }
end