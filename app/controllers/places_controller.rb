class PlacesController < ApplicationController
  # GET /places
  # GET /places.xml
  protect_from_forgery :except => [:create,:new,:find_place]
  def index
    @places = Place.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render :xml => @places }
      format.iphone {render :layout => false} #index.iphone.erb
    end
  end

  # GET /places/1
  # GET /places/1.xml
  def show
    #@place = Place.find(params[:id])
    # get the current location from incming parameters
    if is_iphone_request? 
           
            current_lat = params[:current_lat].to_f
            current_lng = params[:current_lng].to_f
           # caculate the boundary of rectangle 
            lat_NE = current_lat + 5/111.0
            lng_NE = current_lng + 5/111.0
            lat_SW = current_lat - 5/111.0
            lng_SW = current_lng - 5/111.0
    
            # run query from place database 
            @place = Place.find(:all, 
                                :conditions => ["longtitude BETWEEN ? and ? and latitue BETWEEN ? and ?",lng_SW, lng_NE,lat_SW, lat_NE])
    
            #"and (places.longtitude between lng_NE and lng_SW)"
         
    else
      
        current_lat = params[:current_lat].to_f
        current_lng = params[:current_lng].to_f
        
        #run query to see if can find the matched places 
        @place = Place.find(:all, 
                            :conditions => ["longtitude = ? and latitue = ?", current_lng, current_lat])
  
    end 
      
    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render :xml => @place }
      format.js
      format.json { render :layout => false,
                    :json =>@place.to_json}
    end
  end
  
  #get the challenges based on inputed place_id
  def show_challenges
     @place = Place.find(params[:id])
     # render the show_challenges page for iphone 
      respond_to do |format|
        if @place
         format.html # show.html.erb
         format.iphone {render :layout => false} #show_challenges.iphone.erb
       else
         flash[:notice] = 'place not found!'
       end
     end
     
  end
  # get/post? /places with current_lat and current_lng
  def findplace
      respond_to do |format|
        format.js if request.xhr?
      end
    
  end

  # GET /places/new
  # GET /places/new.xml
  def new
    @place = Place.new

    respond_to do |format|
      format.html # new.html.erb
      format.xml  { render :xml => @place }
    end
  end

  # GET /places/1/edit
  def edit
    @place = Place.find(params[:id])
  end

  # POST /places
  # POST /places.xml
  def create
    @place = Place.new(params[:place])
    @place.save!
  #  session[:place_id] = @place.id
 #   session[:place_name] = @place.name
    
    respond_to do |format|
      format.json { render :layout => false,
                    :json =>@place.to_json}
    end
#redirect_to :back
    
  end

  # PUT /places/1
  # PUT /places/1.xml
  def update
    @place = Place.find(params[:id])

    respond_to do |format|
      if @place.update_attributes(params[:place])
        flash[:notice] = 'Place was successfully updated.'
        format.html { redirect_to(@place) }
        format.xml  { head :ok }
      else
        format.html { render :action => "edit" }
        format.xml  { render :xml => @place.errors, :status => :unprocessable_entity }
      end
    end
  end

  # DELETE /places/1
  # DELETE /places/1.xml
  def destroy
    @place = Place.find(params[:id])
    @place.destroy

    respond_to do |format|
      format.html { redirect_to(places_url) }
      format.xml  { head :ok }
    end
  end
end
