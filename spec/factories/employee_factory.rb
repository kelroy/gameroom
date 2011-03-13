Factory.define :employee do |f|
  f.rate 0
  f.sequence(:pin) { |n| "#{(n + 1000).to_s}" } # Pin must have 4 digits
end