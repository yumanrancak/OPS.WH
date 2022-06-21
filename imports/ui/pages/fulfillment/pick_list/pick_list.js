import './pick_list.html';
import { Meteor } from 'meteor/meteor';
import { filter, template } from 'lodash';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { shipper } from '../../../../api/orders/orders';
import { data } from 'jquery';
toastr.options = {
  "closeButton": true,
  "debug": true,
  "newestOnTop": false,
  "progressBar": true,
  "positionClass": "toast-top-full-width",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "5000",
  "extendedTimeOut": "1000",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut",
  "maxOpened": 1
}
var emp = []
var detail = []
var datpl = []
Session.set('isCheckProduct', true);

// d.setDate(d.getDate() - 3);

Tracker.autorun(() => {
  Meteor.subscribe('userList');
  Meteor.subscribe('shipperFind.all');

});


Template.pick_list.onCreated(async function () {
  
  Meteor.call("findpicklist",(error, result) => {
    // console.log(result)
    var a = 0
    for(datas of result){
      if(datas.checkboxstatus == true){
        a = a +1
      }
    }
    console.log(a)
    if(a === result.length){
      var status = document.getElementsByName("checkall");
      status[0].checked =true
    }
  })
  this.filter1 = new ReactiveTable.Filter('searchinv', ['invoice_no']);
  this.filter2 = new ReactiveTable.Filter('searchtrack', ['tracking_no']);
  this.filter3 = new ReactiveTable.Filter('searchmp', ['marketplace']);
  this.filter4 = new ReactiveTable.Filter('searchshipper', ['shipper_internal']);
  this.filter5 = new ReactiveTable.Filter('searchstatus', ['comment']);
  this.filter6 = new ReactiveTable.Filter('searchby', ['validasi1By']);
  this.isSubs = new ReactiveVar(false);
  emp = []
});


Template.pick_list.events({
  
  "change #searchtrack": function (event, template) {
    var input = $(event.target).val()

    if (input) {
      template.filter2.set(input);
    } else {
      template.filter2.set("");
    }
  },
  "change #searchinv": function (event, template) {
    var input = $(event.target).val()
    if (input) {
      console.log(input)
      template.filter1.set(input);
    } else {
      template.filter1.set("");
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
  "change #searchshipper": function (event, template) {
    var input = $(event.target).val();
    console.log('shipper:' + input);
    if (input != 'all_shipper') {
      template.filter4.set(input);
    } else {
      template.filter4.set("");
    }
  },
  "change #searchstatus": function (event, template) {
    var input = $(event.target).val();
    console.log('shipper:' + input);
    console.log(template.filter5.get());
    if (input === true) {
      template.filter5.set(input);
      console.log('this',this)
    } else if (input === false) {
      template.filter5.set(input);
    }
    else {
      template.filter5.set("");
    }
  },
  "change #searchby": function (event, template) {
    var input = $(event.target).val();
    console.log('shipper:' + input);
    if (input != 'all_user') {
      template.filter6.set(input);
      console.log('this',this)
    } else {
      template.filter6.set("");
    }
  },
  'click .btnCreate': function (e, tpl) {
    e.preventDefault();
    if (confirm('Do you want to Create Batch List ??')) {
        // Session.set('isCheckProduct', false);
          Session.set('sub2',false)
        Meteor.call("PickList.update2", (error, result) => {
          console.log(result)
          toastr.success('Successfully to create batch, finished!');
          Session.set('sub2',true)
        })
    }
  },
  'click .listbatch': function (event) {
    console.log('listbatch');
    FlowRouter.go('/batch_list');
  },
  'input #checkall': function(e, tpl) {
    // e.preventDefault();
    emp = []
    Session.set('checkall',true)
    console.log('product emp', emp)
    Session.set('isCheckProduct', true);
    var all = document.getElementById("check");
    console.log('temp',e.currentTarget.checked)
    var a = 0
    if(e.currentTarget.checked == true){
      var i =0 
      // $(".checkboxAll").prop('checked', true);
      console.log('i',i)
      $('.checkboxAll').each(function(){
        Session.set('sub2',false)
        var box = $(".checkboxAll")[i] 
        Meteor.call("order.list", box.name.substring(5),(error, result) => {
            if(result.checkstatusBy == null ){
              Meteor.call("updatecheckbox.true", box.name.substring(5))
              $("#check"+ box.name.substring(5)).prop('checked', true);
              Session.set('sub2',true)
              console.log('i',i)
            }
            else if(result.checkstatusBy == Meteor.userId() ){
              Meteor.call("updatecheckbox.true", box.name.substring(5))
              $("#check"+ box.name.substring(5)).prop('checked', true);
              Session.set('sub2',true)
              console.log('i',i)
            }
            else{
              Session.set('sub2',true)
            }
        })
        i = i +1
      })
      
    }
    else{
        $('.checkboxAll').each(function(){
          Session.set('sub2',false)
          var box = $(".checkboxAll")[a]
          console.log('box1',box)
          Meteor.call("order.list", box.name.substring(5),(error, result) => {
            if(result.checkstatusBy == Meteor.userId() || result.checkstatusBy == null){
              $("#check"+ box.name.substring(5)).prop('checked', false);
              console.log('box',box)
              Meteor.call("updatecheckbox.false", box.name.substring(5))
              emp = []
              Session.set('sub2',true)
            }
            else{

              Session.set('sub2',true)
            }
          })
          a = a +1
        })
        Session.set('isCheckProduct', false)
    }
  }
})

Template.pick_list.helpers({

  createList() {
    return ReactiveMethod.call('createdby.all.drop');
  },
  userNameDrop: function (uid) {
    // console.log(uid);
    var user = Meteor.users.findOne(uid);
    // console.log(user);
    var oId = user && user.username;
    // console.log(oId);
    return oId;
  },
  showDataKurir: function () {
    var kurir = shipper.find();
    // console.log('kurir',kurir)
    return kurir;
  },
  isSubscriptionR: function () {
    var subs = Template.instance().isSubs.get();
    console.log('subs ready:' + subs);
    return subs;
  },
  isSubscriptionR2: function () {
    var subs = Session.get('sub2')
    console.log('subs ready:' + subs);
    return subs;
  },
  settingsvalid1: function () {
    return {
      collection: 'pickscan1',
      rowsPerPage: 50,
      showFilter: false,
      fields: [
        // { key: 'order_id', label: 'Order ID' },
        { key: 'invoice_no', label: 'Invoice No', cellClass: 'text-bold mr-1' },
        { key: 'tracking_no', label: 'Tracking No' },
        { key: 'marketplace', label: 'Market Place' },
        { key: 'shipper_internal', label: 'Shipper' },
        {
          key: 'validasi1By', label: 'Scanned By', fn: function (value) {
            if(value){
              var user = Meteor.users.findOne({ '_id': value }, { fields: { 'services': 0 } })
              return user.username  
            }
          }
        },
        {
          key: 'validasi1At', sortOrder: 0, sortDirection: 'descending', label: 'Validation Date', fn: function (date) {
            return moment(new Date(date)).format('D-MMM-YYYY, HH:mm')
          }
        },
        {
          key: 'errorLog', label: 'Product Status',
          cellClass: function (data) {
            if (!data || data == null) {
              return 'badge badge-info'
            }
            else {
              return 'badge badge-warning'
            }
          }, fn: function (data) {
            if (!data) {
              return 'Available'
            }
            else {
              return 'Not Found'
            }
          },
        },
        {
          key: 'comment', label: 'Comment',
          cellClass: 'text-xs',
        },
        {
          key: 'checkboxstatus', label: 'Action', tmpl: Template.pick, sortable: false,
        },
        {
          key: 'checkstatusBy', label: 'Checked By', fn: function (value) {
            if (value) {
              var user = Meteor.users.findOne({ '_id': value }, { fields: { 'services': 0 } })
              // console.log('user',user)
              return user.username
            }
          }
        },
      ],
      filters: ['myFilterBrand', 'searchtrack', 'searchinv', 'searchmp', 'searchshipper', 'searchstatus', 'searchby'],
      ready: Template.instance().isSubs,

    };
  },

});

Template.pick.onCreated(function () {
  
  var check = Template.instance().data
  datpl.push(check)
  var d = 0
  if (check.checkboxstatus == true) {
    d = d +1 
    if (check.checkstatusBy === Meteor.userId()) {
      for (let dataproduct of check.products) {
        // console.log('spl', emp)
        Meteor.call("checkproduct.picklist", check, dataproduct, async(error, result) => {
          if(result != false){
            if(Session.get('isCheckProduct') !== false){
              var resultdata = result
              Meteor.call("updatecheckbox.true", check._id._str)
              // if (resultdata.is_bundle === 0) {
              //   emp.push({
              //     transaksiid : check._id._str,
              //     item_sku: resultdata.product_sku,
              //     label: resultdata.product_name,
              //     data_bundle: 0,
              //     qty: parseInt(dataproduct.qty),
              //     orderid: check.order_id.toString(),
              //     brand: dataproduct.brand,
              //     brand_id: resultdata.brand_id._str,
              //     marketplace: check.marketplace,
              //     invoice_no: check.invoice_no,
              //     createdBy: Meteor.userId(),
              //     createdAt: new Date()
              //   })
              //   // console.log('emp1',emp)
              // }
              // else {
              //   // console.log('res',result)
              //   Meteor.call("checkbundle", resultdata.product_sku,check.invoice_no,(err,ress)=>{
              //     if (ress != false){
              //       // console.log('res',result)
              //       for (let datafor of ress) {
              //         Meteor.call("getproductbysku", datafor.child_sku,check.invoice_no,(err,ress2)=>{
              //           if(ress2){
              //             emp.push({
              //               transaksiid : check._id._str,
              //               item_sku: datafor.child_sku,
              //               label: ress2.product_name,
              //               sku_bundle:datafor.parent_sku,
              //               // brand: datafor.nama_brand,
              //               brand_id: ress2.brand_id._str,
              //               data_bundle: resultdata.is_bundle,
              //               qty: parseInt(datafor.qty)*parseInt(dataproduct.qty),
              //               orderid: check.order_id.toString(),
              //               marketplace: check.marketplace,
              //               invoice_no: check.invoice_no,
              //               createdBy: Meteor.userId(),
              //               createdAt: new Date()
              //             })
              //           }
              //           else{      
              //             var test = []
              //             for(let data of emp){
              //               if(data.transaksiid !== check._id._str){
              //                 test.push(data)
              //               } 
              //             }
              //             emp = test
              //             Meteor.call("updatecheckbox.false", check._id._str)
              //             Session.set('isCheckProduct', false);
              //             // e.currentTarget.checked = false 
              //           }
              //         })
              //       }
              //     }
              //     else{
              //       var test = []
              //       for(let data of emp){
              //         if(data.transaksiid !== check._id._str){
              //           test.push(data)
              //           // console.log('spl', test)
              //         } 
              //       }
              //       emp = test
              //       console.log('spl', emp)
              //       Meteor.call("updatecheckbox.false", check._id._str)
              //       Session.set('isCheckProduct', false);
              //     }
              //     // return status[0].checked = false
              //     // emp.splice({ '_id': check._id }, 1)  
              //   })
              // }
            }
          }
          else{      
            var test = []
            for(let data of emp){
              if(data.transaksiid !== check._id._str){
                test.push(data)
                // console.log('spl', test)
              } 
            }
            emp = test
            console.log('spl', emp)
            Meteor.call("updatecheckbox.false", check._id._str)
            Session.set('isCheckProduct', false);
          }
          // return status[0].checked = false
          // emp.splice({ '_id': check._id }, 1)  
        })
      }
    }
  }
  
  // console.log(check["reactive-table-sort"])
  // return (check.checkboxstatus == true ? 'checked' : '');

});

Template.pick.helpers({
  checkedClass(todo) {
    var check = Template.instance().data
    // console.log('check',check.checkstatusBy)
    
    if (check.checkstatusBy === Meteor.userId()) {
      if(check.productsavaliblestatus == false){
        return (check.checkboxstatus == false ? 'disabled' : '');
      }
      else{
        return (check.checkboxstatus == true ? 'checked' : '');
      }
    }
    else {
      return (check.checkboxstatus == true ? 'disabled' : '');
    }
    //  if (Template.instance().filter.get() === "true") {
    //     return "checked";
    //   } 
    //   return "";
    // } 
  }
})
Template.pick.events({
  'input #check': function(e, tpl) {
    // e.preventDefault();
    Session.set('isCheckProduct',true)
    var id = this._id._str;
    var check = Template.instance().data
    console.log('check', id)
    var a = 0
    var status = document.getElementsByName("check" + id);
    if (status[0].checked === true) {
      Meteor.call("updatecheckbox.true", id)
      // for (let dataproduct of this.products) {
      //   console.log('spl', emp)
      //   Meteor.call("checkproduct.picklist", check, dataproduct, async(error, result) => {
      //     if(result){
      //       if(Session.get('isCheckProduct') !== false){
      //         var resultdata = result
      //         console.log('json asli',result)
      //           if (resultdata.is_bundle === 0) {
      //             Meteor.call("updatecheckbox.true", id)
      //             emp.push({
      //               transaksiid : id,
      //               item_sku: resultdata.product_sku,
      //               label: resultdata.product_name,
      //               brand: dataproduct.brand,
      //               brand_id: resultdata.brand_id._str,
      //               data_bundle: 0,
      //               qty: parseInt(dataproduct.qty),
      //               orderid: this.order_id.toString(),
      //               marketplace: this.marketplace,
      //               invoice_no: this.invoice_no,
      //               createdBy: Meteor.userId(),
      //               createdAt: new Date()
      //             })
      //             console.log('emp1',emp)
      //           }
      //           else {
      //             Meteor.call("checkbundle", resultdata.product_sku,check.invoice_no,(err,ress)=>{
      //               // console.log('checkbundle',ress)
      //                 for (let datafor of ress) {
      //                   Meteor.call("checkdetailbundle", datafor.child_sku,check.invoice_no,(err,ress2)=>{
      //                       Meteor.call("updatecheckbox.true", id)
      //                       // console.log('Bundle product ', ress2)
      //                       emp.push({
      //                         transaksiid : id,
      //                         item_sku: datafor.child_sku,
      //                         label: ress2.product_name,
      //                         sku_bundle:datafor.parent_sku,
      //                         // brand: datafor.nama_brand,
      //                         brand_id: ress2.brand_id._str,
      //                         data_bundle: resultdata.is_bundle,
      //                         qty: parseInt(datafor.qty)*parseInt(dataproduct.qty),
      //                         orderid: this.order_id.toString(),
      //                         marketplace: this.marketplace,
      //                         invoice_no: this.invoice_no,
      //                         createdBy: Meteor.userId(),
      //                         createdAt: new Date()
      //                       })
      //                   })
      //                 }
      //                 console.log('bundle',emp)
      //             })
      //           }
      //       }
      //     }
      //     else{
      //       status[0].checked = false      
      //       console.log('spl', emp)
      //       Session.set('isCheckProduct', false);
      //     }  
      //   })
      // }
    }
    else {
      // var test = []
      // for(let data of emp){
      //   if(data.transaksiid !== id){
      //     test.push(data)
      //     // console.log('spl', test)
      //   } 
      // }
      // emp = test
      // console.log('spl', emp)
      Meteor.call("updatecheckbox.false", id)
    }  
  },
})