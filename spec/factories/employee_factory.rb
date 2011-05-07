Factory.define :employee do |f|
  f.association :account_id, :factory => :account
  f.association :person_id, :factory => :person
  f.title 'Title'
  f.pin_hash Digest::SHA256.hexdigest(Time.now.to_s)
  f.pin_salt Digest::SHA256.hexdigest(Time.now.to_s)
  f.rate 1000
  f.manager true
  f.active true
end