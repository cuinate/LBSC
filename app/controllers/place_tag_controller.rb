class PlaceTagController < ApplicationController
  protect_from_forgery :except => [:create,:new]
  def create
    
     @place_tag = PlaceTag.new
     @place_tag.place_id = params[:place_id]
     @place_tag.tag_name = params[:tag_name]
     @place_tag.user_id = params[:user_id]
     
     if request.xhr? 
         request.format = :js
     end
     
     respond_to do |format|
       if @place_tag.save
         flash[:notice] = 'Challenge was successfully created.'
         format.iphone
         format.html { redirect_to(@place_tag) }
         format.js
       else
         format.html { render :action => "new" }
         format.xml  { render :xml => @place_tag.errors, :status => :unprocessable_entity }
       end
     end
    
  end
end
