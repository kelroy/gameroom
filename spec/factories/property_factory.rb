Factory.define :property do |f|
  f.association :item_id, :factory => :item
  f.sequence(:key) { |n| "key_#{n}" }
  f.value "Bar"
end