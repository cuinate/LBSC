class AddForeignkeyToChallenge < ActiveRecord::Migration
  def self.up
    add_column :challenges, :place_id, :integer
    remove_column :challenges, :placeID
    add_foreign_key(:challenges, :places)
  end

  def self.down
    remove_column :challenges, :place_id
    add_column :challenges, :placeID, :integer
    remove_foreign_key(:challenges)
  end
end
