class IndexController < ApplicationController
  def index
    userid = session[:user_id]
    if userid
      @user = User.find(userid)
       respond_to do |format|
           format.html # show.html.erb
           format.js {render :layout => false}
           format.iphone #index.iphone.erb
       end
    else
       respond_to do |format|
          format.html # show.html.erb
          format.iphone # index.iphone.erb
       end
    end
    
  end
end
