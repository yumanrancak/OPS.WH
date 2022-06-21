import './dashboard_cancel_list.html';
import { Meteor } from 'meteor/meteor';
import { template } from 'lodash';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
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
var emp = []

Tracker.autorun(() => {
  Meteor.subscribe('userList')
});


Template.dashboard_cancel_list.onCreated(async function () {

  this.filter1 = new ReactiveTable.Filter('searchorder', ['order_id']);
  this.filter2 = new ReactiveTable.Filter('searchinv', ['invoice_no']);
  this.filter3 = new ReactiveTable.Filter('searchstore', ['store_id']);
  this.filter4 = new ReactiveTable.Filter('searchmp', ['marketplace']);
  this.filter5 = new ReactiveTable.Filter('searchstatus', ['internal_status']);
  this.filter6 = new ReactiveTable.Filter('searchdate', ['create_date']);
  // this.filter3 = new ReactiveTable.Filter('searchby', ['createdBy']);
  var currentPage = new ReactiveVar(Session.get('current-page') || 0);
  this.currentPage = currentPage;
  this.autorun(function () {
    Session.set('current-page', currentPage.get());
  });

  this.isSubs = new ReactiveVar(true);
});


Template.dashboard_cancel_list.events({
  
  "change #searchorder": function (event, template) {
    var input = $(event.target).val()

    if (input) {
      template.filter1.set(input);
    } else {
      template.filter1.set("");
    }
  },
  "change #searchdate": function (event, template) {
    var input = $(event.target).val()
    var date= new Date(input+"T07:00:00")
    // date.setDate(date.getDate());
    console.log('SD',date.getDate())
    if (input) {
      if(date.getDate() == new Date().getDate()){
        template.filter6.set({'$gte': date,'$lte': new Date()})
      }
      else{
        template.filter6.set({'$gte': date,'$lte': new Date()})
      }
    } else {
      template.filter6.set("");
    }
  },
  "change #searchinv": function (event, template) {
    var input = $(event.target).val()
    if (input) {
      console.log(input)
      template.filter2.set(input);
    } else {
      template.filter2.set("");
    }
  },
  "change #searchstore": function (event, template) {
    var input = $(event.target).val()
    if (input) {
      // console.log(storename)
      template.filter3.set(input);
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

  "change #searchstatus": function (event, template) {
    var input = $(event.target).val()
    if (input) {
      template.filter5.set(input);
    } else {
      template.filter5.set("");
    }
  },
})

Template.dashboard_cancel_list.helpers({
  isSubscriptionR: function () {
    var subs = Template.instance().isSubs.get();
    console.log('subs ready:' + subs);
    return subs;
  },
  settings: function () {
    return {
      collection: 'allorderforCancel',
      rowsPerPage: 20,
      showFilter: false,
      fields: [
        { key: 'invoice_no', label: 'INVOICE NO', cellClass: 'text-bold mr-1' },
        { key: 'order_id', label: 'ORDER ID' },
        {
          key: 'store_id', label: 'STORE NAME',fn: function (datas) {
            var store = ReactiveMethod.call('datastore_id', datas);
            if(store){
              // console.log('store',store)
              return datas +' | '+ store.shopname
            }
          }
        },
        {
          key: 'marketplace', label: 'MARKETPLACE',
        },
        {
          key: 'internal_status', label: 'INT STATUS',
          headerClass: 'col-md-1 text-center', cellClass: 'text-center',
          fn: function (datas) {
            if(datas == "CANCELED"){
              return new Spacebars.SafeString("<span class='badge badge-dark text-xs col-md-8'>CANCELED</span>")
            }
            else if(datas == "COMPLETED"){
              return new Spacebars.SafeString("<span class='text-xs badge badge-dark  col-md-10' >COMPLETED</span>")
            }
            else if(datas == "DELIVERED"){
              return new Spacebars.SafeString("<span class='badge badge-secondary text-xs col-md-8' >DELIVERED</span>")
            }
            else if(datas == "SHIPPING"){
              return new Spacebars.SafeString("<span class='badge badge-info text-xs col-md-8' >SHIPPING</span>")
            }
            else if(datas == "VALIDATED"){
              return new Spacebars.SafeString("<span class='badge badge-success text-xs col-md-8' >"+ datas +"</span>")
            }
            else if(datas == "PROCESSED"){
              return new Spacebars.SafeString("<span class='badge badge-warning text-secondary text-xs col-md-9' >PROCESSED</span>")
            }
          },
        },
        {
          key: 'create_date', sortOrder: 0, sortDirection: 'descending', label: 'CREATE DATE', fn: function (date) {
            return moment.utc(date).format('D-MMM-YYYY, HH:mm')
          }
        },
        {
          key: 'validasi1status', label: 'SCAN 1',
          headerClass: 'col-md-1 text-center', cellClass: 'text-center',
          fn: function (datas) {
            if (!datas || datas === false) {
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-warning' >None</span>")
            }
            else if(datas === 'cancel'){
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-danger'>Cancel</span>")
            }
            else {
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-success'>Done</span>")
            }
          },
        },
        {
          key: 'completedStatus', label: 'PICK LIST',
          headerClass: 'col-md-1 text-center', cellClass: 'text-center',
          fn: function (datas) {
            if (!datas || datas === false) {
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-warning' >None</span>")
            }
            else if(datas === 'cancel'){
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-danger'>Cancel</span>")
            }
            else {
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-success'>Done</span>")
            }
          },
        },
        {
          key: 'validasi2status', label: 'SCAN 2',
          headerClass: 'col-md-1 text-center', cellClass: 'text-center',
          fn: function (datas) {
            if (!datas || datas === false) {
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-warning' >None</span>")
            }
            else if(datas === 'cancel'){
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-danger'>Cancel</span>")
            }
            else {
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-success'>Done</span>")
            }
          },
        },

        {
          label: 'ACTION', tmpl: Template.dashdetailcancel, sortable: false,
          headerClass: 'col-md-1 text-center', cellClass: 'text-center'
        },
      ],
      filters: ['myFilterBrand', 'searchorder','searchinv','searchstore', 'searchmp','searchstatus','searchdate'],
      currentPage: Template.instance().currentPage,
      ready: Template.instance().isSubs,

    };
  },

});
Template.dashdetailcancel.helpers({
  showbtn: function () {
    var sh = ReactiveMethod.call('showcancel', this._id);
    var ch = ReactiveMethod.call('showcompleted', this._id);
    if (sh) {
      $('#co' + this._id).prop('hidden', true);
      $('#ro' + this._id).prop('hidden', true);
      $('#sp' + this._id).prop('hidden', false);
      $('#rt' + this._id).prop('hidden', false);
    }
    else if(ch){
      // console.log(this._id)
      $('#co' + this._id).prop('hidden', true);
      $('#ro' + this._id).prop('hidden', true);
      $('#cp' + this._id).prop('hidden', false);
      // $('#rt' + this._id).prop('hidden', false);
      // console.log($('#co' + this._id))
    }
  },
})

Template.dashdetailcancel.events({
  'click .btnCancel':function(e,tpl){
    e.preventDefault();
    console.log('id',this._id)
    $('#co' + this._id).prop('hidden', true);
    $('#ro' + this._id).prop('hidden', true);
    $('#sp' + this._id).prop('hidden', false);
    $('#rt' + this._id).prop('hidden', false);
    console.log('this',$('#sp' + this._id))
      Meteor.call("orderreview.cancel", this._id,this, (error, result) => {
        console.log(result)
        if(result){
          toastr.success('Successfully to Canceled Order, finished!');
        }
      })
      
  },
  'click .btnDetail': function (e, tpl) {
    e.preventDefault();
    // console.log('id',this._id)
    var id = this._id;
    FlowRouter.go('/dashboard/review_order/' + id);
  },
  'click .btnreset': function (e, tpl) {
    e.preventDefault();
    var id = this._id;
    if (confirm('Do you want to Reset Status Fulfilment on this order ?')) {
      Meteor.call("orderreview.reset", this._id, (error, result) => {
        console.log(result)
        if(result){
        }
        toastr.success('Successfully to Reset Status Fulfilment Order Order, finished!');
      })
    }
    // console.log('id',this._id)
    // FlowRouter.go('/dashboard/review_order/' + id);
  },
})