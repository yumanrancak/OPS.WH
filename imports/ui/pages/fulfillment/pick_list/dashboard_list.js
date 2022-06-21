import './dashboard_list.html';
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


Template.dashboard_list.onCreated(async function () {

  this.filter1 = new ReactiveTable.Filter('searchid', ['_id']);
  this.filter2 = new ReactiveTable.Filter('searchstatus', ['status']);
  this.filter3 = new ReactiveTable.Filter('searchby', ['createdBy']);
  var currentPage = new ReactiveVar(Session.get('current-page') || 0);
  this.currentPage = currentPage;
  this.autorun(function () {
    Session.set('current-page', currentPage.get());
  });

  this.isSubs = new ReactiveVar(true);
});


Template.dashboard_list.events({

  "change #searchid": function (event, template) {
    var input = $(event.target).val()
    if (input) {
      console.log(input)
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
})

Template.dashboard_list.helpers({
  settings: function () {
    return {
      collection: 'batchdashboard',
      rowsPerPage: 20,
      showFilter: false,
      fields: [
        { key: '_id', label: 'ID Batch List', cellClass: 'text-bold mr-1' },
        {
          key: 'createdBy', label: 'Created By',
          // headerClass: 'col-md-1 text-center',cellClass:'text-center',
          fn: function (value) {
            var user = Meteor.users.findOne({ '_id': value }, { fields: { 'services': 0 } })
            return user.username
          }
        },
        {
          key: 'datelist', label: 'Created Date', headerClass: 'col-md-2',
          sortOrder: 0, sortDirection: 'descending', fn: function (date) {
            return moment(new Date(date)).format('D-MMM-YYYY, HH:mm')
          }
        },
        {
          key: 'acceptStatus', label: 'Accepted',
          headerClass: 'col-md-1 text-center', cellClass: 'text-center',
          fn: function (datas) {
            if (!datas) {
              return new Spacebars.SafeString("<span class='col-md-8 badge  badge-warning' >None</span>")
            }
            else {
              return new Spacebars.SafeString("<span class='col-md-8 badge  badge-success'>Done</span>")
            }
          },
        },
        {
          key: 'handover', label: 'Handover',
          headerClass: 'col-md-1 text-center', cellClass: 'text-center',
          fn: function (datas) {
            if (!datas) {
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-warning' >None</span>")
            }
            else {
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-success'>Done</span>")
            }
          },
        },
        {
          key: 'completedStatus', label: 'Completed',
          headerClass: 'col-md-1 text-center', cellClass: 'text-center',
          fn: function (datas) {
            if (!datas) {
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-warning' >None</span>")
            }
            else {
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-success'>Done</span>")
            }
          },
        },

        {
          label: 'Action', tmpl: Template.dashdetail, sortable: false,
          headerClass: 'col-md-2 text-center', cellClass: 'text-center'
        },
      ],
      filters: ['myFilterBrand', 'searchby', 'searchid'],
      currentPage: Template.instance().currentPage,
      ready: Template.instance().isSubs,

    };
  },
  isSubscriptionR: function () {
    var subs = Template.instance().isSubs.get();
    console.log('subs ready:' + subs);
    return subs;
  },
});

Template.dashdetail.events({
  'click .btnDetail': function (e, tpl) {
    e.preventDefault();
    var id = this._id;

    FlowRouter.go('/pick_list/batchdetail_list/' + id);
  },
  'click .btnOrder': function (e, tpl) {
    e.preventDefault();
    var id = this._id;
    // Meteor.call()
    FlowRouter.go('/pick_list/batchdetailorder/' + id);
  },
})