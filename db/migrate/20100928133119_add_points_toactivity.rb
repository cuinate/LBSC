class AddPointsToactivity < ActiveRecord::Migration
  def self.up
    add_column :user_activities, :points , :integer
  end

  def self.down
    remove_column :user_activities, :points

  end
end
