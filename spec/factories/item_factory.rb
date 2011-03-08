Factory.define :item do |f|
  f.title 'Title'
  f.sequence(:sku) { |n| "#{n}" }
end