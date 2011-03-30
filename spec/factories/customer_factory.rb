Factory.define :customer do |f|
  f.association :person_id, :factory => :person
  f.credit 100
  f.drivers_license_number 'H1200000'
  f.drivers_license_state 'NE'
  f.notes "Lorem Ipsum..."
end