class CreatePlaceScores < ActiveRecord::Migration
  def self.up
    create_table :place_scores do |t|
      
     t.integer :user_id
     t.integer :place_scores
     t.integer :place_attr_id

      t.timestamps
    end
  end

  def self.down
    drop_table :place_scores
  end
end
