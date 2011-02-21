Factory.define :employee do |f|
  f.rate 100
  f.sequence(:pin) { |n| "#{n + 1000}" } # Pin must have 4 digits
end