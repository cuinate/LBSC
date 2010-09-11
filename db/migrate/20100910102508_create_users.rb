class CreateUsers < ActiveRecord::Migration
  def self.up
    create_table :users do |t|
      t.string :name
      t.string :salt
      t.string :hashed_password
      t.string :profile_image_url
      t.string :isloading
      t.integar :challengcount
      t.integar :placevisitedcount
      t.points  :integar
      t.string  :sinaauthenticated
      t.string  :e_mail
      

      t.timestamps
    end
  end

  def self.down
    drop_table :users
  end
end
