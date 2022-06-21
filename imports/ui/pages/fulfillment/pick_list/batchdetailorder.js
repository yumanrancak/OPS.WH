import './batchdetailorder.html';
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
var order =""
var totalqty = []
Session.set('changeqty',false)
var real 
var bundle_after 
Tracker.autorun(() => {

});


Template.batchdetailorder.onCreated(async function () {
  this.isSubs = new ReactiveVar(false);
  this.isSubs2 = new ReactiveVar(false);
});


Template.batchdetailorder.events({
  'click .clickdata': function (e, tpl) {
    e.preventDefault();
    order = $(e.target.innerText)
    console.log('order select',order.selector)
    Session.set("click", false);  
    Session.set("click", true);  
  },
  'click .btnback': function (e, tpl) {
    e.preventDefault();
    var id = this._id;
    history.back();
    // FlowRouter.go('/pick_list/batch_list/');
  },
  'click .btnPrint': function (e, tpl) {
    e.preventDefault();
  },

  'click .deleteproduct':function(e,tpl){
    e.preventDefault();
    Session.set('changeqty',false)
    var id = this.transaksiid
    var i = $("#deleterow"+this.item_sku).attr("data-index")
    console.log('i',i)
    $('#deleterow'+this.item_sku).closest("tr").remove();
    Session.set('changeqty',true)
    totalqty.splice(i,1)
    Meteor.call("batchlistdetail.delete", id,this, (error, result) => {
        console.log(result)
        toastr.success('Successfully to Deleted Order, finished!');
      })
      
     // remove row
  },
  'click .deleteorder':function(e,tpl){
    e.preventDefault();
    var id = this.order_id
    var i = $("#deleterow"+this.order_id).attr("data-index")
    console.log('i',this._id)
    $('#deleterow'+this.order_id).closest("tr").remove();
    Meteor.call("batchlistorder.delete", this._id, (error, result) => {
        console.log(result)
        toastr.success('Successfully to Deleted Order, finished!');
      })
      
     // remove row
  },
  'change #qty':function(e,tpl){
    e.preventDefault();
    var bef = Session.get('databefore')
    Session.set('changeqty',false)
    Session.set('qtyfield',true)
    Session.set('qtyafter',e.target.value)
    var i = $(e.target).data("index")
    console.log(this)
    Session.set('index',i)
    // console.log('product',this.products[i])
    if(!bef){
      var bef = Session.set('databefore',this)
    }
    Session.set('changeqty',true)
    totalqty.splice(i,1)
    totalqty.splice(i,0,{qty:parseInt(e.target.value)})
    console.log('datasqty',totalqty)
  },
  'click .updaterow': function (e, tpl) {
    e.preventDefault();
    var aft = Session.get('dataafter')
    var qty = Session.get('qtyafter')
    console.log('real',real)
    if(Session.get('qtyfield') === true){
      {
        console.log('nobundle')
        Session.set('databefore',this)
        var bef = Session.get('databefore')
        var id = bef.transaksiid
        Meteor.call("batchdetail.update", id,bef,aft,qty, (error, result) => {
          console.log(result)
          toastr.success('Successfully to Update Order, finished!');
        })
      }
    }
    else{
      toastr.warning('please check your field!')
    }
    
  },
  'click #btnSearchPro': function (e, tpl) {
    Session.set('isCheckProduct', true);
    let productSearch = $('#inputSearch').val();
    // console.log('this',this)
    if (productSearch) {
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
  console.log('e',e)
  
  var datas = Session.get('databefore')
  console.log('this',datas)
  console.log('bundleafter',bundle_after)
  let thisTarget = e.currentTarget
  let dataSku = thisTarget.getAttribute('data-sku')
  console.log('sku',dataSku)
  let dataName = thisTarget.getAttribute('data-name')
  for(let data of bundle_after){
    if(dataSku === data.no_sku){
      var res = {no_sku:dataSku,label:dataName,bundle:data.data_bundle}
      console.log('res',res)
      Session.set('dataafter',data)
      console.log('dataafter',Session.get('dataafter'))
    }
  }
  var productInput = document.getElementById('name'+datas.item_sku)
  var productSkuInput = document.getElementById('sku'+datas.item_sku)
  console.log('input',document.getElementById('name'+datas.item_sku))
  if(!Session.get('qtyafter')){
    Session.set('qtyafter',datas.totalsum)
  }
  Session.set('qtyfield',true)
  productInput.value = dataName
  productSkuInput.value = dataSku
  
},
'click #btnSearchSku': function (e, tpl) {
  Session.set('isCheckProduct', true);
  console.log('data',Session.get('databefore'))
  let skuSearch = $('#skuSearch').val();
  var i = $(e.target).attr("data-index")
  console.log('i',i)
  // var res = Meteor.call('get-product', productSearch);
  if (skuSearch) {
      HTTP.call('GET', 'https://product-mongo.egogohub.tech/get-sku-fix?sku=' + skuSearch, {
      }, (error, result) => {
          if (error) {
              Session.set('isCheckProduct', false);
              toastr.warning('Fail to Get Data, please try again');
          }
          var respData = result.data.data;
          console.log('respdata',respData)
          $('#modalAdd').find('.modal-body table tbody').remove();
          $('#modalAdd').find('.modal-body table').append('<tbody>');
          if(respData){
            for (let i = 0; i < respData.length; i++) {
              item = respData[i]
              bundle_after = respData
              console.log('item',bundle_after)
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
          else if(!respData){
            Session.set('isCheckProduct', false);
            toastr.warning('Data Product is not found , please try again');
          }
          
      });
  } else {

  }

},
  'click .skuget':function(e,tpl){
    console.log('this sku',this)
    Session.set('databefore',this)
    
  },
})


Template.batchdetailorder.helpers({
  isCheckProductSession() {
    console.log('check',Session.get('isCheckProduct'))
    return Session.get('isCheckProduct');
  },
  id: function () {

    var id = FlowRouter.getParam('id')
    return id
  },
  orderid:function(){
    if (Session.get('click') === true){
      console.log(order.selector)
      var test = order.selector
      Template.instance().isSubs2.set(true);
      // Session.set("click", false);  
      return test
    }
  }

  ,
  tabledetail: function () {
    var params = FlowRouter.getParam('id')
    // console.log('params',params)
    var data = ReactiveMethod.call('detailorder.dashboard', params);
    console.log('data',data)
    if (data) {
      Template.instance().isSubs.set(true);
    }
    return data
  },

  getTotal(qty){
    totalqty.push({qty:qty})
    return qty
  },
  tabledetailproduct: function () {

    if (Session.get('click') === true){
        var params = FlowRouter.getParam('id')
        console.log('order',order.selector)
        var data = ReactiveMethod.call('finddetailbyorder.list', params,order.selector);
        real = data
        if (data) {
          Template.instance().isSubs2.set(true);
        }
        return real
    }
  },

  getbrand: function (brand) {

    if (Session.get('click') === true){
        console.log('order',brand)
        var data = ReactiveMethod.call('brands.list.all', new Mongo.ObjectID(brand));
        console.log('data',data)
        if (data) {
          Template.instance().isSubs2.set(true);
        }
        return data
    }
  },
  isSubscriptionR: function () {
    var subs = Template.instance().isSubs.get();
    console.log('subs ready:' + subs);
    return subs;
  },
  isSubscriptionDetail: function () {
    var subs = Template.instance().isSubs2.get();
    console.log('subs Detail:' + subs);
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

