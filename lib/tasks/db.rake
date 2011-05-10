namespace :db do
  desc "Backup the database to a file."
  task :backup => [:environment] do
    Dir.mkdir(File.join(Rails.root, '/tmp/backup')) unless File.directory? File.join(Rails.root, '/tmp/backup')
    
    adapter = Rails.configuration.database_configuration[Rails.env]['adapter']
    database = Rails.configuration.database_configuration[Rails.env]['database']
    username = Rails.configuration.database_configuration[Rails.env]['username']
    password = Rails.configuration.database_configuration[Rails.env]['password']
    file = File.join(Rails.root, "/tmp/backup/#{Time.now.strftime("%Y_%m_%d_%H_%M_%S")}_#{Rails.env}.sql")
    
    if adapter == 'sqlite3'
      sh "sqlite3 db/#{Rails.env}.sqlite3 '.backup #{file}'"
    elsif adapter == 'mysql2'
      sh "mysqldump --user=#{username} --password=#{password} #{database} > #{file}"
    end
  end
end