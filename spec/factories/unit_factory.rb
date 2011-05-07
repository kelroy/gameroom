Factory.define :unit do |f|
  f.association :account_id, :factory => :account
  f.association :item_id, :factory => :item
  f.association :location_id, :factory => :location
  f.condition 1.0
  f.active true
end