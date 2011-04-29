//= require "../view_controller"

var InventoryItemController = new JS.Class(ViewController, {
  include: JS.Observable,
  
  initialize: function(view) {
    this.callSuper();
    this.item = null;
    
    $('a.close', this.view).bind('click', {instance: this}, this.onClose);
    $('a.save', this.view).bind('click', {instance: this}, this.onSave);
  },
  
  reset: function() {
    $(':input', this.view)
      .not(':button, :submit, :reset')
      .val(null)
      .removeAttr('checked')
      .removeAttr('selected');
    $('input#taxable', this.view).attr('checked', true);
    $('input#discountable', this.view).attr('checked', true);
    $('input#active', this.view).attr('checked', true);
  },
  
  setItem: function(item) {
    this.item = item;
    
    if(item != null) {
      $('input#title', this.view).val(item.title);
      $('textarea#description', this.view).val(item.description);
      $('textarea#tags', this.view).val(item.tags);
      $('input#sku', this.view).val(item.sku);
      $('input#price', this.view).val(Currency.format(item.price));
      $('input#credit', this.view).val(Currency.format(item.credit));
      $('input#cash', this.view).val(Currency.format(item.cash));
      $('input#taxable', this.view).attr('checked', item.taxable);
      $('input#discountable', this.view).attr('checked', item.discountable);
      $('input#active', this.view).attr('checked', item.active);
    } else {
      this.reset();
    }
  },
  
  onClose: function(event) {
    event.data.instance.view.hide();
    event.preventDefault();
  },
  
  onSave: function(event) {
    title = $('input#title', this.view).val();
    description = $('textarea#description', this.view).val();
    tags = $('textarea#tags', this.view).val();
    sku = $('input#sku', this.view).val();
    price = parseInt(Currency.toPennies($('input#price', this.view).val()));
    credit = parseInt(Currency.toPennies($('input#credit', this.view).val()));
    cash = parseInt(Currency.toPennies($('input#cash', this.view).val()));
    taxable = $('input#taxable', this.view).attr('checked');
    discountable = $('input#discountable', this.view).attr('checked');
    active = $('input#active', this.view).attr('checked');
    
    if(event.data.instance.item == null) {
      item = Item.create({
        title: title,
        description: description,
        tags: tags,
        sku: sku,
        price: price,
        credit: credit,
        cash: cash,
        taxable: taxable,
        discountable: discountable,
        active: active
      });
    } else {
      item = Item.find(event.data.instance.item.id);
      item.title = title;
      item.description = description;
      item.tags = tags;
      item.sku = sku;
      item.price = price;
      item.credit = credit;
      item.cash = cash;
      item.taxable = taxable;
      item.discountable = discountable;
      item.active = active;
      item.save();
    }
    
    event.data.instance.setItem(item);
    event.data.instance.notifyObservers(event.data.instance.item.sku, 1);
    event.data.instance.view.hide();
    event.preventDefault();
  }
});