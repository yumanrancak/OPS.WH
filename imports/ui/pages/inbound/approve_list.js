import './approve_list.html';
import { Meteor } from 'meteor/meteor';
import { loginbound } from '../../../api/inbound/inbound';
import { Warehouse } from '../../../api/warehouse/warehouse';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

toastr.options = {
    "closeButton": true,
    "debug": true,
    "newestOnTop": false,
    "progressBar": true,
    "fontSize": "20",
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
Template.approve_list.onCreated(function () {
  // this.pId = () => FlowRouter.getParam('id');
  // this.autorun(() => {
    //     this.subscribe('brand.single', this.pId());
    // });
  });
Tracker.autorun(() => {
    
Meteor.subscribe('warehouse.active');
Meteor.subscribe('allLoguploadInbound.all');
});
// Template.approve_list.onCreated(function () {
//   this.isSubs = new ReactiveVar(false);
//   Session.set('formSwitch', false);
//   Session.set('isDownloading', false);
// });

Template.approve_list.events({
  'click .btnSaveEdit': function (e, tpl) {
    // e.preventDefault();
    var id = this._id;
    var approve = $('#approve' + id).val();
    var warehouse = $('#warehouse' + id).val();
    var approvedate = new Date();
    var approveby = Meteor.userId();
    // console.log('approve',approve)
    // if (confirm('Do you want to save survey?')) {
    Meteor.call('inbound.update',
        id,approve,approvedate,approveby,warehouse,
        (err, res) => {
            if (err) {
                toastr.warning('Approve Failed')
            } else {
                $('#entryData').addClass('d-none');
                toastr.success('Approve Sucess');
            } 
        });
},
});    
Template.approve_list.helpers({
  // settings: function () {
  //   // Session.get('isLoading');
  //   return {
  //     collection: 'loginbound',
  //     rowsPerPage: 10,
  //     showFilter: false,  
  //     fields: [
  //       { key: 'deliveryorder', label: 'Delivery Order',cellClass: 'text-success mr-1' },
  //       { key: 'dateprocessed', label: 'Delivey Date',fn: function (date) {
  //         return moment(new Date(date)).format('MMMM Do YYYY, h:mm:ss a')
  //       } },
  //       { key: 'shipper', label: 'Shipepr' },
  //       { key: 'brand', label: 'Brand' },
  //       { key: 'detailupload', label: 'detailupload', hidden: true  },
  //       { key: 'file', label: 'File Name' },
  //       { key: 'approve', label: 'Status',
  //         cellClass:function (data) {
  //           if(data == 'none'){
  //             return 'badge badge-danger'
  //           }
  //           // if(data == 'true'){
  //           //   return ''
  //           // }if(data == 'false'){
  //           //   return 'badge badge-danger'
  //           // }else {
  //           //   return 'badge'
  //           // }
          
  //         },
  //       },
  //       { label: 'Action', tmpl: Template.action_approve, sortable: false,}
  //     ],
  //     filters: ['myFilterBrand'],
  //     ready: Template.instance().isSubs,
  //   };
  // },
  showDataLog:function(){
    var params = FlowRouter.getParam('id')
    console.log('params',params)
    if(params){
      return ReactiveMethod.call('showbyid.approve',params);
    }
    else {
      var inbound = loginbound.find({},{sort: { 'createdAt': -1 }, limit: 15}).fetch();
      console.log('inb',inbound)
      return inbound;
  
    }
  },
  warehouse:function(){
    return Warehouse.find({})
  },
});