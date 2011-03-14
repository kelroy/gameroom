Factory.define :person do |f|
  f.first_name "First"
  f.middle_name "Middle"
  f.last_name "Last"
  f.date_of_birth Time.now
end