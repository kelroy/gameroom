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
      @positive[:store_credit] = 0
      payment_net = 0
      sum = 0
      
      @transactions = Transaction.where('created_at >= ? AND created_at <= ?', @start_date + 5.hours, @end_date + 5.hours)
      @transactions.each do |transaction|
        line_subtotal = 0
        line_subtotal_ones = 0
        line_subtotal_zeros = 0
        taxable_subtotal = 0.0
        
        @payments = transaction.payments
        
        @lines = transaction.lines
        @lines.each do |line| 
          if line[:purchase] && line[:taxable]
            taxable_subtotal += line[:quantity] * line[:condition] * line[:price]
          elsif  line[:purchase] 
            line_subtotal_ones += line[:quantity] * line[:condition] * line[:price]
          else
            line_subtotal_zeros += line[:quantity] * line[:condition] * line[:price]
          end
        end
        
        if ((line_subtotal_ones + taxable_subtotal) - line_subtotal_zeros > 0)
          
          line_subtotal = (line_subtotal_ones + taxable_subtotal) - line_subtotal_zeros
        end
        
        if taxable_subtotal - line_subtotal_zeros > 0
          @positive[:tax] += taxable_subtotal * transaction[:tax_rate]
        end
        @payments.each do |payment|
          if !payment[:amount]
             payment[:amount] = 0
          end
          if !@positive[payment[:form]]
            @positive[payment[:form]] = 0
          end
          if !@negative[payment[:form]]
            @negative[payment[:form]] = 0
          end
          if payment[:amount] > 0
            @positive[payment[:form]] += payment[:amount].to_i
          else
            @negative[payment[:form]] += payment[:amount].to_i
          end
        end
        
        if !(@positive[:store_credit] < 0)
          sum += line_subtotal.to_i - @positive[:store_credit].to_i
        end
        
        
      
      end
      

      @positive[:sum] = sum.to_i
    end
    

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