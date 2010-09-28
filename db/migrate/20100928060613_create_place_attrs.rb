class CreatePlaceAttrs < ActiveRecord::Migration
  def self.up
    create_table :place_attrs do |t|
      t.string    :attr_name
      t.integer   :points
      t.string    :key_words
      t.integer   :time_span

      t.timestamps
    end
  end

  def self.down
    drop_table :place_attrs
  end
end
