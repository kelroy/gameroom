Factory.define :phone do |f|
  f.association :person_id, :factory => :person
  f.number "555-555-5555"
end