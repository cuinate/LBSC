class IndexController < ApplicationController
  def index
    userid = session[:user_id]
    if userid
      @user = User.find(userid)
       respond_to do |format|
           format.html # show.html.erb
           format.js {render :layout => false}
       end
    else
       respond_to do |format|
          format.html # show.html.erb
       end
    end
    
  end
end
