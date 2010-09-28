class CreateUserActivities < ActiveRecord::Migration
  def self.up
    create_table :user_activities do |t|
      t.integer      :user_id
      t.integer      :place_id
      t.integer      :challenge_id
      t.string       :challenge_tweet
      t.string       :challenge_answer
      t.integer       :challenge_points
      t.integer       :checkin_type_id

      t.timestamps
    end
  end

  def self.down
    drop_table :user_activities
  end
end
