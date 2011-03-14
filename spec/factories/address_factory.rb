Factory.define :address do |f|
  f.association :person_id, :factory => :person
  f.first_line "555 Street Way"
  f.second_line "Suite 309"
  f.city "Lincoln"
  f.state "NE"
  f.country "US"
  f.zip "55555-5555"
end