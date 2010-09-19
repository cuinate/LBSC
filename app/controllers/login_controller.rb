class LoginController < ApplicationController

  def login
    if request.post?
      user = User.authenticate(params[:e_mail], params[:password])
      if user 
        session[:user_id] = user.id
        redirect_to(:controller =>"users", :action =>"show")
      else
        flash.now[:notice] = "Invalid e-mail and user account!"
      end   
  end
 end 
  
  def logout
    session[:user_id] = nil
    session[:place_name] = nil
    session[:place_id] = nil
    redirect_to(:action => "login")
  end 

end

