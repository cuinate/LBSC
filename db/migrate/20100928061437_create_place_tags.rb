class CreatePlaceTags < ActiveRecord::Migration
  def self.up
    create_table :place_tags do |t|
      t.integer    :place_id
      t.integer    :user_id
      t.string     :tag_name
      t.integer    :place_attr_id
      t.timestamps
      
    end
  end

  def self.down
    drop_table :place_tags
  
  end
end
