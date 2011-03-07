var StoreCreditController = new JS.Class(PaymentLineController, {
  
  initialize: function(view) {
    $('a.apply', view).hide().bind('click', {instance: this}, this.onApply);
    this.setTransaction(new Transaction());
    this.callSuper();
  },
  
  enable: function() {
    if(this.transaction.customer.id != null) {
      this.callSuper();
    }
  },
  
  onApply: function(event) {
    if(event.data.instance.transaction.customer.credit > event.data.instance.transaction.total()) {
      amount = event.data.instance.transaction.total();
    } else {
      amount = event.data.instance.transaction.customer.credit;
    }
    $('div#payment_store_credit input#store_credit_amount').val(Currency.format(amount));
    event.data.instance.payment.amount = amount;
    event.data.instance.notifyObservers(event.data.instance.payment);
    event.preventDefault();
  },
  
  onChange: function(event) {
    if(!isNaN($(this).val())) {
      amount = Currency.toPennies($(this).val());
      credit = event.data.instance.transaction.customer.credit;
      total = event.data.instance.transaction.total();
      
      if(amount > credit) {
        event.data.instance.payment.amount = credit;
      } else {
        event.data.instance.payment.amount = amount;
      }
      if(event.data.instance.payment.amount > total) {
        event.data.instance.payment.amount = total;
      }
      if(event.data.instance.payment.amount != 0) {
        $(this).val(Currency.format(event.data.instance.payment.amount));
      } else {
        $(this).val(null);
      }
      event.data.instance.notifyObservers(event.data.instance.payment);
    } else {
      $(this).val(null);
    }
  },
  
  setTransaction: function(transaction) {
    this.transaction = transaction;
    if(transaction.customer.id != null) {
      $('div#payment_store_credit span#payment_customer').html(transaction.customer.person.first_name + ' ' + transaction.customer.person.last_name + ': ' + Currency.pretty(transaction.customer.credit));
      $('div#payment_store_credit a.apply').show();
      this.enable();
    }
  }
  
});