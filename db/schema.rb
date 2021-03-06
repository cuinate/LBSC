# This file is auto-generated from the current state of the database. Instead of editing this file, 
# please use the migrations feature of Active Record to incrementally modify your database, and
# then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your database schema. If you need
# to create the application database on another system, you should be using db:schema:load, not running
# all the migrations from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20100929084527) do

  create_table "challenges", :force => true do |t|
    t.string   "name"
    t.integer  "points"
    t.string   "description"
    t.string   "question"
    t.string   "answer"
    t.string   "message"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.string   "place_name"
    t.integer  "place_id"
  end

  add_index "challenges", ["place_id"], :name => "challenges_place_id_fk"

  create_table "checkin_types", :force => true do |t|
    t.string   "checkin_type"
    t.integer  "points"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "place_attrs", :force => true do |t|
    t.string   "attr_name"
    t.integer  "points"
    t.string   "key_words"
    t.integer  "time_span"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "place_scores", :force => true do |t|
    t.integer  "user_id"
    t.integer  "place_scores"
    t.integer  "place_attr_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "place_tags", :force => true do |t|
    t.integer  "place_id"
    t.integer  "user_id"
    t.string   "tag_name"
    t.integer  "place_attr_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "places", :force => true do |t|
    t.string   "name"
    t.string   "description"
    t.decimal  "latitue",     :precision => 9, :scale => 6
    t.decimal  "longtitude",  :precision => 9, :scale => 6
    t.string   "postalcode"
    t.string   "state"
    t.string   "city"
    t.string   "address"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.integer  "attr_id"
  end

  create_table "sessions", :force => true do |t|
    t.string   "session_id", :null => false
    t.text     "data"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "sessions", ["session_id"], :name => "index_sessions_on_session_id"
  add_index "sessions", ["updated_at"], :name => "index_sessions_on_updated_at"

  create_table "user_activities", :force => true do |t|
    t.integer  "user_id"
    t.integer  "place_id"
    t.integer  "challenge_id"
    t.string   "challenge_tweet"
    t.string   "challenge_answer"
    t.integer  "challenge_points"
    t.integer  "checkin_type_id"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "points"
  end

  add_index "user_activities", ["challenge_id"], :name => "user_activities_challenge_id_fk"
  add_index "user_activities", ["place_id"], :name => "user_activities_place_id_fk"
  add_index "user_activities", ["user_id"], :name => "user_id_index"

  create_table "user_scores", :force => true do |t|
    t.integer  "user_id"
    t.integer  "scores"
    t.integer  "places_visited_count"
    t.integer  "challenges_done_count"
    t.integer  "challenges_create_count"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "user_scores", ["user_id"], :name => "user_id_index"

  create_table "users", :force => true do |t|
    t.string   "name"
    t.string   "salt"
    t.string   "hashed_password"
    t.string   "profile_image_url"
    t.string   "isloading"
    t.integer  "challengcount"
    t.integer  "placevisitedcount"
    t.string   "sinaauthenticated"
    t.string   "e_mail"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_foreign_key "challenges", "places", :name => "challenges_place_id_fk"

  add_foreign_key "user_activities", "challenges", :name => "user_activities_challenge_id_fk"
  add_foreign_key "user_activities", "places", :name => "user_activities_place_id_fk"
  add_foreign_key "user_activities", "user_scores", :name => "user_scores_fk", :column => "user_id", :primary_key => "user_id"
  add_foreign_key "user_activities", "users", :name => "user_activities_user_id_fk"

end
