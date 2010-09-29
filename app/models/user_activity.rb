class UserActivity < ActiveRecord::Base
  belongs_to :user_score,
           :class_name => "UserScore",
           :foreign_key => "user_id"
end