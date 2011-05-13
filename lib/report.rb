module Report
  
  class ReportFactory
    def self.build(type, start_date, end_date)
      case type
      when 'transactions'
        return Transactions.new(type, start_date, end_date)
      when 'timecards'
        return Timecards.new(type, start_date, end_date)
      when 'timecard_summary'
        return Timecards.new(type, start_date, end_date)
      ##add a new report type here
      end
    end
  end

  class Report
  
    attr_accessor :type, :start_date, :end_date
      def initialize(type, start_date, end_date)
        @type, @start_date, @end_date = type, start_date, end_date
      end

  end

  class Transactions < Report
    attr_accessor :positive, :negative
    def initialize(type, start_date, end_date)
      super(type, start_date, end_date)
      self.compile
    end
  
    def compile
      @positive = Hash.new
      @negative = Hash.new
      @positive[:tax] = 0.0
    
      @transactions = Transaction.where('created_at >= ? AND created_at <= ?', @start_date + 5.hours, @end_date + 5.hours)
    
      @transactions.each do |transaction|
        ##@positive[:tax] += transaction.tax.to_f
      
        @payments = transaction.payments
        
        @lines = transaction.lines
        @lines.each do |line|
          subtotal = 0.0
          if line[:purchase] && line[:taxable]
            subtotal =  line[:quantity] * line[:condition] * line[:discount] * line[:price]
            @positive[:tax] += subtotal.to_f * transaction[:tax_rate].to_f
          end
        end
        
        ##end
        
        @payments.each do |payment|
          nil.to_i
          # if @positive[payment[:form]] == nil
          #            @positive[payment[:form]] = 0
          #          end
          #          
          #          if @negative[payment[:form]] == nil
          #            @negative[payment[:form]] = 0
          #          end
        
          if payment[:amount] > 0
            @positive[payment[:form]] = payment[:amount].to_i + @positive[payment[:form]].to_i
          else
            @negative[payment[:form]] = payment[:amount].to_i +  @negative[payment[:form]].to_i
          end
           
        end
      end  
    end
    
    
    
    
      # @positive = Hash.new
      #      @negative = Hash.new
      #      @transactions = Transaction.find(:all, :conditions => {:created_at => @start_date.beginning_of_day..@end_date.end_of_day})
      # 
      #      @transactions.each do |transaction|
      #        if transaction.lines
      #          transaction.lines.each do |line|
      # 
      #            if line[:price] == nil
      #               line[:price] = 0
      #            end
      # 
      #            if line[:quantity] == nil
      #               line[:quantity] = 0
      #            end
      # 
      #            if line[:price] > 0
      #              @payments = transaction.payments
      #              @payments.each do |payment|
      #              if payment[:amount] >0
      #                if payment[:form] == "store_credit"
      #                  @positive[:store_credit] = amount[:price].to_i + @positive[:store_credit].to_i
      #                else
      # 
      #                  if payment[:form] == "check"
      #                    @positive[:check] = line[:quantity].to_i * line[:price].to_i + @positive[:check].to_i
      #                  elsif payment[:form] == "credit_card"
      #                    @positive[:credit_card] = line[:quantity].to_i * line[:price].to_i + @positive[:credit_card].to_i
      #                  elsif payment[:form] == "gift_card"
      #                    @positive[:gift_card] = line[:quantity].to_i * line[:price].to_i + @positive[:gift_card].to_i
      #                  else
      #                    @positive[:cash] = line[:quantity].to_i * line[:price].to_i + @positive[:cash].to_i
      #                  end
      #                    if line[:taxable]
      #                      @positive[:tax] = line[:price].to_i*transaction[:tax_rate].to_f + @positive[:tax].to_f
      #                    end
      #                  end
      #                end
      #              end
      #            else
      #              @payments = transaction.payments
      #              @payments.each do |payment|
      #                @negative[:sum] = transaction.lines
      #                if payment[:amount].to_i != 0
      #                  if payment[:form] == "store_credit"
      # 
      #                    @negative[:store_credit] = payment[:amount].to_i + @negative[:store_credit].to_i
      #                  else
      #                    if payment[:form] == "check"
      #                      @negative[:check] = payment[:amount].to_i + @negative[:check].to_i
      #                    elsif payment[:form] == "credit_card"
      #                      @negative[:credit_card] = payment[:amount].to_i + @negative[:credit_card].to_i
      #                    elsif payment[:form] == "gift_card"
      #                      @negative[:gift_card] = payment[:amount].to_i + @negative[:gift_card].to_i
      #                    else
      #                      @negative[:cash] = payment[:amount].to_i + @negative[:cash].to_i
      #                    end
      #                  end
      #                end
      #              end  
      #            end
      # 
      #          end
      #        end
      #      end
      #      @start_date = @start_date.strftime("%Y-%m-%d")
      #      @end_date = @end_date.strftime("%Y-%m-%d")
    

  end

  class Timecards< Report
    attr_accessor :users, :users_timecard
    def initialize(type, start_date, end_date)
      super(type, start_date, end_date)
      self.compile
    end
  
    def compile
      @users = User.all
      @users_timecard = Hash.new
      sum = 0.0
      
      @users.each do |user|
        sum = 0.0
        @users_timecard[user.person.id] ||= {}
        @users_timecard[user.person.id][:first_name] = user.person.first_name.to_s
        @users_timecard[user.person.id][:middle_name] = user.person.middle_name.to_s
        @users_timecard[user.person.id][:last_name] = user.person.last_name.to_s
        timecards = user.timecards.where('begin >= ? AND begin <= ?', @start_date + 5.hours, @end_date + 5.hours)
        
        if timecards.count > 0
          timecards.each do |timecard|
            if timecard.end
              sum += self.fix_two((date_time_difference(timecard.begin, timecard.end).to_f))
              @users_timecard[user.person.id][timecard.id] =self.fix_two (date_time_difference(timecard.begin, timecard.end).to_f/3600.0)
            end
          end
        end
        @users_timecard[user.person.id][:timecards] = timecards
        @users_timecard[user.person.id][:sum] = self.fix_two (sum / 3600.0)
        
      end
      
    end
  
    def date_time_difference(initial_time, end_time)
      return ((end_time.to_time.to_i - initial_time.to_time.to_i).abs)
    end
    
    def fix_two number
      return ((number * 100.0).round)/100.0
    end
    
  end
end