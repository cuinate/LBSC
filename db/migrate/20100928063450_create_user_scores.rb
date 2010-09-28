class CreateUserScores < ActiveRecord::Migration
  def self.up
    create_table :user_scores do |t|
      t.integer     :user_id
      t.integer     :scores
      t.integer     :places_visited_count
      t.integer     :challenges_done_count
      t.integer     :challenges_create_count
      t.integer     :knowledge_score
      t.integer     :tech_score
      t.timestamps
    end
  end

  def self.down
    drop_table :user_scores
  end
end
