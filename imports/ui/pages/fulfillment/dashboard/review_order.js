import './review_order.html';
import { Meteor } from 'meteor/meteor';
import { isObject, template } from 'lodash';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { success } from 'toastr';
toastr.options = {
  "closeButton": true,
  "debug": true,
  "newestOnTop": true,
  "progressBar": true,
  "positionClass": "toast-top-full-width",
  "preventDuplicates": true,
  "onclick": null,
  "showDuration": "300",
  "hideDuration": "1000",
  "timeOut": "30",
  "extendedTimeOut": "60",
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
}

var $ = require('jquery');
var dt = require('datatables.net')();
var totalqty = []
var bundle_after
Tracker.autorun(() => {
  Session.set('changeqty', false)
  totalqty = []
});


Template.review_order.onCreated(async function () {
  Session.set('changeqty', false)
  console.log('masuk')
  Session.set('isCheckProduct', false);
  totalqty = []
  this.isSubs = new ReactiveVar(true);
});


Template.review_order.events({
  'click .btnback': function (e, tpl) {
    e.preventDefault();
    var id = this._id;
    history.back();
  },
  'click .updaterow': function (e, tpl) {
    e.preventDefault();
    var id = FlowRouter.getParam('id')
    var aft = Session.get('dataafter')
    var qty = Session.get('qtyafter')
    if (Session.get('qtyfield') === true) {
      Session.set('databefore', this)
      var bef = Session.get('databefore')
      console.log('this', bef)
      console.log('aft', aft)
      Meteor.call("orderreview.update", id, bef, aft, qty, (error, result) => {
        console.log(result)
        toastr.success('Successfully to Update Order , finished!', 'Success!');
      })
      // Meteor.call("checkproduct.picklist",this,this, (error, result) => {
      //   console.log('res',result)
      //   if (error) {
      //       toastr.warning('Fail to Get Data'+ this.item_sku+', please try again');
      //   }
      //   else{
      //     var respData = result.data.data;
      //     // toastr.info(' please wait !!');
      //     if(respData){
      //       console.log('respdata',respData)
      //       for (let i = 0; i < respData.length; i++) {
      //         item = respData[i]
      //         if(item.no_sku === this.item_sku){
      //           Session.set('databefore',{
      //             item_sku:this.item_sku,
      //             label:this.label,
      //             order_id:this.order_id,
      //             invoice_no:this.invoice_no,
      //             data_bundle:item.data_bundle,
      //             qty:this.qty,
      //           })
      //           var bef = Session.get('databefore')
      //           Meteor.call("orderreview.update", id,bef,aft,qty, (error, result) => {
      //             console.log(result)
      //             toastr.success('Successfully to Update Order, finished!','Success!');
      //           })
      //         }
      //       }
      //     }
      //     else{
      //       console.log('nobundle')
      //       Session.set('databefore',this)
      //       var bef = Session.get('databefore')
      //       Meteor.call("orderreview.update", id,bef,aft,qty, (error, result) => {
      //         console.log(result)
      //         toastr.success('Successfully to Update Order -- No Bundle, finished!','Success!');
      //       })
      //     }
      //   }
      // })
    }
    else {
      toastr.error('please check your field!', 'Attention!')
    }

  },
  'click .removerow': function (e, tpl) {
    e.preventDefault();
    // remove row
  },
  'click .deleteproduct': function (e, tpl) {
    e.preventDefault();
    Session.set('changeqty', false)
    var id = FlowRouter.getParam('id')
    var i = $("#deleterow" + this.item_sku).attr("data-index")
    console.log('i', i)

    if (confirm('Do you want to Delete this product??')) {
      $('#deleterow' + this.item_sku).closest("tr").remove();
      Session.set('changeqty', true)
      totalqty.splice(i, 1)
      Meteor.call("orderreview.delete", id, this, (error, result) => {
        console.log(result)
        toastr.success('Successfully to Deleted Order', 'Deleted!');
      })
    }
  },
  'change #qty': function (e, tpl) {
    e.preventDefault();
    var bef = Session.get('databefore')
    Session.set('changeqty', false)
    Session.set('qtyfield', true)
    Session.set('qtyafter', e.target.value)
    var i = $(e.target).data("index")
    console.log(this)
    Session.set('index', i)
    // console.log('product',this.products[i])
    if (!bef) {
      var bef = Session.set('databefore', this)
    }
    Session.set('changeqty', true)
    totalqty.splice(i, 1)
    totalqty.splice(i, 0, { qty: parseInt(e.target.value) })
    console.log('datasqty', totalqty)
  },
  'click .skuget': function (e, tpl) {
    console.log('this sku', this)
    Session.set('databefore', this)

  },
  'click #btnSearchSku': function (e, tpl) {
    Session.set('isCheckProduct', true);
    console.log('data', Session.get('databefore'))
    let skuSearch = $('#skuSearch').val();
    var i = $(e.target).attr("data-index")
    console.log('i', i)
    // var res = Meteor.call('get-product', productSearch);
    if (skuSearch) {
      // HTTP.call('GET', 'https://api-product.egogohub.tech/get-sku-fix?sku=' + skuSearch, {
      HTTP.call('GET', 'https://product-mongo.egogohub.tech/get-sku-fix?sku=' + skuSearch, {
      }, (error, result) => {
        if (error) {
          Session.set('isCheckProduct', false);
          toastr.warning('Fail to Get Data, please try again');
        }
        var respData = result.data.data;
        console.log('respdata', respData)
        $('#modalAdd').find('.modal-body table tbody').remove();
        $('#modalAdd').find('.modal-body table').append('<tbody>');
        if (respData) {
          for (let i = 0; i < respData.length; i++) {
            item = respData[i]
            bundle_after = respData
            console.log('item', bundle_after)
            $('#modalAdd').find('.modal-body table tbody')
              .append('<tr>')
              .append('<td>' + item.no_sku + '<td>')
              .append('<td>' + item.nama_brand + '<td>')
              .append('<td>' + item.label + '<td>')
              .append('<td><button class="btn btn-block btn-success selectProduct" data-name="' + item.label + '" data-sku="' + item.no_sku + '" data-brand="' + item.nama_brand + '" data-dismiss="modal">Select</button><td>')
              .append('</tr>');
          }
          $('#modalAdd').find('.modal-body table').append('</tbody>');
          Session.set('isCheckProduct', false);
        }
        else if (!respData) {
          Session.set('isCheckProduct', false);
          toastr.warning('Data Product is not found , please try again');
        }

      });
    } else {

    }

  },

  'click #btnSearchPro': function (e, tpl) {
    Session.set('isCheckProduct', true);
    let productSearch = $('#inputSearch').val();
    // console.log('this',this)
    if (productSearch) {
      // HTTP.call('GET', 'https://api-product.egogohub.tech/get-all/product?name=' + productSearch, {
      HTTP.call('GET', 'https://product-mongo.egogohub.tech/get-all/product?name=' + productSearch, {
      }, (error, result) => {
        if (error) {
          Session.set('isCheckProduct', false);
          toastr.warning('Fail to Get Data, please try again');
        }
        respData = result.data.data;
        $('#modalAdd').find('.modal-body table tbody').remove();
        $('#modalAdd').find('.modal-body table').append('<tbody>');
        for (let i = 0; i < respData.length; i++) {
          item = respData[i]
          bundle_after = respData
          // console.log('item',item)
          $('#modalAdd').find('.modal-body table tbody')
            .append('<tr>')
            .append('<td>' + item.ref + '<td>')
            .append('<td>' + item.nama_brand + '<td>')
            .append('<td>' + item.label + '<td>')
            .append('<td><button class="btn btn-block btn-success selectProduct" data-name="' + item.label + '" data-sku="' + item.ref + '" data-brand="' + item.nama_brand + '" data-dismiss="modal">Select</button><td>')
            .append('</tr>');
        }
        $('#modalAdd').find('.modal-body table').append('</tbody>');
        Session.set('isCheckProduct', false);
      });
    } else {
      toastr.warning('Please Fill Search Terms..!!');
      Session.set('isCheckProduct', false);
    }
    // var res = Meteor.call('get-product', productSearch);

  },
  'click .selectProduct': function (e, tpl) {
    e.preventDefault();
    console.log('e', e)

    var data = Session.get('databefore')
    console.log('this', data)
    console.log('bundleafter', bundle_after)
    let thisTarget = e.currentTarget
    let dataSku = thisTarget.getAttribute('data-sku')
    console.log('sku', dataSku)
    let dataName = thisTarget.getAttribute('data-name')
    for (let data of bundle_after) {
      if (dataSku == data.no_sku) {
        var res = { no_sku: dataSku, label: dataName, bundle: data.data_bundle }
        console.log('res', res)
        Session.set('dataafter', data)
        console.log('dataafter', Session.get('dataafter'))
      }
      if (dataSku == data.ref) {
        var res = { no_sku: dataSku, label: dataName, bundle: data.data_bundle }
        console.log('res', res)
        Session.set('dataafter', data)
        console.log('dataafter', Session.get('dataafter'))
      }
    }
    var productInput = document.getElementById('name' + data.item_sku)
    var productSkuInput = document.getElementById('sku' + data.item_sku)
    if (!Session.get('qtyafter')) {
      Session.set('qtyafter', data.qty)
    }
    Session.set('qtyfield', true)
    productInput.value = dataName
    productSkuInput.value = dataSku

  },
})

Template.review_order.helpers({

  isCheckProductSession() {
    console.log('check', Session.get('isCheckProduct'))
    return Session.get('isCheckProduct');
  },
  isSubscriptionR: function () {
    var subs = Template.instance().isSubs.get();
    console.log('subs ready:' + subs);
    return subs;
  },
  getTotal(qty) {
    totalqty.push({ qty: qty })
    return qty
  },
  id: function () {

    var id = FlowRouter.getParam('id')
    return id
  },
  deleteproduct: function (e) {
    var i = e
    Session.set('index', i)
    // console.log('product',this.products[i])
    console.log('i', i)
    var bef = this.products[i]

    // remove row
  }
  ,
  headerdata: function () {
    var params = FlowRouter.getParam('id')

    console.log('params2', params)
    var data = ReactiveMethod.call('order.list', params);
    // console.log('id',params)
    return data
  },
  total() {
    var params = FlowRouter.getParam('id')
    var datas = ReactiveMethod.call('order.list', params);
    var Total = 0;
    // console.log(datas)
    if (datas) {
      var data = datas.products
      if (Session.get('changeqty') !== true) {
        for (let dat of data) {
          if (dat.cancelstatus != true) {
            Total += parseInt(dat.qty);
          }
        }
        console.log('Total1 ', Total)
      }
      else {
        for (let data of totalqty) {
          Total += parseInt(data.qty);
        }
        console.log('Total', Total)
      }
      return Total
    }
  }

});