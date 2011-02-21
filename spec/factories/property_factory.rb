Factory.define :property do |f|
  f.association :good_id, :factory => :good
  f.sequence(:key) { |n| "key_#{n}" }
  f.value "Bar"
end