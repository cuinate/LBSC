class UserScore < ActiveRecord::Base
  has_many :user_activity
end