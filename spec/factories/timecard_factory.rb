Factory.define :timecard do |f|
  f.association :user_id, :factory => :user
  f.begin Time.now
end