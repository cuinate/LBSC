class CreateChallenges < ActiveRecord::Migration
  def self.up
    create_table :challenges do |t|
      t.string     :name
      t.integer    :placeID
      t.integer    :points
      t.string     :description
      t.string     :question
      t.string     :answer
      t.string     :message
      

      t.timestamps
    end
  end

  def self.down
    drop_table :challenges
  end
end
