Factory.define :timecard do |f|
  f.association :account_id, :factory => :account
  f.association :employee_id, :factory => :employee
  f.begin Time.now
  f.end Time.now
end