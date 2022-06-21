import './scanvalidasi1.html';
import { Meteor } from 'meteor/meteor';
// import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { allOrder, BlibliOrders, BukalapakOrders, JdidOrders, LazadaOrders, shipper, ShopeeOrders, TokopediaOrders, TokpedOrderDetail, ZaloraOrders } from '../../../../api/orders/orders';

toastr.options = {
  "closeButton": true,
  "debug": true,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-full-width",
  "preventDuplicates": false,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}
var load = true
Tracker.autorun(() => {
  Meteor.subscribe('shipperFind.all');

  // Meteor.call("validation.all",(err,res)=>{
  //   // console.log('res',res)
  //   Session.set('query',res)
  // })
  // Meteor.call("NewOrder.all",(err,res)=>{
  //     // console.log('res',res)
  //     Session.set('queryallOrder',res)
  // })
  // Meteor.subscribe('validMP');
  // Meteor.call("validation.all")

});


Template.scanvalidasi1.onCreated(function () {

  var d = new Date();
  d.setDate(d.getDate() - 3);

  this.filter2 = new ReactiveTable.Filter('searchtrack', ['tracking_no']);
  this.filter3 = new ReactiveTable.Filter('searchinvs', ['invoice_no']);
  this.filter4 = new ReactiveTable.Filter('searchmp', ['marketplace']);
  this.filter5 = new ReactiveTable.Filter('searchshipper', ['shipper_internal']);
  // Template.instance().filter1.set({'$gt': d});

  this.isSubs = new ReactiveVar(false);

  Session.set('formSwitch', false);
  Session.set('isDownloading', false);

});
Template.scanvalidasi1.events({

  'change #notracking': function (event) {
    event.preventDefault();
    Session.set('load',false)
    console.log("change", String(event.target.value));
    var ev = String(event.target.value)
    if (ev) {
      Meteor.call('All.tracking', ev, (err, res) => {
          console.log('tes', res)
          if (res == 'already') 
          {
            toastr.info("Tracking Number / Invoice Number " + ev + " has been scanned","INFO");
            $("#notracking").prop('disabled', true); //disable 
            Session.set('load',true)
            Session.set("trackingno", false);  
          }
          else if (res == false) 
          {
            toastr.error("Tracking Number / Invoice Number " + ev + " theres'no in sales marketplace","ERROR");
            $("#notracking").prop('disabled', true); //disable 
            Session.set('load',true)
            Session.set("trackingno", false);  
          }
          else {
            setTimeout(function () {
              Meteor.call('re.tracking1', res._id,(err, res2) => {
                console.log('tes', res2)
                  if (res2 == false) {
                    $("#notracking").prop('disabled', true); //disable 
                    var x = document.getElementById("notracking").autofocus;
                    x = true
                    toastr.error("Product is not found!, Field will be disable","Please Check Error Log");
                    Session.set("trackingno", false);
                    Session.set('load',true)
                  } 
                  else{
                    toastr.success("Tracking Number / Invoice Number  is available, and succesfully update","UPDATED");
                    document.getElementById('notracking').value = "";
                    Session.set('load',true)
                  }
              })
            }, 10)
          }
 
        });

    }
    
  },

  'change #invoicenotrack': function (event) {
    event.preventDefault();
    console.log("change inv", String(event.target.value));
    Session.set('load',false)
    var ev = String(event.target.value)
    if (ev) {
      Meteor.call('All.trackinvoice', ev,
      async (err, res) => {
          console.log('tes', res)
          if (res == 'already') 
          {
            toastr.info("Invoice No " + ev + " has been scanned");
            $("#invoicenotrack").prop('disabled', true); //disable 
            Session.set("trackingno", false);  
            Session.set('load',true)
          }
          else if (res == false) 
          {
            toastr.error("Invoice No " + ev + " theres'no in sales marketplace");
            $("#invoicenotrack").prop('disabled', true); //disable 
            Session.set("trackingno", false);  
            Session.set('load',true)
          }
          else {
              Meteor.call('re.tracking1', res._id,async (err, res2) => {
                // console.log('tes', res)
                  if (res2 === false) {
                    $("#invoicenotrack").prop('disabled', true); //disable 
                      var x = document.getElementById("invoicenotrack").autofocus;
                      x = true
                      toastr.error("Product is not found!, Field will be disable","Please Check Error Log");
                    Session.set("trackingno", false);
                    Session.set('load',true)
                  } 
                  else{
                    toastr.success("Invoice No is available, and succesfully Update");
                    document.getElementById('invoicenotrack').value = "";
                    Session.set('load',true)
                  }
              })
          }
        });
    }
    
  },
  'click #start': function (event) {
    event.preventDefault();
    var data = $("#notracking").val()
    var inv = $("#invoicenotrack").val()
    console.log('data',data)
    if( data != ""){
      $("#notracking").removeAttr('disabled');
      document.getElementById('notracking').value = "";
      $("#notracking").focus()
    }
    else if(inv != "") {
      $("#invoicenotrack").removeAttr('disabled');
      document.getElementById('invoicenotrack').value = "";
      $("#invoicenotrack").focus()
    }
  },
  "change #searchtrack": function (event, template) {
    var input = $(event.target).val()
    console.log('i', input)
    if (input) {
      template.filter2.set(input);
    } else {
      template.filter2.set("");
    }
  },
  "change #searchinvs": function (event, template) {
    var input = $(event.target).val().toLowerCase();
    if (input) {
      template.filter3?.set(input);
    } else {
      template.filter3.set("");
    }
  },
  "change #searchmp": function (event, template) {
    var input = $(event.target).val().toLowerCase();
    if (input) {
      template.filter4.set(input);
    } else {
      template.filter4.set("");
    }
  },
  "change #searchshipper": function (event, template) {
    var input = $(event.target).val();
    console.log('shipper:' + input);
    if (input != 'all_shipper') {
      template.filter5.set(input);
    } else {
      template.filter5.set("");
    }
  },
})

Template.scanvalidasi1.helpers({


  showDataKurir: function () {
    var kurir = shipper.find();
    console.log('kurir', kurir)
    return kurir;
  },
  isSubscriptionR: function () {
    var subs = Template.instance().isSubs.get();
    console.log('subs ready:' + subs);
    return subs;
  },
  isSubscriptionR2: function () {
    var subs = Session.get('load')
    console.log('subs ready:' + subs);
    return subs;
  },
  settingsvalid1: function () {
    var order = this;
    return {
      collection: 'scan1',
      rowsPerPage: 10,
      showFilter: false,
      fields: [
        { key: 'tracking_no', label: 'Tracking No', cellClass: 'text-bold mr-1' },
        // { key: 'order_id', label: 'Order ID' },
        { key: 'invoice_no', label: 'Inv No' },
        { key: 'marketplace', label: 'MP' },
        { key: 'shipper_internal', label: '3PL' },        {
          key: 'validasi1At', label: 'Valid Date', sortOrder: 0, sortDirection: 'descending', fn: function (date) {
            // return moment(new Date(date)).format('D-M-YYYY, HH:mm')
            return moment(date).format('D-MMM-YYYY, HH:mm')
          }
        },
        // { label: 'Action', tmpl: Template.action_approve, sortable: false,}
      ],
      filters: ['myFilterBrand', 'searchtrack', 'searchinvs', 'searchmp', 'searchshipper'],
      ready: Template.instance().isSubs,
    };
  },

  collnewOrder: function () {
    myCollection2 = Session.get("queryallOrder")
    console.log('col2', myCollection2)
    return myCollection2;
  },
  settingsorder: function () {
    // Session.get('isLoading');
    var order = this;
    console.log('order', order)
    return {
      collection: 'allOrder',
      rowsPerPage: 10,
      showFilter: false,
      fields: [
        { key: 'tracking_no', label: 'Tracking No', cellClass: 'text-bold mr-1' },
        // { key: 'order_id', label: 'Order ID' },
        { key: 'invoice_no', label: 'Inv No' },
        { key: 'marketplace', label: 'MP' },
        { key: 'shipper_internal', label: '3PL' },
        { key: 'comment', label: 'Status' ,
        headerClass: 'col-md-1 text-center',
          fn: function (data) {
            if (!data) {
              return new Spacebars.SafeString("<span class='col-md-12 badge badge-info'>open</span>")
            }
            else {
              return new Spacebars.SafeString("<span class='col-md-12 badge badge-warning'>"+ data +"</span>")
            }
          },
        },
        {
          key: 'validasi1status', label: 'V1', hidden: true,
          cellClass: function (data) {
            if (data == "none") {
              return 'badge badge-danger '
            }
          },
        },
        {
          key: 'create_date', label: 'Date', sortOrder: 0, sortDirection: 'descending', fn: function (date) {
            // return moment(new Date(date)).format('D-M-YYYY, HH:mm')
            return moment.utc(date).format('D-MMM-YYYY, HH:mm')
          }
        },
        { label: 'Action', tmpl: Template.manualaction, sortable: false, }
      ],
      filters: ['order', 'searchtrack', 'searchinvs', 'searchmp', 'searchshipper'],
      ready: Template.instance().isSubs,
    };
  },
});

Template.manualaction.onRendered(function () {
  // $('.select-2').select2();
})

Template.manualaction.helpers({
})
Template.manualaction.events({
  'click a.btnManual': function (e, tpl) {
    var sId = this._id;
    // console.log('id',this._id)
    if (confirm('Do you want to Send Manual Validation on this data?')) {
      console.log(sId)
        Meteor.call('all.updatemanual', this._id,async (err, res) => {
            if (res == false) 
              {
                toastr.error("Data is not available or Product was not found!");
              }
            else{
              Meteor.call('re.tracking1', this._id,async (err, res2) => {
                console.log('tes', res2)
                  if (res2 == false) {
                    toastr.error("Product is not found!, Field will be disable","Please Check Error Log");
                  } 
                  else{
                    toastr.success("this order with invoice number "+ res2.invoice_no +"is available, and succesfully Update");
                  }
              })
          }
        }
      );
    }
  },
})