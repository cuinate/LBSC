class LoginController < ApplicationController
 protect_from_forgery :except => [:login,:logout]
  def login
    
    respond_to do |format|
         format.html # login.html.erb
         format.js {render :layout => false}
         format.iphone {render :layout => false} #index.iphone.erb
    end
    
  
 end 
  
  def logout
    session[:user_id] = nil
    session[:place_name] = nil
    session[:place_id] = nil
    redirect_to(:action => "login")
  end 
  
  def checkin
      if request.post?
        user = User.authenticate(params[:e_mail], params[:password])
        if user 
          session[:user_id] = user.id
          if is_iphone_request?
              redirect_to(:controller =>"places", :action =>"index")
          else
              redirect_to(:controller =>"users", :action =>"show")
         end
        else
          flash.now[:notice] = "Invalid e-mail and user account!"
        end   
     end
  end

end

