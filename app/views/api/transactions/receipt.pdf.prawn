prawn_document(:page_size => [288, 576], :margin => [20, 20], :page_layout => :portrait) do |pdf|
  pdf.font "Times-Roman"
  pdf.font_size = 14
  
  pdf.text "Gameroom", :align => :center, :style => :bold, :size => 18
  pdf.text "1713 O St. Lincoln NE 68508", :align => :center, :size => 10
  pdf.text "402-438-7161", :align => :center, :size => 10
  pdf.move_down 10
  
  pdf.text "#{"ID #%09d" % @transaction.id}", :align => :center
  pdf.move_down 10
  unless @transaction.user.nil?
    pdf.text "#{@transaction.user.login}", :align => :center
    pdf.move_down 10
  end
  pdf.text "#{@transaction.created_at.getlocal}", :align => :center
  pdf.move_down 10
  
  lines = @transaction.lines.map do |line|
    [
      line.quantity,
      truncate(line.title.upcase, :length => 10, :seperator => ''),
      number_to_currency(line.subtotal.to_f / 100)
    ]
  end
  
  
  payments = []
  @transaction.payments.each do |payment|
    unless payment.amount == 0
      payments.push([payment.form.gsub('_', ' ').split(' ').each{|word| word.capitalize!}.join(' '), number_to_currency(payment.amount.to_f / 100)])
    end
  end
  summary = [
    ['Subtotal', number_to_currency(@transaction.subtotal.to_f / 100)],
    ['Tax', number_to_currency(@transaction.tax.to_f / 100)],
    ['', '========='],
    ['Total', number_to_currency(@transaction.total.to_f / 100)],
    ['', '========='],
    ['Change', number_to_currency(@transaction.change.to_f / 100)],
  ]
  payments.each do |payment|
    summary.insert(-2, payment)
  end
  
  pdf.table lines,
    :width => pdf.bounds.width,
    :headers => ["Qty", "Item", "Subtotal"],
    :align => :right,
    :padding => 1,
    :border_width => 0  
  pdf.move_down 20
  pdf.table summary,
    :width => pdf.bounds.width,
    :align => :right,
    :padding => 1,
    :border_width => 0
  
  pdf.move_down 20
  unless @transaction.customer.nil?
    pdf.text "#{@transaction.customer.person.first_name} #{@transaction.customer.person.last_name}", :align => :center
    pdf.move_down 10
    pdf.text "Store Credit: #{number_to_currency @transaction.customer.credit.to_f / 100}", :align => :center
    pdf.move_down 10
  end
  pdf.text "Open 10a-10p 7 Days", :align => :center
  pdf.move_down 10
  pdf.text "www.gameroomlincoln.com", :align => :center
  pdf.move_down 10
  pdf.text "www.facebook.com/gameroomforpresident", :align => :center
end