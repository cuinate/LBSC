class CreateCheckinTypes < ActiveRecord::Migration
  def self.up
    create_table :checkin_types do |t|
    t.string    :checkin_type
    t.integer   :points

      t.timestamps
    end
  end

  def self.down
    drop_table :checkin_types
  end
end
