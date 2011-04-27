prawn_document(:page_size => [288, 576], :margin => [20, 20], :page_layout => :portrait) do |pdf|
  pdf.font "Times-Roman"
  pdf.font_size = 14
  
  pdf.text "Gameroom", :align => :center, :style => :bold, :size => 18
  pdf.text "1713 O St. Lincoln NE 68508", :align => :center, :size => 10
  pdf.text "402-438-7161", :align => :center, :size => 10
  pdf.move_down 10
  
  rows = [
    ['ID', @repair.id],
    ['Name', @repair.name],
    ['Phone', @repair.phone],
    ['Item', @repair.item],
    ['Serial', @repair.serial],
    ['Receiver', @repair.receiver],
    ['Date', @repair.created_at.strftime('%m/%d/%Y %I:%M:%S %p')]
  ]
  
  pdf.table rows,
    :width => pdf.bounds.width,
    :headers => ["", ""],
    :align => :right,
    :padding => 1,
    :border_width => 0  
    
  pdf.move_down 20
  pdf.text "Open 10a-10p 7 Days", :align => :center
  pdf.move_down 10
  pdf.text "www.gameroomlincoln.com", :align => :center
end