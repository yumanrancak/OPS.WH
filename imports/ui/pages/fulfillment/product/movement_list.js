import './movement_list.html';
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
  Meteor.subscribe('userList');
  Meteor.subscribe('movementProduct');
});


Template.movement_list.onCreated(async function () {
  this.filter1 = new ReactiveTable.Filter('searchinv', ['invoice_no']);
  this.filter2 = new ReactiveTable.Filter('searchsku', ['item_sku']);
  this.filter3 = new ReactiveTable.Filter('searchmp', ['marketplaceId']);
  this.filter4 = new ReactiveTable.Filter('searchstype', ['movementType']);
  this.filter5 = new ReactiveTable.Filter('searchbrand', ['brand_id']);
  var currentPage = new ReactiveVar(Session.get('current-page') || 0);
  this.currentPage = currentPage;
  this.autorun(function () {
    Session.set('current-page', currentPage.get());
  });

  this.isSubs = new ReactiveVar(true);
});


Template.movement_list.events({
  "change #searchinv": function (event, template) {
    var input = $(event.target).val()
    if (input) {
      console.log(input)
      template.filter1.set(input);
    } else {
      template.filter1.set("");
    }
  },
  "change #searchsku": function (event, template) {
    var input = $(event.target).val()
    if (input) {
      // console.log(storename)
      template.filter2.set(input);
    } else {
      template.filter2.set("");
    }
  },
  "change #searchmp": function (event, template) {
    var input = $(event.target).val().toLowerCase();
    if (input) {
      template.filter3.set(input);
    } else {
      template.filter3.set("");
    }
  },
  "change #searchtype": function (event, template) {
    var input = $(event.target).val().toLowerCase();
    if (input) {
      template.filter4.set(input);
    } else {
      template.filter4.set("");
    }
  },
  "change #searchbrand": function (event, template) {
    var input = $(event.target).val()
    var ins = input.substring(10,36)
    var bd = new Mongo.ObjectID(ins.slice(0,-2))
    console.log('in',bd)
    if (input) {
      template.filter5.set({$eq:bd});
    } else {
      template.filter5.set("");
    }
  },
})

Template.movement_list.helpers({
  isSubscriptionR: function () {
    var subs = Template.instance().isSubs.get();
    console.log('subs ready:' + subs);
    return subs;
  },
  allbrand:function(){
    return ReactiveMethod.call('getbrand');
    // console.log('data',data)
    
  },
  selectBrand: function(optionText){
    if(optionText._str === Session.get('brandedit')._str){
      return 'selected'
    }
  },
  productMovement: function () {
    return {
      collection: 'movementProduct',
      rowsPerPage: 20,
      showFilter: false,
      fields: [
        { key: 'invoice_no', label: 'INVOICE NO', cellClass: 'text-xs' },
        { key: 'brand_id', label: 'BRAND NAME', 
          fn: function (data) {
          var datas = ReactiveMethod.call('brands.list.all', data);
        
          return datas.brand_name
          },
        },
        { key: 'marketplaceId', label: 'MARKETPLACE' },
        { key: 'product_sku', label: 'SKU'},
        { key: 'qty', label: 'QTY' },
        { key: 'movementType', label: 'Type' },
        {
          key: 'createdAt', sortOrder: 0, sortDirection: 'descending', label: 'CREATE DATE', fn: function (date) {
            return moment(new Date(date)).format('D-MMM-YYYY, HH:mm')
          }
        },

      ],
      filters: ['searchinv', 'searchsku', 'searchmp', 'searchtype', 'searchbrand'],
      currentPage: Template.instance().currentPage,
      ready: Template.instance().isSubs,

    };
  },
});