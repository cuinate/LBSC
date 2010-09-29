class UserActivityController < ApplicationController
   protect_from_forgery :except => [:create,:new]
  def create
    @user_activity = UserActivity.new
    @user_activity.checkin_type_id = params[:checkin_type_id]
		@user_activity.user_id = params[:user_id]
		@user_activity.place_id = params[:place_id]
		@user_activity.points = params[:points]
   
   # add current activity's points into user_scores table.
   if @user_activity.user_score
        @user_activity.user_score.scores = @user_activity.user_score.scores + 	@user_activity.points
        @user_activity.user_score.places_visited_count = @user_activity.user_score.places_visited_count + 1
        @user_activity.user_score.challenges_done_count =   @user_activity.user_score.challenges_done_count + 1
        @user_activity.user_score.save
   else
     @user_activity.user_score = UserScore.new(:user_id => @user_activity.user_id,
                                              :places_visited_count => 1,
                                              :challenges_done_count => 1,
                                              :scores => @user_activity.points)
   end 
    
     if request.xhr? 
        request.format = :js
     end 
    respond_to do |format|
      if @user_activity.save!
        flash[:notice] = 'Challenge was successfully created.'
        format.iphone
        format.html { redirect_to(@UserActivity) }
        format.js
      else
        format.html { render :action => "new" }
        format.xml  { render :xml => @UserActivity.errors, :status => :unprocessable_entity }
      end
    end
  end

  def show
  end

  def new
    @user_activity = UserActivity.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @user_activity }
    end
  end

end
