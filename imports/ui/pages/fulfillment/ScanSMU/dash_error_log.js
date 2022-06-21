import './dash_error_log.html';
import { Meteor } from 'meteor/meteor';
import { OrderErrorLogs } from '../../../../api/orders/orders';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Tracker.autorun(() => {

  Meteor.subscribe('userList');
});

Template.dash_error_log.onCreated(function () {


this.filter2 = new ReactiveTable.Filter('searchtrack', ['trackingNo']);
this.filter3 = new ReactiveTable.Filter('searchorder', ['orderid']);
this.filter4 = new ReactiveTable.Filter('searchmp', ['marketplace']);
this.filter5 = new ReactiveTable.Filter('searchby', ['usedBy']);
// Template.instance().filter1.set({'$gt': d});

this.isSubs = new ReactiveVar(false);

Session.set('formSwitch', false);
Session.set('isDownloading', false);

});

Template.dash_error_log.events({
  "change #searchtrack": function (event, template) {
    var input = $(event.target).val()
    console.log('i', input)
    if (input) {
      template.filter2.set(input);
    } else {
      template.filter2.set("");
    }
  },
  "change #searchinvoice": function (event, template) {
    var input = $(event.target).val()
    if (input) {
      template.filter3.set(input);
    } else {
      template.filter3.set("");
    }
  },
  "change #searchbrand": function (event, template) {
    var input = $(event.target).val()
    if (input) {
      template.filter6.set(input);
    } else {
      template.filter6.set("");
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
  "change #searchby": function (event, template) {
    var input = $(event.target).val();
    console.log('searchby:' + input);
    if (input != 'all_user') {
      template.filter5.set(input);
    } else {
      template.filter5.set("");
    }
  },
})

Template.dash_error_log.helpers({

    isSubscriptionR: function () {
        var subs = Template.instance().isSubs.get();
        console.log('subs ready:' + subs);
        return subs;
    },
    // StoreErrorLog() {
    //     return OrderErrorLogs.find({'typescan':1},{ sort: { 'createdAt': -1 }, limit: 50});
    // },

    settingslog: function () {
      return {
        collection: 'logserror',
        rowsPerPage: 50,
        showFilter: false,
        fields: [
          { key: 'trackingNo', label: 'Tracking No', cellClass: 'text-bold mr-1' },
          // { key: 'order_id', label: 'Order ID' },
          { key: 'invoice_no', label: 'Invoice No' },
          { key: 'marketplace', label: 'MP' },
          { key: 'brand', label: 'Brand' },
          { key: 'errorLog', label: 'Error Log' },
          { key: 'item_sku', label: 'Product SKU',
            fn: function (datas,template) {
              if (datas) {
                return datas
              }
            },
          },
          {
            key: 'createdAt', label: 'Created Date', sortOrder: 1, sortDirection: 'descending', fn: function (date) {
              // return moment(new Date(date)).format('D-M-YYYY, HH:mm')
              return moment(date).format('D-MMM-YYYY, HH:mm')
            }
          },
          {
            key: 'usedBy', label: 'Scanned By', fn: function (value) {
              if (value) {
                var user = Meteor.users.findOne({ '_id': value }, { fields: { 'services': 0 } })
                // console.log('user',user)
                return user.username
              }
            }
          },
          {
            key: 'checkboxstatus', label: 'Action', tmpl: Template.directsa, sortable: false,
          },
        ],
        filters: ['myFilterBrand', 'searchtrack', 'searchinvoice', 'searchmp', 'searchby','searchbrand'],
        ready: Template.instance().isSubs,
      };
      },

  createList() {
    var data =  ReactiveMethod.call('createdby.log1');
    // console.log('data',data)
    return data
  },
  userNameDrop: function (uid) {
    // console.log(uid);
    var user = Meteor.users.findOne(uid);
    // console.log('test',user);
    var oId = user && user.username;
    // console.log(oId);
    return oId;
  },
  
  brandLog: function () {
    // console.log(uid);
      var brand = ReactiveMethod.call('brand.log1');
      // console.log('test',user);
      // console.log(oId);
      return brand;
    }
});

Template.directsa.helpers({
  showbtn: function () {
    var sh = ReactiveMethod.call('showlog.error', this._id);
    console.log('log',this)
    if(sh){
      if(this.errorLog == "SKU MP Null"){
        // console.log('log',this.errorLog)
        $('#direct' + this._id).prop('hidden', false);
          // console.log('true',$('#direct' + this.trackingNo))
        }
        else{
          // console.log('false',$('#direct' + this.trackingNo))
        }  
    }
  },
})
Template.directsa.events({
  'click .btndirect': function (e, tpl) {
    e.preventDefault();
    // console.log(this.trackingNo)
    if (confirm('Do you want to manual direct this error row??')) {
      Meteor.call("order.invoice",this.invoice_no,function (error,res) {
        if (res) {
          // toastr.success('Delete is Succsessfully');
          console.log('res',res)
          FlowRouter.go('/dashboard/review_order/' + res._id._str);
          // console.log('success update accept list')
        } else {
          // toastr.success('Delete is Failed');
          // console.log('Fail to update accept list')
        }
     });
    
    }
  },
})
