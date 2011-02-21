Factory.define :email do |f|
  f.association :person_id, :factory => :person
  f.address "example@example.com"
end