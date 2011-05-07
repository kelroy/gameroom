Factory.define :customer do |f|
  f.association :account_id, :factory => :account
  f.association :person_id, :factory => :person
  f.credit 100
  f.notes 'Lorem Ipsum...'
  f.active true
end