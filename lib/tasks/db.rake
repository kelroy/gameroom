require 'find'

namespace :db do
  task :production do
    raise "This task is only available in production environment!" unless Rails.env.production?
  end
  
  desc "Backup the database to a file."
  task :backup => [:environment, :production] do
    Dir.mkdir(File.join(Rails.root, '/tmp/backup')) unless File.directory? File.join(Rails.root, '/tmp/backup')
    Dir.glob(File.join(Rails.root, '/tmp/backup/*.sql.gz')).each { |f| File.delete f }
    config = ActiveRecord::Base.configurations[Rails.env]
    file = File.join(Rails.root, "/tmp/backup/#{Time.now.strftime("%Y_%m_%d_%H_%M_%S")}.sql.gz")
    sh "mysqldump --user=#{config['username']} --password=#{config['password']} #{config['database']} | gzip -c > #{file}"
  end
end