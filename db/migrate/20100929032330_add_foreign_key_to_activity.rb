class AddForeignKeyToActivity < ActiveRecord::Migration
  def self.up
    
    execute "ALTER TABLE `user_activities` ADD CONSTRAINT `user_activities_user_fk` FOREIGN KEY (`user_id`) REFERENCES `user_scores`(user_id)"
   

  def self.down
    
  end
end
