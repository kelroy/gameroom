Factory.define :employee do |f|
  f.association :person_id, :factory => :person
  f.rate 0
end