class CreatePlaces < ActiveRecord::Migration
  def self.up
    create_table :places do |t|
      t.string   :name
      t.string   :description
      t.decimal  :latitue    ,:precision => 9, :scale => 6
      t.decimal  :longtitude ,:precision => 9, :scale => 6
      t.string   :postalcode
      t.string   :state
      t.string   :city
      t.string   :address

      t.timestamps
    end
  end

  def self.down
    drop_table :places
  end
end
