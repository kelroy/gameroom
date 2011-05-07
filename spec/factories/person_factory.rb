Factory.define :person do |f|
  f.association :account_id, :factory => :account
  f.first_name 'First'
  f.middle_name 'Middle'
  f.last_name 'Last'
  f.date_of_birth Time.now
  f.drivers_license 'NE - H1200000'
  f.ssn '111-11-1111'
  f.emails ''
  f.phones ''
  f.addresses ''
end