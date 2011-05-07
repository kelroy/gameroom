Factory.define :account do |f|
  f.sequence(:title) { |n| "Account #{n}" }
  f.sequence(:token) { |n| "account_#{n}" }
  f.sequence(:api_key) { |n| Digest::SHA256.hexdigest(n.to_s) }
  f.sequence(:api_secret) { |n| Digest::SHA256.hexdigest(n.to_s) }
  f.active true
end