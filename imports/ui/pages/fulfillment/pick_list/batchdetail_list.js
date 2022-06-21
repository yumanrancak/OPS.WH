import './batchdetail_list.html';
import { Meteor } from 'meteor/meteor';
import { isObject, template } from 'lodash';
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
Tracker.autorun(() => {

});


Template.batchdetail_list.onCreated(async function () {
  this.isSubs = new ReactiveVar(false);
});


Template.batchdetail_list.events({
  'click .btnback': function (e, tpl) {
    e.preventDefault();
    var id = this._id;
    history.back();
    // FlowRouter.go('/pick_list/batch_list/');
  },
  'click .btnPrint': function (e, tpl) {
    e.preventDefault();
    // var printContents = document.getElementById(print1).innerHTML;
    // console.log('',document.getElementsByName(print1))
    // document.body.innerHTML = printContents;

    // window.print();



    // document.body.innerHTML = originalContents;
  },

})

Template.batchdetail_list.helpers({
  id: function () {

    var id = FlowRouter.getParam('id')
    return id
  }
  ,
  tabledetail: function () {
    var params = FlowRouter.getParam('id')
    var data = ReactiveMethod.call('finddetail.list', params);
    if (data) {
      Template.instance().isSubs.set(true);
    }
    return data
  },

  getbrand: function (brand) {

      var data = ReactiveMethod.call('brands.list.all', new Mongo.ObjectID(brand));
      if (data) {
        Template.instance().isSubs.set(true);
      }
      return data
  },
  isSubscriptionR: function () {
    var subs = Template.instance().isSubs.get();
    console.log('subs ready:' + subs);
    return subs;
  },
  total() {
    var params = FlowRouter.getParam('id')
    const datas = ReactiveMethod.call('finddetail.total', params);
    var Total = 0;
    var data = datas
    // console.log(datas)
    for (let dat of data) {
      Total += dat.qty;
    }
    // var tes = []
    // tes.push({total:Total});
    console.log('total', Total)
    return Total
  }

});

// Template.detail.events({
//   'click .btnDetail': function (e, tpl) {
//       e.preventDefault();
//       var id = this._id;

//       FlowRouter.go('/batch_list/'+ id);
//   }
// })

