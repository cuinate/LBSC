class AddRelationsKeyToActivity < ActiveRecord::Migration
  def self.up
     add_foreign_key(:user_activities, :users)
     add_foreign_key(:user_activities, :challenges)
     add_foreign_key(:user_activities, :places)
  end

  def self.down
    remove_foreign_key(:user_activities)
    remove_foreign_key(:user_activities)
    remove_foreign_key(:user_activities)
  end
end
