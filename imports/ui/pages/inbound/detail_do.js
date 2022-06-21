import './detail_do.html';
import { Meteor } from 'meteor/meteor';
import { loginbound } from '../../../api/inbound/inbound';
import { Warehouse } from '../../../api/warehouse/warehouse';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

let array = {}
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
Template.detail_do.onCreated(function () {
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

Template.detail_do.events({
  'click .btnSaveEdit': function (e, tpl) {
    e.preventDefault();

    var id = FlowRouter.getParam('id')
    console.log('id',id) 
    let check =[]
    Meteor.call('showbyid.check',id,
    (err,res) => {
      console.log('res',res)
      let data = res
      var product = data.detailupload
      console.log('prod',product)
      let i = 0
      for(let data of product){
        // var checkbox  = $('#checkdata' + i).val()
        if(data.itemsku === ''){

        }
        else{
          var checkbox = document.getElementById("checkdata"+i);
          var qty = document.getElementById("qty"+i);
          var comment = document.getElementById("comment"+i);
          console.log('cb',checkbox.checked)
          console.log('cb',qty.value)
          i = i + 1
          check.push({
                itemsku:data.itemsku,
                productname:data.productname,
                qty:qty.value,
                checkdata:checkbox.checked,
                comment:comment.value}
            )
        }

      }
      console.log('check',check)
      Meteor.call('updateinbound.check',id,check,
      (err,res) => {
          if(err){
              console.log('res',err)
              toastr.error('Update Detail Product Failed')
          } 
          else{
              console.log('res',res)
              toastr.success('Update Detail Product Success');
          } 
      })

    })
    // var data = loginbound.find({'_id':id},{}).fetch()
    // Meteor.call('inbound.update',
    //     id,approve,approvedate,approveby,warehouse,
    //     (err, res) => {
    //         if (err) {
    //             toastr.warning('Approve Failed')
    //         } else {
    //             $('#entryData').addClass('d-none');
    //             toastr.success('Approve Sucess');
    //         } 
    //     });
},
// 'input #checkdata': function (e, tpl) {
//   // e.preventDefault();
//   var id = this._id;
//   var approve = $('#checkdata' + id).val();
//   var warehouse = $('#warehouse' + id).val();
//   var approvedate = new Date();
//   var approveby = Meteor.userId();
//   // console.log('approve',approve)
//   // if (confirm('Do you want to save survey?')) {
//   Meteor.call('inbound.update',
//       id,approve,approvedate,approveby,warehouse,
//       (err, res) => {
//           if (err) {
//               toastr.warning('Approve Failed')
//           } else {
//               $('#entryData').addClass('d-none');
//               toastr.success('Approve Sucess');
//           } 
//       });
// },
});    
Template.detail_do.helpers({
  
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
  warehousestore:function(id){
    return Warehouse.findOne({'_id':id})
  },
});