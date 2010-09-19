class AddChallengePlaceName < ActiveRecord::Migration
  def self.up
    add_column :challenges, :place_name , :string
  end

  def self.down
    remove_column :challenges, :place_name
  end
end
  
