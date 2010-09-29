class Challenge < ActiveRecord::Base
  belongs_to :place
  has_many :user_activity
  
end
