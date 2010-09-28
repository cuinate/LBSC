class UserActivityController < ApplicationController
   protect_from_forgery :except => [:create,:new]
  def create
    @user_activity = UserActivity.new
    @user_activity.checkin_type_id = params[:checkin_type_id]
		@user_activity.user_id = params[:user_id]
		@user_activity.place_id = params[:place_id]
		@user_activity.points = params[:points]
   
    
     if request.xhr? 
        request.format = :js
     end 
    respond_to do |format|
      if @user_activity.save
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
