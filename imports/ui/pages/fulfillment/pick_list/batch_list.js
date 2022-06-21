import './batch_list.html';
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


Template.batch_list.onCreated(async function () {

  this.filter1 = new ReactiveTable.Filter('searchid', ['_id']);
  this.filter2 = new ReactiveTable.Filter('searchstatus', ['status']);
  this.filter3 = new ReactiveTable.Filter('searchby', ['createdBy']);

  var currentPage = new ReactiveVar(Session.get('current-page') || 0);
  this.currentPage = currentPage;
  this.autorun(function () {
    Session.set('current-page', currentPage.get());
  });

  this.isSubs = new ReactiveVar(false);
});


Template.batch_list.events({
  'click .btnCreate': function (e, tpl) {
    e.preventDefault();
    if (confirm('Do you want to Create Batch List ??')) {

      Meteor.call("PickList.update", emp, (err, res) => {
        console.log('created')
      })
      toastr.success('Created Batch List is Succsessfully');
    }
  },
  "change #searchid": function (event, template) {
    var input = $(event.target).val()
    if (input) {
      // console.log(input)
      template.filter1.set(input);
    } else {
      template.filter1.set("");
    }
  },
  "change #searchstatus": function (event, template) {
    var input = $(event.target).val();
    console.log('status:' + input);
    if (input === "all_status") {
      template.filter2.set("");
    }
    else if (input === "accept") {
      template.filter2.set(input);
    }
    else if (input === "handover") {
      template.filter2.set(input);
    }
    else if (input === "completed") {
      template.filter2.set(input);
    }
    else {
      template.filter2.set({ $exists: false });
    }
  },
  "change #searchby": function (event, template) {
    var input = $(event.target).val();
    console.log('user:' + input);
    if (input != 'all_user') {
      template.filter3.set(input);
    } else {
      template.filter3.set("");
    }
  },
  'click .btnback': function (e, tpl) {
    e.preventDefault();
    var id = this._id;

    FlowRouter.go('/pick_list/pick_list');
  }
})

Template.batch_list.helpers({
  settings: function () {
    return {
      collection: 'batchlist1',
      rowsPerPage: 20,
      showFilter: false,
      fields: [
        { key: '_id', label: 'ID Batch List', cellClass: 'text-bold mr-1' },
        {
          key: 'createdBy', label: 'Created By', fn: function (value) {
            var user = Meteor.users.findOne({ '_id': value }, { fields: { 'services': 0 } })
            return user.username
          }
        },
        {
          key: 'datelist', label: 'Created Date', sortOrder: 0, sortDirection: 'descending', fn: function (date) {
            return moment(new Date(date)).format('D-MMM-YYYY, HH:mm')
          }
        },
        { label: 'Action', tmpl: Template.detail, sortable: false },
        {
          key: 'status', label: 'Status',
          cellClass: function (data) {
            if (!data) {
              return 'badge badge-info'
            }
            else if (data == 'accept') {
              return 'badge badge-warning'
            }
            else if (data == 'handover') {
              return 'badge badge-danger'
            }
            else if (data == 'complete') {
              return 'badge badge-success'
            }
          },
          fn: function (value) {
            if (value === '' || value === null) {
              return 'Opened'
            }
            else if (value === 'accept') {
              return 'Accepted'
            }
            else if (value == 'handover') {
              return 'Handover'
            }
            else if (value == 'completed') {
              return 'Completed'
            }
          }
        },
      ],
      filters: ['myFilterBrand', 'searchby', 'searchid', 'searchstatus'],
      currentPage: Template.instance().currentPage,
      ready: Template.instance().isSubs,

    };
  },
  isSubscriptionR: function () {
    var subs = Template.instance().isSubs.get();
    console.log('subs ready:' + subs);
    return subs;
  },
  createList() {
    return ReactiveMethod.call('createdby.all.drop');
  },
  userNameDrop: function (uid) {
    // console.log(uid);
    var user = Meteor.users.findOne(uid);
    // console.log(user);
    var oId = user && user.username;
    // conssole.log(oId);
    return oId;
  },

});

Template.detail.events({
  'click .btnDetail': function (e, tpl) {
    e.preventDefault();
    var id = this._id;

    FlowRouter.go('/pick_list/batchdetail_list/' + id);
  },
})