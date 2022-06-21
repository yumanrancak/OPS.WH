import './accept_list.html';
import { Meteor } from 'meteor/meteor';
import { template } from 'lodash';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { batchList } from '../../../../api/picklist/picklist';
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
  // Meteor.subscribe('showhandover1')
});


Template.accept_list.onCreated(async function () {

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


Template.accept_list.events({
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
  'click .btnback': function (e, tpl) {
    e.preventDefault();
    var id = this._id;

    FlowRouter.go('/pick_list/pick_list');
  },
  'click .btnback': function (e, tpl) {
    e.preventDefault();
    var id = this._id;

    FlowRouter.go('/pick_list/pick_list');
  }
})

Template.accept_list.helpers({
  settings: function () {
    return {
      collection: 'batchaccepted',
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
        {
          label: 'Action', tmpl: Template.details, sortable: false,
          headerClass: 'col-md-6 d-flex justify-content-center', cellClass: 'col-md-2'
        },
        {
          key: 'status', label: 'Status',
          cellClass: function (data) {
            if (!data) {
              return 'badge badge-info mr-1'
            }
            else if (data == 'accept') {
              return 'badge badge-warning mr-1'
            }
            else if (data == 'handover') {
              return 'badge badge-danger mr-1'
            }
            else if (data == 'completed') {
              return 'badge badge-success mr-1'
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
    console.log(user);
    var oId = user && user.username;
    console.log(oId);
    return oId;
  },

});
Template.details.helpers({
  showhandover: function () {
    var sh = ReactiveMethod.call('showhandover', this._id);
    var accs = ReactiveMethod.call('hideaccept', this._id);
    var ext
    if (sh) {
      $('#sh' + this._id).prop('hidden', false);
      $('#acc' + this._id).prop('hidden', true);
    }
    if (accs) {
      $('#acc' + this._id).prop('hidden', true);
    }
  },
})
Template.details.events({
  'click .btnDetail': function (e, tpl) {
    e.preventDefault(); 
    var id = this._id;

    FlowRouter.go('/pick_list/batchdetail_list/' + id);
  },
  'click .btnAccept': function (e, tpl) {
    e.preventDefault();
    var id = this._id;
    // var sh = document.getElementById("sh"+id);
    // sh.style.display = 'block';
    $('#sh' + this._id).prop('hidden', false);

    $('#acc' + this._id).prop('hidden', true);
    Meteor.call("updateAcceptList", id, function (error, res) {
      if (res) {
        toastr.success('Accept List is Succsessfully');
        console.log('success update accept list')
      } else {
        toastr.success('Accept List is Failed');
        console.log('Fail to update accept list')
      }
    });
  },
  'click .btnHandOver': function (e, tpl) {
    e.preventDefault();
    var id = this._id;
    $('#sh' + this._id).prop('hidden', true);
    Meteor.call("updateHandover", id, function (error, res) {
      if (res) {
        toastr.success('Handover is Succsessfully');
        // console.log('success update accept list')
      } else {
        toastr.success('Handover is Failed');
        // console.log('Fail to update accept list')
      }
    });
  },
})