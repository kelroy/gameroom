Factory.define :timecard do |f|
  f.association :account_id, :factory => :account
  f.association :user_id, :factory => :user
  f.begin Time.now
  f.end Time.now
end