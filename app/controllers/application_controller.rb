# Filters added to this controller apply to all controllers in the application.
# Likewise, all the methods added will be available for all controllers.

class ApplicationController < ActionController::Base
  helper :all # include all helpers, all the time
  protect_from_forgery # See ActionController::RequestForgeryProtection for details
  before_filter :set_iphone_format #set iphone format if browsing request from iphone or android phon

  # Scrub sensitive parameters from your log
  # filter_parameter_logging :password
  
  helper_method :is_iphone_request? 


# function for before filter of rails
  def set_iphone_format
    if is_iphone_request?
      if request.xhr? 
        request.format = :js
      else
      request.format = :iphone
    end
    end
  end

# for deteting the user agent of browser who sending the request
    def is_iphone_request?
      request.user_agent =~ /(Mobile)/
    end 
end
