prawn_document(:page_size => [288, 576], :margin => [20, 20], :page_layout => :portrait) do |pdf|
  pdf.font "Times-Roman"
  pdf.font_size = 14
  
  pdf.text "Gameroom", :align => :center, :style => :bold, :size => 18
  pdf.text "1709 O St. Lincoln NE 68508", :align => :center, :size => 10
  pdf.text "402-438-7161", :align => :center, :size => 10
  pdf.move_down 10
  
  pdf.text "#{"ID #%09d" % @transaction.id}", :align => :center
  pdf.move_down 10
  pdf.text "#{@transaction.created_at.getlocal}", :align => :center
  pdf.move_down 10
  
  lines = @transaction.lines.map do |line|
    [
      line.quantity,
      truncate(line.item.title.upcase, :length => 10, :seperator => ''),
      number_to_currency(line.subtotal.to_f / 100)
    ]
  end
  
  payments = @transaction.payments.map do |payment|
    unless payment.amount == 0
      [payment.form.gsub('_', ' ').capitalize, number_to_currency(payment.amount.to_f / 100)]
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
end