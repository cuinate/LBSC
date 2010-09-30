class UserActivityController < ApplicationController
   protect_from_forgery :except => [:create,:new]
  def create
    @user_activity = UserActivity.new
    @user_activity.checkin_type_id = params[:checkin_type_id]
		@user_activity.user_id = params[:user_id]
		@user_activity.place_id = params[:place_id]
		@user_activity.points = params[:points].to_i
		@user_activity.challenge_tweet = params[:challenge_tweet]
		@user_activity.challenge_id = params[:challenge_id]
		@user_activity.challenge_answer= params[:challenge_answer]
   
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
     place_id = params[:place_id]
     user_id  = params[:user_id]
     if place_id
         @user_activity = UserActivity.find(:all, 
                              :conditions => ["place_id = ?",place_id], :order => "created_at DESC")
     end
     
      if user_id
        @user_activity = UserActivity.find(:all, 
                             :conditions => ["user_id = ?",user_id])
      end        
      
             
     respond_to do |format|
          if @user_activity
            format.html # show.html.erb
            format.xml  { render :xml => @place }
            format.iphone { render :layout => false}
            format.js { render :layout => false}
          else
            flash[:notice] = 'something wrong'
          end
        end
    
  end

  def new
    @user_activity = UserActivity.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @user_activity }
    end
  end

end
