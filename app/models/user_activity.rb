class UserActivity < ActiveRecord::Base
  belongs_to :user_score,
           :class_name => "UserScore",
           :foreign_key => "user_id"
  belongs_to :user
  belongs_to :challenge,
             :class_name => "place",
             :foreign_key => "user_id"
  belongs_to :place
end