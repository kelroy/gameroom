namespace :javascript do
  
  task :development do
    raise "This task is only available in development environment!" unless Rails.env.development?
  end
  
  desc "Concatenate the application javascript"
  task :concatenate => :development do
    secretary = Sprockets::Secretary.new(
      :source_files => Dir[Rails.root.join('app/javascripts/**/*.js')]
    )
    secretary.concatenation.save_to(Rails.root.join('public/javascripts/application.js'))
  end
  
  desc "Minify the application javascript"
  task :minify do
    secretary = Sprockets::Secretary.new(
      :source_files => Dir[Rails.root.join('app/javascripts/**/*.js')]
    )
    File.open(Rails.root.join('public/javascripts/application.js'), 'w') { |file| file.write(JSMin.minify(secretary.concatenation.to_s)) }
  end
end