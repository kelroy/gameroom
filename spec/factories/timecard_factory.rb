Factory.define :timecard do |f|
  f.association :employee_id, :factory => :employee
  f.begin Time.now
end