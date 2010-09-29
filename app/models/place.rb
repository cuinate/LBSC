class Place < ActiveRecord::Base
  has_many :challenges
  has_many :user_activity
  
end
