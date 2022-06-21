import './scan_smu_kurir.html';
import { Meteor } from 'meteor/meteor';
// import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {  shipper } from '../../../../api/orders/orders';

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


Tracker.autorun(() => {

  Meteor.subscribe('shipperFind.all');

  // Meteor.subscribe('allorderscan.100');
  // Meteor.subscribe('movementprod.15');    

});

Template.scan_smu_kurir.created = function () {
  this.filter1 = new ReactiveTable.Filter('searchtrack1', ['tracking_no']);
  this.filter3 = new ReactiveTable.Filter('searchinv2', ['invoice_no']);
  this.filter4 = new ReactiveTable.Filter('searchmp1', ['marketplace']);
  this.filter5 = new ReactiveTable.Filter('searchshipper1', ['shipper_internal']);
  // console.log('12',this.filter1)
  this.isSubs = new ReactiveVar(false);
  // this.isSubs2 = new ReactiveVar(false);
}
Template.scan_smu_kurir.events({
  'change #notracking': function (event) {
    event.preventDefault();
    console.log("change", String(event.target.value));
    var ev = String(event.target.value)
    var shp = Session.get("shipper");
    console.log("shp", shp);
    if (shp) {
      Meteor.call('all_tracking.tracking2', ev, shp,
        (err, res) => {
          if (res === false) {
            $("#notracking").prop('disabled', true); //disable 
            toastr.error("Data is not Available. Field will be disable and please check dashboard error log 2 ");
            Session.set("trackingno", false);
          }
          else if(res === true){
            console.log('re2s', res);
            toastr.info("Tracking Number " + res.tracking_no + " has been scanned");
            $("#notracking").prop('disabled', true); //disable 
            Session.set("trackingno", false);
          }
          else {
            console.log('res', res);
            document.getElementById('notracking').value = "";
            toastr.success("Order ID " + res.order_id + " is available, and succesfully Update");
          } 
        });
    }
    else {
      $("#notracking").prop('disabled', true); //disable 
      toastr.error("Please choose the shipper!, Field will be disable");
    }

  },
  'click #start': function (event) {
    event.preventDefault();

    $("#notracking").removeAttr('disabled');
    $("#notracking").prop('disabled', false);
    document.getElementById('notracking').value = "";
    $("#notracking").focus()
// 
  },
  'change #shipper': function (event, template) {
    event.preventDefault();
    document.getElementById('notracking').value = "";
    $("#notracking").prop('disabled', false); //disable 
    var kurir = $(event.currentTarget).val();
    console.log("select : " + kurir);
    Session.set("shipper", kurir);
  },

  'change #searchtrack1': function (event, template) {
    var input = $(event.target).val()
    console.log('i', input)
    if (input) {
      template.filter1.set(input);
    } else {
      template.filter1.set("");
    }
  },
  'change #searchinv2': function (event, template) {
    var input = $(event.target).val().toLowerCase();
    if (input) {
      console.log(input,'input')
      template.filter3.set(input);
    } else {
      template.filter3.set("");
    }
  },
  'change #searchmp1': function (event, template) {
    var input = $(event.target).val().toLowerCase();
    if (input) {
      template.filter4.set(input);
    } else {
      template.filter4.set("");
    }
  },
  'change #searchshipper1': function (event, template) {
    var input = $(event.target).val();
    console.log('shipper:' + input);
    if (input != 'all_shipper') {
      template.filter5.set(input);
    } else {
      template.filter5.set("");
    }
  },

})

Template.scan_smu_kurir.helpers({

  isSubscriptionR: function () {
    var subs = Template.instance().isSubs.get()
    console.log('subs ready:' + subs);
    return subs;
  },
  settingsvalid1: function () {
    return {
      collection: 'batchCompleted',
      rowsPerPage: 10,
      showFilter: false,
      fields: [
        { key: 'tracking_no', label: 'Tracking No', cellClass: 'text-bold mr-1' },
        // { key: 'order_id', label: 'Order ID' },
        { key: 'invoice_no', label: 'Invoice No' },
        { key: 'marketplace', label: 'Market Place' },
        { key: 'shipper_internal', label: 'Shipper' },
        {
          key: 'completedStatus', label: 'Status',
          cellClass: function (data) {
            if (data == true) {
              return 'badge badge-success'
            }
          },
        },
        {
          key: 'completedAt', label: 'Complete Date', sortOrder: 0, sortDirection: 'descending', fn: function (date) {
            return moment(new Date(date)).format('D-MMM-YYYY, HH:mm')
          }
        },
        { label: 'Action', tmpl: Template.manualvalid2, sortable: false, }
      ],
      filters: ['myFilterBrand', 'searchtrack1', 'searchinv2', 'searchmp1', 'searchshipper1'],
      ready: Template.instance().isSubs,
    };
  },
  settingsvalid2: function () {
    return {
      collection: 'scan2',
      rowsPerPage: 10,
      showFilter: false,
      fields: [
        { key: 'tracking_no', label: 'Tracking No', cellClass: 'text-bold mr-1' },
        // { key: 'order_id', label: 'Order ID' },
        { key: 'invoice_no', label: 'Invoice No' },
        { key: 'marketplace', label: 'Market Place' },
        { key: 'shipper_internal', label: 'Shipper' },
        {
          key: 'validasi1status', label: 'Status',
          cellClass: function (data) {
            if (data == true) {
              return 'badge badge-success'
            }
          },
        },
        {
          key: 'validasi1At', label: 'Validation Date', sortOrder: 0, sortDirection: 'descending', fn: function (date) {
            return moment(new Date(date)).format('D-MMM-YYYY, HH:mm')
          }
        },
      ],
      filters: ['myFilterBrand', 'searchtrack1', 'searchinv2', 'searchmp1', 'searchshipper1'],
      ready: Template.instance().isSubs,
    };
  },
  showDataKurir: function () {
    var kurir = shipper.find();
    return kurir;
  },

});

Template.manualvalid2.onRendered(function () {
  // $('.select-2').select2();
})

Template.manualvalid2.helpers({
})
Template.manualvalid2.events({
  'click .btnManual': function (e, tpl) {
    var sId = this._id;
    // console.log('id',this._id)
    if (confirm('Do you want to Send Manual Validation 2 on this data?')) {
      Meteor.call('all.updatemanual2', sId,
        (err, res) => {
          if (err) {
            console.log('res',res)
            toastr.warning('Scan Manual Validation 2 Failed ')
          } else {
            toastr.success('Scan Manual Validation 2 Succsessfully');
          }
        });
    }
  },
  'click .btngetdata':function(e,tpl){
    
    toastr.success('Refresh data is Succsessfully');
      Meteor.call('getUpdateOrder', this.order_id,this.marketplace,
        (err, res) => {
          console.log('res',res)
          if (res === false) {
            toastr.info('Error Network,please try again!')
          } else {
          }
        });
    
  }
})
