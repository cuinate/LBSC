class AddForeignKeyToActivity < ActiveRecord::Migration
  def self.up
    execute "ALTER TABLE user_activities ADD INDEX user_id_index (user_id)"  
    execute "ALTER TABLE user_scores ADD INDEX user_id_index (user_id)"    
    
    execute " ALTER TABLE user_activities ADD CONSTRAINT user_scores_fk FOREIGN KEY (user_id) REFERENCES user_scores(user_id)"

    
   
  end 
  def self.down
    
    execute "ALTER TABLE user_activities DROP INDEX user_id_index"

    execute "ALTER TABLE user_activities FOREIGN KEY user_scores_fk "
    
  end
end
