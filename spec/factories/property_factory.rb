Factory.define :property do |f|
  f.sequence(:key) { |n| "key_#{n}" }
  f.value "Bar"
end