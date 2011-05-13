require 'lib/report'
class Reports::ReportsController < ApplicationController
  before_filter :super_authenticate
  
  protect_from_forgery :only => [:create, :update, :destroy]
  
  def index
    self.get_input
    @type = session[:type]
    self.generate_report
  end
  
  def transactions
    @type = "transactions"
    session[:type] = @type
    self.get_input
    #self.generate_report
    render 'index'
  end
  
  def timecards
    @type = "timecards"
    session[:type] = @type
    self.get_input
    #self.generate_report
    render 'index'
  end
  
  def timecard_summary
    @type = "timecard_summary"
    session[:type] = @type
    self.get_input
    #self.generate_report
    render 'index'
  end
  
  def generate_report
    if params[:start_date]
        if @type && @start_date.class == DateTime && @end_date.class == DateTime
          @report = Report::ReportFactory.build(@type, @start_date, @end_date)  
        end
    else
      @start_date = DateTime.parse(Time.now.to_s)
      @end_date = @start_date
    end
  end
  
  def get_input
      if params[:start_date]

        @start_date = params[:start_date]
        @end_date = params[:end_date]

        @start_date_old = @start_date
        @end_date_old = @end_date
        @start_date = DateTime.parse(@start_date.to_s).beginning_of_day.to_time
        @end_date = DateTime.parse(@end_date.to_s).end_of_day.to_time
        
        #CDT offset
        #@start_date += 5.hours
        #@end_date += 5.hours

        ##button handler - previous/next day
        if params[:commit] == "Previous Day"
          @start_date = @start_date - 1.days
          @end_date = @end_date - 1.days
        elsif params[:commit] == "Next Day"
          @start_date = @start_date + 1.days
          @end_date = @end_date + 1.days
        end
        @start_date = @start_date.to_datetime
        @end_date = @end_date.to_datetime
        ##end button handler
      end
  end
end