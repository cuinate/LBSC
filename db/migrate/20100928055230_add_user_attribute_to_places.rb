class AddUserAttributeToPlaces < ActiveRecord::Migration
  def self.up
    add_column :places, :user_id, :integer
    add_column :places, :attr_id, :integer
  end

  def self.down
    remove_column :places, :user_id
    remove_column :places, :attr_id
  end
end
