import './stock_out3.html';
import { Meteor } from 'meteor/meteor';
import { template } from 'lodash';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Brand } from '../../../../api/brand/brand';
import Papa from 'papaparse';
import { stockout } from '../../../../api/orders/orders';
import { Warehouse } from '../../../../api/warehouse/warehouse';
import { manualstock } from '../../../../api/product/product';
import moment from 'moment';
//METHOD IN PRODUCT

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
var $  = require( 'jquery' );
var dt = require( 'datatables.net' )();
var data21= []
// var tableout =$('#table-out').DataTable();
var df = new Date()
var dt = new Date()
var bd = ""
Tracker.autorun(() => {
  Meteor.subscribe('warehouse.active');
  Meteor.subscribe('all.manualstock');
  Meteor.subscribe('userList')
  Meteor.subscribe('brand.all')

  Session.set('isCheckProduct', true);
  Session.set('statusinout',"")
  Session.set('label',"")
  Session.set('whin',"")
  Session.set('chosse_expired_date',null)
  // Meteor.call("getgroupmouvment",df.toISOString().slice(0,10),dt.toISOString().slice(0,10),null,(err,res)=>{
  //   console.log('res',res)
  //   data21 = res 
  // })
});


Template.stock_out3.onCreated(async function () {
  // console.log('dt',dt)
    $('#pills-out-tab').addClass('active');
    
    // var currentPage = new ReactiveVar(Session.get('current-page') || 0);
    // this.currentPage = currentPage;
    // this.autorun(function () {
    //   Session.set('current-page', currentPage.get());
    // });
    
    this.filter2 = new ReactiveTable.Filter('searchstatus', ['brand_id']);
    this.filter1 = new ReactiveTable.Filter('searchsku', ['product_sku']);
    // this.filter3 = new ReactiveTable.Filter('searchstatus', ['fk_brand']);
    // this.filter4 = new ReactiveTable.Filter('searchsku', ['ref']);

    Session.set('scan',false)
    this.isSubs = new ReactiveVar(true);
    
  });


Template.stock_out3.events({
  'click .btnactive' : function (e,tpl) {
    e.preventDefault();
    Session.set('isCheckProduct', true);
    Session.set('statusinout',"")
    Session.set('scan',true),
    Session.set('datashow','') 
    Session.set('label',"")
    Session.set('inputqty',0) 
    // in
    Session.set('chosse_expired_date',null)
    Session.set('expired_date',null)
    document.getElementById( 'inscaning' ).readOnly =false
    document.getElementById( 'inscaning' ).style.display = 'none'
    document.getElementById( 'inscaning' ).value =""
    document.getElementById( 'scanherein' ).style.display = 'block'
    document.getElementById( 'inputqtyin' ).style.display = 'none'
    document.getElementById( 'inputqtyin' ).value =""
    document.getElementById( 'select2in' ).value =""
    document.getElementById( 'expiredselectin' ).style.display = 'none';
    $('#expiredselectin').val("")
    $('#select2in').hide();
    $('#expiredin').hide();
    $('#datenowin').hide();
    Session.set('whin',"")
    $('#whin').hide();
    document.getElementById( 'whin' ).value =""
    $('#updaterowin').hide();
    $('#clearin').hide();
    document.getElementById( 'datenowin' ).value = null
    // --out--
    Session.set('chosse_expired_date',null)
    Session.set('expired_date',null)
    document.getElementById( 'scaning' ).readOnly =false
    document.getElementById( 'scaning' ).style.display = 'none'
    document.getElementById( 'scaning' ).value =""
    document.getElementById( 'scanhere' ).style.display = 'block'
    document.getElementById( 'inputqty' ).style.display = 'none'
    document.getElementById( 'inputqty' ).value =""
    document.getElementById( 'select2' ).value =""
    $('#select2').hide();
    $('#expired').hide();
    $('#datenow').hide();
    $('#updaterow').hide();
    $('#clear').hide();
    document.getElementById( 'datenow' ).value = null
    // broken
    document.getElementById( 'scaningbroken' ).readOnly =false
    document.getElementById( 'scaningbroken' ).style.display = 'none'
    document.getElementById( 'scaningbroken' ).value =""
    document.getElementById( 'scanhere2' ).style.display = 'block'
    document.getElementById( 'inputqty2' ).style.display = 'none'
    document.getElementById( 'inputqty2' ).value =""
    document.getElementById( 'select3' ).value =""
    $('#select3').hide();
    $('#datenow2').hide();
    $('#clear2').hide();
    $('#updaterow2').hide();
    document.getElementById( 'datenow2' ).value = null
    //transfer
     
    document.getElementById( 'scaningtransfer' ).readOnly =false
    document.getElementById( 'scaningtransfer' ).style.display = 'none'
    document.getElementById( 'scaningtransfer' ).value =""
    document.getElementById( 'scanhere3' ).style.display = 'block'
    document.getElementById( 'inputqty3' ).style.display = 'none'
    document.getElementById( 'inputqty3' ).value =""
    document.getElementById( 'select4' ).value =""
    $('#select4').hide();
    $('#select5').hide()
    $('#datenow3').hide();
    $('#clear3').hide();
    $('#updaterow3').hide();
    document.getElementById( 'datenow3' ).value = null
    Session.set('from',"")
    Session.set('to',"") 
  
  },
  'change #selectstatus1':function(e){
    var chose = String(e.target.value)
    Session.set('statusinout',chose)
  },
  'change #statusselect2':function(e){
    var chose = String(e.target.value)
    Session.set('statusinout',chose)
  },

  'change #selectstatus1in':function(e){
    var chose = String(e.target.value)
    Session.set('statusinout',chose)
  },
  'change #from':function(e){
    var chose = String(e.target.value)
    console.log('from',chose)
    Session.set('from',chose)
  },
  'change #to':function(e){
    var chose = String(e.target.value)
    console.log('to',chose)
    Session.set('to',chose)
  },
  'click .scanherein' : function (e,tpl) {
    e.preventDefault();
    Session.set('scan',true)
    document.getElementById( 'scanherein' ).style.display = 'none'
    document.getElementById( 'inscaning' ).style.display = 'block'
  },
  'click .scanhere' : function (e,tpl) {
    e.preventDefault();
    Session.set('scan',true)
    document.getElementById( 'scanhere' ).style.display = 'none'
    document.getElementById( 'scaning' ).style.display = 'block'
  },
  'click .scanhere2' : function (e,tpl) {
    e.preventDefault();
    Session.set('scan',true)
    document.getElementById( 'scanhere2' ).style.display = 'none'
    document.getElementById( 'scaningbroken' ).style.display = 'block'
  },
  'click .scanhere3' : function (e,tpl) {
    e.preventDefault();
    Session.set('scan',true)
    document.getElementById( 'scanhere3' ).style.display = 'none'
    document.getElementById( 'scaningtransfer' ).style.display = 'block'
  },

  'change #inputqty' : function (e,tpl) {
    e.preventDefault();
    Session.set('inputqty',e.target.value)
  },
  'change #inputqtyin' : function (e,tpl) {
    e.preventDefault();
    Session.set('inputqty',e.target.value)
  },

  'change #inputqty2' : function (e,tpl) {
    e.preventDefault();
    Session.set('inputqty',e.target.value)
  },
  'change #inputqty3' : function (e,tpl) {
    e.preventDefault();
    Session.set('inputqty',e.target.value)
  },

  'change #scaningtransfer' : function (e,tpl) {
    Session.set('datashow','') 
    Session.set('inputqty',0) 
    Session.set('statusinout','')
    Session.set('chosse_expired_date',null)
    e.preventDefault();
    var scan = String(e.target.value)
    // console.log('test',scan)
    Meteor.call('getproductbysku',scan,(error, result) => {
      console.log('resp',result)
          if(result){
            Meteor.call('getstockbysku',scan,(error2, result2) => {
              if(Session.get('isCheckProduct') !== false){
              var data1 = {
                product_id:result._id,
                product_sku:result.product_sku,
                product_name:result.product_name,
                brand_id:result.brand_id,
                data_bundle:0,
                qty:result2 == 0 ? result2.stock : 0,
                // expired:respData[0].expired_date != null ? new Date(respData[0].expired_date) : null,
                category:Session.get('statusinout'),
                type:"out",
              }
              // console.log('resp',data1)
              Session.set('label',data1.product_name)
              Session.set('statusinout',"transfer")

              document.getElementById( 'inputqty3' ).style.display = 'block';
              document.getElementById( 'inputqty3' ).value = data1.qty;
              $('#datenow3').val(new Date().toJSON().slice(0,19));
              $('#updaterow3').hide();
              $('#saverow3').show();
              $('#datenow3').show();
              $('#select4').show();
              $('#select5').show()
              // Session.set('qty',data1.qty)
              Session.set('datashow',data1)
              Session.set('inputqty',data1.qty)
              }  
            })
          }
          else{
              Session.set('isCheckProduct', false);
              toastr.info('Product Not found, please check data product!');
              var x = document.getElementById("scaningtransfer").focus();
              x = true
          }
    });
  },
  'change #scaningbroken' : function (e,tpl) {
    Session.set('datashow','') 
    Session.set('inputqty',0) 
    Session.set('statusinout','')
    Session.set('chosse_expired_date',null)
    e.preventDefault();
    var scan = String(e.target.value)
    // console.log('test',scan)
    Meteor.call('getproductbysku',scan,(error, result) => {
      console.log('resp',result)
          if(result){
            Meteor.call('getstockbysku',scan,(error2, result2) => {
              if(Session.get('isCheckProduct') !== false){
                var data1 = {
                  product_id:result._id,
                  product_sku:result.product_sku,
                  product_name:result.product_name,
                  warehouse_id:result.warehouse_id,
                  brand_id:result.brand_id,
                  qty:result2 == 0 ? result2.stock : 0,
                  // expired:respData[0].expired_date != null ? new Date(respData[0].expired_date) : null,
                  category:Session.get('statusinout'),
                  type:"out",
                }
                Session.set('label',data1.product_name)

                document.getElementById( 'inputqty2' ).style.display = 'block';
                document.getElementById( 'inputqty2' ).value = data1.qty;
                $('#datenow2').val(new Date().toJSON().slice(0,19));
                $('#updaterow2').hide();
                $('#saverow2').show();
                $('#datenow2').show();
                $('#select3').show();
                $('#clear2').show();
                // Session.set('qty',data1.qty)
                Session.set('datashow',data1)
                Session.set('inputqty',data1.qty)
              }  
            })
          }
          else{
              Session.set('isCheckProduct', false);
              toastr.info('Product Not found, please check data product!');
              var x = document.getElementById("scaningbroken").focus();
              x = true
          }
    });


  },
  'change #scaning' : function (e,tpl) {
    Session.set('datashow','') 
    Session.set('inputqty',0) 
    Session.set('statusinout','')
    Session.set('chosse_expired_date',null)
    e.preventDefault();
    var scan = String(e.target.value)
    // console.log('test',scan)
    Meteor.call('getproductbysku',scan,(error, result) => {
      console.log('resp',result)
          if(result){
            Meteor.call('getstockbysku',scan,(error2, result2) => {
                if(Session.get('isCheckProduct') !== false){
                  var data1 = {
                    product_id:result._id,
                    product_sku:result.product_sku,
                    product_name:result.product_name,
                    warehouse_id:result.warehouse_id,
                    brand_id:result.brand_id,
                    qty:result2 == 0 ? result2.stock : 0 ,
                    // expired:respData[0].expired_date != null ? new Date(respData[0].expired_date) : null,
                    category:Session.get('statusinout'),
                    type:"out",
                  }
                  Session.set('inputqty',data1.qty)
                  Session.set('label',data1.product_name)

                  document.getElementById( 'inputqty' ).value = data1.qty;
                  var now = new Date()  
                  $('#datenow').val(new Date().toJSON().slice(0,19));
                  $('#expired').show();
                  document.getElementById( 'inputqty' ).style.display = 'block';
                  $('#updaterow').hide();
                  $('#saverow').show();
                  $('#datenow').show();
                  $('#select2').show();
                  $('#clear').show();
                  Session.set('datashow',data1)
                }
              })  
            }
            else{
                Session.set('isCheckProduct', false);
                toastr.info('Product Not found, please check data product!');

                var x = document.getElementById("scaning").focus();
                x = true
            }
    });
    Meteor.call('getmovementbysku',scan,(error2, result2) => {
      console.log('sku',result2)
      data = result2.expiredAt
      Session.set('expired_date',result2)
    })
  },

  'change #inscaning' : function (e,tpl) {
    Session.set('datashow','') 
    Session.set('inputqty',0) 
    Session.set('statusinout','')
    Session.set('chosse_expired_date',null)
    e.preventDefault();
    var scan = String(e.target.value)
    // console.log('test',scan)
    Meteor.call('getproductbysku',scan,(error, result) => {
      console.log('resp',result)
          if(result){
            Session.set('isCheckProduct', true);
            Meteor.call('getstockbysku',scan,(error2, result2) => {
                if(Session.get('isCheckProduct') !== false){
                  var data1 = {
                    product_id:result._id,
                    product_sku:result.product_sku,
                    product_name:result.product_name,
                    warehouse_id:result.warehouse_id,
                    brand_id:result.brand_id,
                    qty:result2 == 0 ? result2.stock : 0,
                    // expired:respData[0].expired_date != null ? new Date(respData[0].expired_date) : null,
                    category:Session.get('statusinout'),
                    type:"out",
                  }
                Session.set('inputqty',data1.qty)
                // console.log('resp',data1)
                Session.set('label',data1.product_name)

                document.getElementById( 'inputqtyin' ).value = data1.qty;
                document.getElementById( 'inputqtyin' ).style.display = 'block';
                var now = new Date()  
                // $('#datenow').data(new Date()) ;
                $('#datenowin').val(new Date().toJSON().slice(0,19));
                // if(data1.expired !== null){
                  // $('#expired').val(data1.expired.toJSON().slice(0,19));
                $('#expiredselectin').show();
                // $('#expiredselectin').val(new Date().toJSON().slice(0,19));
                Session.set('expired_date',$('#expiredselectin').val())
                $('#whin').show();
                // }
                $('#updaterowin').hide();
                $('#saverowin').show();
                $('#datenowin').show();
                $('#select2in').show();
                $('#clearin').show();
                // Session.set('qty',data1.qty)
                Session.set('datashow',data1)
              }  
            })
            }
            else{
                Session.set('isCheckProduct', false);
                // Meteor.call("product.fail",id,(error,result)=>{
                //   console.log(result)
                // })
                toastr.info('Product Not found, please check data product!');
                var x = document.getElementById("inscaning").focus();
                x = true
            }
    });
  },
  'click .btnsave': function (e, tpl) {
    e.preventDefault();
    if(Session.get('inputqty') != 0|| Session.get('statusinout') != "" )
    {
        if (confirm('Do you want to save this row??')) {
          if(Session.get('statusinout') === "transfer"){
            var data = Session.get('datashow') 
            var qty = Session.get('inputqty') 
            var status = Session.get('statusinout')
            var expired = Session.get('chosse_expired_date')
            var from = Session.get('from')
            var to = Session.get('to')
            console.log('to',to)
            Meteor.call("manualstocktransfer.save",data,qty,status,from,to,(error,result)=>{
              console.log(result)
              toastr.success('Succesfully to save stock out','Saved!');
            });
            $('#clear3').show();
            $('#saverow3').hide();
          }
          else if(Session.get('statusinout') === "innew" || Session.get('statusinout') === "inreturn"){
            var data = Session.get('datashow') 
            var qty = Session.get('inputqty') 
            var status = Session.get('statusinout')
            var wh = Session.get('whin')
            var expired = Session.get('chosse_expired_date')
            
            Meteor.call("stockin.save",data,qty,status,expired,wh,(error,result)=>{
              console.log(result)
              toastr.success('Succesfully to save stock in','Saved!');
            });
            $('#clear').show();
            $('#saverow').hide();
            $('#saverow2').hide();
            $('#clear2').show();
          }
          else{
            var data = Session.get('datashow') 
            var qty = Session.get('inputqty') 
            var status = Session.get('statusinout')
            var expired = Session.get('chosse_expired_date')
            
            Meteor.call("manualstock.save",data,qty,status,expired,(error,result)=>{
              console.log(result)
              toastr.success('Succesfully to save stock out','Saved!');
            });
            $('#clear').show();
            $('#saverow').hide();
            $('#saverow2').hide();
            $('#clear2').show();
          }
          Session.set('isCheckProduct', true);
              Session.set('statusinout',"")
              Session.set('scan',true),
              Session.set('datashow','') 
              Session.set('label',"")
              Session.set('inputqty',0) 
              // --in--
              
              Session.set('chosse_expired_date',null)
              Session.set('expired_date',null)
              document.getElementById( 'inscaning' ).readOnly =false
              document.getElementById( 'inscaning' ).style.display = 'none'
              document.getElementById( 'inscaning' ).value =""
              document.getElementById( 'scanherein' ).style.display = 'block'
              document.getElementById( 'inputqtyin' ).style.display = 'none'
              document.getElementById( 'inputqtyin' ).value =""
              document.getElementById( 'select2in' ).value =""
              document.getElementById( 'expiredselectin' ).style.display = 'none';
              $('#select2in').hide();
              $('#expiredin').hide();
              $('#datenowin').hide();
              $('#updaterowin').hide();
              Session.set('whin',"")
              $('#whin').hide();
              $('#clearin').hide();
              document.getElementById( 'datenowin' ).value = null
              // --out--
              
              Session.set('chosse_expired_date',null)
              Session.set('expired_date',null)
              document.getElementById( 'scaning' ).readOnly =false
              document.getElementById( 'scaning' ).style.display = 'none'
              document.getElementById( 'scaning' ).value =""
              document.getElementById( 'scanhere' ).style.display = 'block'
              document.getElementById( 'inputqty' ).style.display = 'none'
              document.getElementById( 'inputqty' ).value =""
              document.getElementById( 'select2' ).value =""
              $('#select2').hide();
              $('#expired').hide();
              $('#datenow').hide();
              $('#updaterow').hide();
              $('#clear').hide();
              document.getElementById( 'datenow' ).value = null
              // broken
              document.getElementById( 'scaningbroken' ).readOnly =false
              document.getElementById( 'scaningbroken' ).style.display = 'none'
              document.getElementById( 'scaningbroken' ).value =""
              document.getElementById( 'scanhere2' ).style.display = 'block'
              document.getElementById( 'inputqty2' ).style.display = 'none'
              document.getElementById( 'inputqty2' ).value =""
              document.getElementById( 'select3' ).value =""
              $('#select3').hide();
              $('#datenow2').hide();
              $('#clear2').hide();
              $('#updaterow2').hide();
              document.getElementById( 'datenow2' ).value = null
              //transfer
              
              document.getElementById( 'scaningtransfer' ).readOnly =false
              document.getElementById( 'scaningtransfer' ).style.display = 'none'
              document.getElementById( 'scaningtransfer' ).value =""
              document.getElementById( 'scanhere3' ).style.display = 'block'
              document.getElementById( 'inputqty3' ).style.display = 'none'
              document.getElementById( 'inputqty3' ).value =""
              document.getElementById( 'select4' ).value =""
              $('#select4').hide();
              $('#select5').hide()
              $('#datenow3').hide();
              $('#clear3').hide();
              $('#updaterow3').hide();
              document.getElementById( 'datenow3' ).value = null
              Session.set('from',"")
              Session.set('to',"") 
        } 
    }
    else{
      toastr.warning('Please check your field qty & status!, its cannot null or 0!');
    }
  },
  'click .btnupdate': function (e, tpl) {
    e.preventDefault();
    console.log(Session.get('inputqty'),'+',Session.get('statusinout'))
    if(Session.get('inputqty') != 0 || Session.get('statusinout') != "" )
    {
        if (confirm('Do you want to update this row??')) {
          var id = Session.get('id')
          var expired = Session.get('chosse_expired_date') 
          var qty = Session.get('inputqty')
          var status = Session.get('statusinout')
          var wh = Session.get('whin')
          var from = Session.get('from')
          var to = Session.get('to')
          console.log('to',to)
          if(status === "innew" || status === "inreturn"){
            Meteor.call("manualstockin.update",id,expired,qty,status,wh,(error,result)=>{
              console.log(result)
              toastr.success('Succesfully to update stock out');
            })
          }
          else if(status === "transfer"){
            Meteor.call("manualstocktransfer.update",id,qty,status,from,to,(error,result)=>{
              console.log(result)
              toastr.success('Succesfully to update stock out');
            })
          }
          else{
            Meteor.call("manualstock.update",id,expired,qty,status,(error,result)=>{
              console.log('all',result)
              toastr.success('Succesfully to update stock out');
            })
          }

          // reset
            Session.set('isCheckProduct', true);
              Session.set('statusinout',"")
              Session.set('scan',true),
              Session.set('datashow','') 
              Session.set('label',"")
              Session.set('whin',"")
              Session.set('inputqty',0) 
              Session.set('from',"")
              Session.set('to',"") 
              // --in--
              Session.set('chosse_expired_date',null)
              Session.set('expired_date',null)
              document.getElementById( 'inscaning' ).readOnly =false
              document.getElementById( 'inscaning' ).style.display = 'none'
              document.getElementById( 'inscaning' ).value =""
              document.getElementById( 'scanherein' ).style.display = 'block'
              document.getElementById( 'inputqtyin' ).style.display = 'none'
              document.getElementById( 'inputqtyin' ).value =""
              document.getElementById( 'select2in' ).value =""
              $('#select2in').hide();
              $('#expiredin').hide();
              $('#datenowin').hide();
              $('#updaterowin').hide();
              $('#whin').hide();
              $('#clearin').hide();
              document.getElementById( 'datenowin' ).value = null
              // --out--
              Session.set('chosse_expired_date',null)
              Session.set('expired_date',null)
              document.getElementById( 'scaning' ).readOnly =false
              document.getElementById( 'scaning' ).style.display = 'none'
              document.getElementById( 'scaning' ).value =""
              document.getElementById( 'scanhere' ).style.display = 'block'
              document.getElementById( 'inputqty' ).style.display = 'none'
              document.getElementById( 'inputqty' ).value =""
              document.getElementById( 'select2' ).value =""
              $('#select2').hide();
              $('#expired').hide();
              $('#datenow').hide();
              $('#updaterow').hide();
              $('#clear').hide();
              document.getElementById( 'datenow' ).value = null
              // broken
              document.getElementById( 'scaningbroken' ).readOnly =false
              document.getElementById( 'scaningbroken' ).style.display = 'none'
              document.getElementById( 'scaningbroken' ).value =""
              document.getElementById( 'scanhere2' ).style.display = 'block'
              document.getElementById( 'inputqty2' ).style.display = 'none'
              document.getElementById( 'inputqty2' ).value =""
              document.getElementById( 'select3' ).value =""
              $('#select3').hide();
              $('#datenow2').hide();
              $('#clear2').hide();
              $('#updaterow2').hide();
              document.getElementById( 'datenow2' ).value = null
              //transfer
              document.getElementById( 'scaningtransfer' ).readOnly =false
              document.getElementById( 'scaningtransfer' ).style.display = 'none'
              document.getElementById( 'scaningtransfer' ).value =""
              document.getElementById( 'scanhere3' ).style.display = 'block'
              document.getElementById( 'inputqty3' ).style.display = 'none'
              document.getElementById( 'inputqty3' ).value =""
              document.getElementById( 'select4' ).value =""
              $('#select4').hide();
              $('#select5').hide()
              $('#datenow3').hide();
              $('#clear3').hide();
              $('#updaterow3').hide();
              document.getElementById( 'datenow3' ).value = null
        } 
    }
    else{
      toastr.warning('Please check your field qty & status!, its cannot null or 0!');
    }
  },
  'click .btnDeletes': function (e, tpl) {
    e.preventDefault();
    var id = Session.get('id');
    console.log('id',Session.get('id'))
    if (confirm('Do you want to delete this row??')) {
      Meteor.call("manualstock.delete",id,function (error,res) {
        if (res) {
          toastr.success('Delete is Succsessfully');

              Session.set('isCheckProduct', true);
              Session.set('statusinout',"")
              Session.set('scan',true),
              Session.set('datashow','') 
              Session.set('label',"")
              Session.set('inputqty',0) 
              Session.set('wh',"") 
              Session.set('from',"") 
              Session.set('to',"") 
              // --in--
              
              Session.set('chosse_expired_date',null)
              Session.set('expired_date',null)
              document.getElementById( 'incaning' ).readOnly =false
              document.getElementById( 'inscaning' ).style.display = 'none'
              document.getElementById( 'inscaning' ).value =""
              document.getElementById( 'inscanhere' ).style.display = 'block'
              document.getElementById( 'inputqtyin' ).style.display = 'none'
              document.getElementById( 'inputqtyin' ).value =""
              document.getElementById( 'select2in' ).value =""
              $('#select2in').hide();
              $('#expiredin').hide();
              $('#datenowin').hide();
              $('#updaterowin').hide();
              $('#whin').hide();
              $('#clearin').hide();
              document.getElementById( 'datenowin' ).value = null
              // --out--
              // --out--
              Session.set('chosse_expired_date',null)
              Session.set('expired_date',null)
              document.getElementById( 'scaning' ).readOnly =false
              document.getElementById( 'scaning' ).style.display = 'none'
              document.getElementById( 'scaning' ).value =""
              document.getElementById( 'scanhere' ).style.display = 'block'
              document.getElementById( 'inputqty' ).style.display = 'none'
              document.getElementById( 'inputqty' ).value =""
              document.getElementById( 'select2' ).value =""
              $('#select2').hide();
              $('#expired').hide();
              $('#datenow').hide();
              $('#updaterow').hide();
              $('#clear').hide();
              document.getElementById( 'datenow' ).value = null
              // broken
              document.getElementById( 'scaningbroken' ).readOnly =false
              document.getElementById( 'scaningbroken' ).style.display = 'none'
              document.getElementById( 'scaningbroken' ).value =""
              document.getElementById( 'scanhere2' ).style.display = 'block'
              document.getElementById( 'inputqty2' ).style.display = 'none'
              document.getElementById( 'inputqty2' ).value =""
              document.getElementById( 'select3' ).value =""
              $('#select3').hide();
              $('#datenow2').hide();
              $('#clear2').hide();
              $('#updaterow2').hide();
              document.getElementById( 'datenow2' ).value = null
              //transfer
              
              document.getElementById( 'scaningtransfer' ).readOnly =false
              document.getElementById( 'scaningtransfer' ).style.display = 'none'
              document.getElementById( 'scaningtransfer' ).value =""
              document.getElementById( 'scanhere3' ).style.display = 'block'
              document.getElementById( 'inputqty3' ).style.display = 'none'
              document.getElementById( 'inputqty3' ).value =""
              document.getElementById( 'select4' ).value =""
              $('#select4').hide();
              $('#select5').hide()
              $('#datenow3').hide();
              $('#clear3').hide();
              $('#updaterow3').hide();
              document.getElementById( 'datenow3' ).value = null
          // $('#clear').closest("tr").remove();
          // console.log('success update accept list')
        } else {
          toastr.success('Delete is Failed');
          // console.log('Fail to update accept list')
        }
      });
    }

  },
  'click .btnSubmit': function (e, tpl) {
    e.preventDefault();
    if (confirm('Do you want to Saving Movement Product on this row??')) {
      
      Meteor.call("stock.submit-update",(error,result)=>{
        console.log(result)
        toastr.success('Succesfully to update stock out');
      })
    }
  },
  'click .btnSubmit3': function (e, tpl) {
    e.preventDefault();
    if (confirm('Do you want to Saving Movement Product on this row??')) {
      
      Meteor.call("stocktransfer.submit-update",(error,result)=>{
        console.log(result)
        toastr.success('Succesfully to update stock out');
      })
    }
  },
  'click .btnSubmit2': function (e, tpl) {
    e.preventDefault();
    if (confirm('Do you want to Saving Movement Product on this row??')) {
      
      Meteor.call("stockbroken.submit-update",(error,result)=>{
        console.log(result)
        toastr.success('Succesfully to update stock out');
      })
    }
  },
  'click .btnSubmit4': function (e, tpl) {
    e.preventDefault();
    if (confirm('Do you want to Saving Movement Product on this row??')) {
      
      Meteor.call("stockin.submit-update",(error,result)=>{
        console.log(result)
        toastr.success('Succesfully to update stock out');
      })
    }
  },
  'change #warehousein':function(e){
    var chose = String(e.target.value)
    console.log('wh',chose)
    Session.set('whin',chose)
  },
  'change #warehousefrom':function(e){
    var chose = String(e.target.value)
    console.log('whtffrom',chose)
    Session.set('from',chose)
  },
  'change #warehouseto':function(e){
    var chose = String(e.target.value)
    console.log('whtfto',chose)
    Session.set('to',chose)
  },
  'change #expiredselect':function(e){
    var chose = String(e.target.value)
    console.log('exp',new Date(chose))
    Session.set('chosse_expired_date',new Date(chose))
  },

  'change #expiredselectin':function(e){
    var chose = String(e.target.value)
    console.log('exp',new Date(chose))
    Session.set('chosse_expired_date',new Date(chose))
  },
  'change #datefrom':function(e,template){
    console.log( $('#datefrom').val())
    df = new Date($('#datefrom').val())
    // template.filter2.set("");
    // $('#searchstatus').val("")
    // Meteor.call("getgroupmouvment",df.toISOString().slice(0,10),dt.toISOString().slice(0,10),null,(err,res)=>{
    //     console.log('res',res)
    //     data21 = res
    //   // template.filter2.set("");
    //   })
  },
  'change #dateto':function(e,template){
    console.log( $('#dateto').val())
    dt = new Date($('#dateto').val())
    // template.filter2.set("");
    // $('#searchstatus').val("")
    // Meteor.call("getgroupmouvment",df.toISOString().slice(0,10),dt.toISOString().slice(0,10),null,(err,res)=>{
    //   console.log('res',res)
    //   data21 = res
    // // template.filter2.set("");
    // })
    
  },
  'change #searchstatus':function(e,template){
    var input = $(e.target).val()
    var ins = input.substring(10,36)
    bd = new Mongo.ObjectID(ins.slice(0,-2))
    // if (bd) {
    //   // Meteor.call("getgroupmouvment",df.toISOString().slice(0,10),dt.toISOString().slice(0,10),bd,(err,res)=>{
    //   //   console.log('res',res)
    //   //   data21 = res
    //     template.filter2.set(bd);
    //   // })
    // } else {
    //     template.filter2.set("");
    //   // })
    // }
  },
  'change #searchsku':function(e,template){

    console.log(String(e.target.value))
    var test = String(e.target.value)
    if (test) {
      template.filter1.set(test);
    } else {
      template.filter1.set("");
    }
  },
  'click .btnFilter': function (e, tpl) {
     if (df > dt){
      toastr.error('Error', ' The Date From cannot be greater than The Date To ! ')
    }
    else if(bd){
      console.log('brand',bd)
      tpl.filter2.set({$eq:bd});
    }
    else {
      tpl.filter2.set("");
      // toastr.error('Error', ' Please choose field filter brand ! ')
    }

  }
  ,
  'click .btnprint': function (e, tpl) {
    e.preventDefault();
    var sd = df ? df.toISOString().slice(0,10) : new Date().toISOString().slice(0,10);
    var ed = df ? df.toISOString().slice(0,10) : new Date().toISOString().slice(0,10);
    var brand = bd ? bd: null;
    var shipper = Session.get('shipper');
    console.log(sd);
    console.log(ed)
    var divToPrint=document.getElementById('print');

    var newWin=window.open('','Print-Window');
  
    newWin.document.open();
  
    newWin.document.write('<html><body onload="window.print()">'+divToPrint.innerHTML+'</body></html>');
  
    newWin.document.close();
  
    setTimeout(function(){newWin.close();},10);
    // if(shipper){
      // FlowRouter.go('/stock_out/printsumarry/' + sd +'/'+ ed +'/'+ brand );
    // }
    // else if(!shipper || !sd){
    //   toastr.error('Error', ' Please choose field start date or shipper! ')
    // }
  },
  'click .btnExport'(e, tpl) {
    // $(e.currentTarget).prop('disabled', true);
    var sd = df.toISOString().slice(0,10)
    var ed = dt.toISOString().slice(0,10)
    console.log('sd',sd )
    console.log('ed',ed)
    console.log('new',moment(new Date()).format('yyyyMMD'))
    
            console.log('data21',data21)
            let data = data21
            var ansR = JSON.stringify(data);
                  console.log(ansR);
            var csv = Papa.unparse(ansR);
            console.log('cs',csv);

            var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            var csvURL = null;0
            if (navigator.msSaveBlob) {
        
                csvURL = navigator.msSaveBlob(csvData, 'download.csv');
              }
              else {
                csvURL = window.URL.createObjectURL(csvData);
              }
              // var dateNow = new Date()
              var tempLink = document.createElement('a');
              tempLink.href = csvURL;
              tempLink.setAttribute('download', 'Report Out Summary '+ moment(new Date(sd)).format('yyyyMMD')+ '-'+ moment(new Date(ed)).format('yyyyMMD')+'.csv');
              tempLink.click();
              toastr.success('Export Sucess');
              $(e.currentTarget).prop('disabled', false);
              Session.set('isDownloading', false);  
            console.log(data)
  },
})


Template.stock_out3.helpers({
  startdate:function(){
    return new Date().toISOString().slice(0,10)
  },
  enddate:function(){
    return new Date().toISOString().slice(0,10)
  },
  isSubscriptionR: function () {
    var subs = Template.instance().isSubs.get()
    console.log('subs ready:' + subs);
    return subs;
  },
  report:function(){
      return {
        collection: 'Product',
        rowsPerPage: 50,
        showFilter: false,  
        fields: [
          { key: 'reactive-table-sort', label: 'No',sortOrder:0,sortDirection: 'descending',
            fn: function (datas) {

              data21 = []
              return datas+1
              
          } },
          { key: 'product_sku', label: 'SKU',cellClass: 'text-success col-xs-1',sortOrder:0,sortDirection: 'descending', },
          { key: 'product_name', label: 'Label',cellClass:"col-xs-3" },
          { key: 'brand_id', label: 'Brand',cellClass:"col-xs-1",fn: function (datas,template) {
              var data = ReactiveMethod.call('brands.list.all', datas);
              return data.brand_name              
            }
          },
          {
            key: 'product_sku', label: 'Ballance',fn: function (datas,template) {
              
              var data = ReactiveMethod.call('getballancemovement', df.toISOString().slice(0,10),dt.toISOString().slice(0,10),bd,template.product_sku);
              var data2 = ReactiveMethod.call('getgroupmouvment', df.toISOString().slice(0,10),dt.toISOString().slice(0,10),bd,template.product_sku);
                  // console.log('template.stock',data2)
                  if(!data2 || data2.length === 0 ){
                    data21.push({
                      sku :template.product_sku,
                      label :template.product_name,
                      ballance :0,
                      in :0,
                      out :0,
                      stock :data.stock,
                    })
                    // console.log('data21',data21)
                    // return 0
                  }
                  else{ 
                    data21.push({
                      sku :template.product_sku,
                      label :template.product_name,
                      ballance :data.stock,
                      in :data2[0].in,
                      out :data2[0].out,
                      stock :data.stock,
                    })
                  }
              return  data.stock
              
                  
              
            }
          },
          {
            key: 'product_sku', label: 'IN',fn: function (datas,template) {
              // console.log('datas',template.ref)
              var data = ReactiveMethod.call('getgroupmouvment', df.toISOString().slice(0,10),dt.toISOString().slice(0,10),bd,template.product_sku);
              if(!data || data.length === 0){
                return 0
              }
              else{  
                // console.log('this',data[0].in)
                // if(data[0]._id === datas )
                return data[0].in 
              }
            }
          },
          {
            key: 'product_sku', label: 'OUT',fn: function (datas,template) {
              // console.log('datas',template.ref)
              var data = ReactiveMethod.call('getgroupmouvment', df.toISOString().slice(0,10),dt.toISOString().slice(0,10),bd,template.product_sku);
              if(!data || data.length === 0){
                return 0
              }
              else{  
                // console.log('this',data[0].out)
                // if(data[0]._id === datas )
                return data[0].out 
              }
            }
          },
          { key: '_id', label: 'Current Stock',cellClass:"col-xs-1",fn: function (datas,template) {
            // console.log('datas',template.ref)
            var data = ReactiveMethod.call('getstock',datas);
            if(!data || data.length === 0){
              return 0
            }
            else{  
              // console.log('this',data[0].out)
              // if(data[0]._id === datas )
              return data.stock
            }
          } },
          
        ],
        filters: ['myFilterBrand','searchstatus','searchsku'],
        ready: Template.instance().isSubs,
        
      };
  },
  settingin:function(){
    return {
      collection: 'stockin',
      rowsPerPage: 50,
      showFilter: false,  
      fields: [
        // { key: 'order_id', label: 'Order ID' },
        { key: 'product_sku', label: 'Barcode',cellClass: 'text-success mr-1 col-md-2' },
        { key: 'product_name', label: 'Label Product',cellClass:"col-md-2" },
        { key: 'qty', label: 'Qty',cellClass:"col-md-1" },
        { key: 'category', label: 'Status',cellClass:"col-md-1",fn:function (data) {
            if(data === 'innew'){
              return 'In - New'
            }
            else{
              return 'In - Return'
            }
          },
        },
        { key: 'expiredAt', label: 'Expired',cellClass:"col-md-2",fn: function (date) {
          if(date){
            return moment(new Date(date)).format('MMMM Do YYYY, hh:mm:ss')  
            }
          else{
            return null
          }
          }
        },
        { key: 'warehouseid', label: 'Warehouse',cellClass:"col-md-2",fn: function (data) {
          if(data){
            var datas = ReactiveMethod.call('warehouse.detail',data);
            return datas.warehouseName
            }
          else{
            return null
          }
          }
        },
        { key: 'createdAt', sortOrder: 0,sortDirection: 'descending',label: 'Time Stamp',fn: function (date) {
            return moment(new Date(date)).format('MMMM Do YYYY, hh:mm:ss')
          } },
        { key: 'item_sku',label: 'Action',tmpl: Template.editin, sortable: false,
        },
      ],
      // filters: ['myFilterBrand','searchtrack','searchinv','searchmp','searchshipper','searchstatus','searchby'],
      ready: Template.instance().isSubs,
      
    };
},
  settingout:function(){
    return {
      collection: 'stockout',
      rowsPerPage: 50,
      showFilter: false,  
      fields: [
        // { key: 'order_id', label: 'Order ID' },
        { key: 'product_sku', label: 'Barcode',cellClass: 'text-success mr-1 col-lg-2' },
        { key: 'product_name', label: 'Label Product',cellClass:"col-lg-3" },
        { key: 'qty', label: 'Qty',cellClass:"col-lg-1" },
        { key: 'category', label: 'Status',cellClass:"col-lg-1",fn:function (data) {
            if(data === 'outwithdrawal'){
              return 'Out - Withdrawal'
            }
            else if(data === 'outincomplete'){
              return 'Out - Incomplete'
            }
            else if(data === 'outsample'){
              return 'Out - Sample'
            }
            else if(data === 'outclaim'){
              return 'Out - Claim Garansi'
            }
            else if(data === 'outkol'){
              return 'Out - Kol'
            }
          },
        },
        { key: 'expiredAt', label: 'Expired',cellClass:"col-lg-2",fn: function (date) {
          if(date){
            return moment(new Date(date)).format('MMMM Do YYYY, hh:mm:ss')  
            }
          else{
            return null
          }
          }
        },
        { key: 'createdAt', sortOrder: 0,sortDirection: 'descending',label: 'Time Stamp',fn: function (date) {
            return moment(new Date(date)).format('MMMM Do YYYY, hh:mm:ss')
          } },
        { key: 'checkboxstatus',label: 'Action',tmpl: Template.editout, sortable: false,
        },
      ],
      filters: ['myFilterBrand','searchtrack','searchinv','searchmp','searchshipper','searchstatus','searchby'],
      ready: Template.instance().isSubs,
      
    };
},
  settingbroken:function(){
    return {
      collection: 'stockbroken',
      rowsPerPage: 50,
      showFilter: false,  
      fields: [
        // { key: 'order_id', label: 'Order ID' },
        { key: 'product_sku', label: 'Barcode',cellClass: 'text-success mr-1 col-lg-2' },
        { key: 'product_name', label: 'Label Product',cellClass:"col-lg-3"  },
        { key: 'qty', label: 'Qty',cellClass:"col-lg-1" },
        { key: 'category', label: 'Status',cellClass:"col-md-1",fn:function (data) {
            if(data === 'outbroken'){
              return 'Out - Broken'
            }
            else{
              return 'Out - Broken - Package'
            }
          },
        },
        { key: 'createdAt', sortOrder: 0,sortDirection: 'descending',label: 'Time Stamp',fn: function (date) {
            return moment(new Date(date)).format('MMMM Do YYYY, hh:mm:ss')
          } },
        { label: 'Action',tmpl: Template.editbroken, sortable: false,
        },
      ],
      // filters: ['myFilterBrand','searchtrack','searchinv','searchmp','searchshipper','searchstatus','searchby'],
      ready: Template.instance().isSubs,
      
    };
  },
  settingtransfer:function(){
    return {
      collection: 'stocktransfer',
      rowsPerPage: 50,
      showFilter: false,  
      fields: [
        // { key: 'order_id', label: 'Order ID' },
        { key: 'product_sku', label: 'Barcode',cellClass: 'text-success mr-1 col-lg-2' },
        { key: 'product_name', label: 'Label Product',cellClass:"col-lg-3"  },
        { key: 'qty', label: 'Qty',cellClass:"col-lg-1" },
        { key: 'warehouseidFrom', label: 'From',cellClass:"col-md-1",fn: function (data) {
          var  data = Warehouse.findOne({'_id':data})
          return data.warehouseName
        } },
        { key: 'warehouseidTo', label: 'To',cellClass:"col-md-1",fn: function (data) {
          var  data = Warehouse.findOne({'_id':data})
          return data.warehouseName
        }
        },
        { key: 'createdAt', sortOrder: 0,sortDirection: 'descending',label: 'Time Stamp',fn: function (date) {
            return moment(new Date(date)).format('MMMM Do YYYY, hh:mm:ss')
          } },
        { label: 'Action',tmpl: Template.edittransfer, sortable: false,
        },
      ],
      // filters: ['myFilterBrand','searchtrack','searchinv','searchmp','searchshipper','searchstatus','searchby'],
      ready: Template.instance().isSubs,
      
    };
  },
  label:function(){
    var data = Session.get('label')
    return data
  },
  scan:function(){
    return Session.get('scan')
  },
  allbrand:function(){
          var data = []
          data = ReactiveMethod.call('getbrand');
          return data
  },
  selectBrand: function(optionText){
    if(optionText._str === Session.get('brandedit')._str){
      return 'selected'
    }
  },
  plus2(index) {
    return index + 2;
  },
  countin() {
    var date = new Date().toISOString().slice(0,10)
    console.log('date',new Date(date+"T00:00:00"))
    var date2 = new Date(date+"T07:00:00")
    // 
    var datain = manualstock.find({$or: [{ category: 'innew' }, { category: 'inreturn' }],createdAt:{$gte:date2} }).count()
    console.log('data in',datain)
    return datain
  },
  countout() {
    var date = new Date().toISOString().slice(0,10)
    console.log('date',new Date(date+"T00:00:00"))
    var date2 = new Date(date+"T07:00:00")
    // 
    return  manualstock.find({ finalstatus: { $eq: true }, $or: [{ category: 'outkol' }, { category: 'outwithdrawal' }, { category: 'outincomplete' }],createdAt:{$gte:date2} }).count()
  },
  countbroken() {
    var date = new Date().toISOString().slice(0,10)
    console.log('date',new Date(date+"T00:00:00"))
    var date2 = new Date(date+"T07:00:00")
    // 
    return manualstock.find({ finalstatus: { $eq: true }, $or: [{ category: 'outbroken' }, { category: 'outbrokenpackage' }],createdAt:{$gte:date2} }).count()
  },

  counttransfer() {
    var date = new Date().toISOString().slice(0,10)
    console.log('date',new Date(date+"T00:00:00"))
    var date2 = new Date(date+"T07:00:00")
    // 
    return manualstock.find({ finalstatus: { $eq: true }, category: 'transfer',createdAt:{$gte:date2}  }).count()
  },

  warehouse() {
    var wh = Warehouse.find().fetch()
    console.log('warehouse',wh)
    return wh
  },
  getexpired(){
    if(Session.get('scan') === true)
    {
      return Session.get('expired_date')
    }
  },
  selectCategory: function(optionText){
    if(optionText === Session.get('statusinout')){
      return 'selected'
    }
  },
  selectExpired: function(optionText){
      var cuureent = moment(new Date(Session.get('chosse_expired_date'))).format('MMMM Do YYYY, hh:mm:ss')
      var option = moment(new Date(optionText)).format('MMMM Do YYYY, hh:mm:ss')
    if(option === cuureent){
      return 'selected'
    }
  },

  selectWarehousein: function(optionText){
    if(optionText === Session.get('whin')){
      return 'selected'
    }
  },
  selectWarehousefrom: function(optionText){
    if(optionText === Session.get('from')){
      return 'selected'
    }
  },
  selectWarehouseto: function(optionText){
    if(optionText === Session.get('to')){
      return 'selected'
    }
  }

});
  
Template.editin.events({
  'click .btnEdit1': function (e, tpl) {
    console.log('sku','test')
    Session.set('scan',true);
    Session.set('id',this._id);
    console.log('sku',this.product_sku)
    document.getElementById( 'scanherein' ).style.display = 'none'
    document.getElementById( 'inscaning' ).style.display = 'block'
    document.getElementById( 'inscaning' ).readOnly =true
    document.getElementById('inscaning').value = this.product_sku;
    Session.set('label',this.product_name)
    Session.set('inputqty',this.qty)
    Session.set('whin',this.warehouseid)
    document.getElementById( 'inputqtyin' ).style.display = 'block';
    document.getElementById( 'inputqtyin' ).value = this.qty
    $('#select2in').show();
    document.getElementById( 'expiredselectin' ).style.display = 'block';
    document.getElementById( 'datenowin' ).style.display = 'block';
    document.getElementById( 'datenowin' ).value = this.createdAt.toJSON().slice(0,19)
    $('#saverowin').hide();
    $('#clearin').show();
    $('#updaterowin').show();
    $('#whin').show();
    if(this.expiredAt != null){

      // Session.set('expired_date',new Date(this.expiredAt))
                $('#expiredselectin').val(new Date(this.expiredAt).toJSON().slice(0,19));
      Session.set('chosse_expired_date',new Date(this.expiredAt))
    }
    Session.set('statusinout',this.category)
    // $('#scaned1').val(this.item_sku);

    // Session.set('barcode',this.item_sku)
    // console.log($('#scaned1').val() )


  },
  'click .btnDelete': function (e, tpl) {
    e.preventDefault();
    var id = this._id;
    if (confirm('Do you want to delete this row??')) {
      Meteor.call("manualstock.delete",id,function (error,res) {
        if (res) {
          toastr.success('Delete is Succsessfully');
          // console.log('success update accept list')
        } else {
          toastr.success('Delete is Failed');
          // console.log('Fail to update accept list')
        }
    });
    }

  },
})

Template.editout.events({
  'click .btnEdit': function (e, tpl) {
      e.preventDefault();
      Session.set('scan',true);
      Session.set('id',this._id);
      console.log('sku',this.product_sku)
      document.getElementById( 'scanhere' ).style.display = 'none'
      document.getElementById( 'scaning' ).style.display = 'block'
      document.getElementById( 'scaning' ).readOnly =true
      document.getElementById('scaning').value = this.product_sku;
      Session.set('label',this.product_name)
      Session.set('inputqty',this.qty)
      document.getElementById( 'inputqty' ).style.display = 'block';
      document.getElementById( 'inputqty' ).value = this.qty
      $('#select2').show();
      document.getElementById( 'expired' ).style.display = 'block';
      // document.getElementById( 'expired' ).value = this.expired != null ? this.expired.toJSON().slice(0,19): null,
      document.getElementById( 'datenow' ).style.display = 'block';
      // console.log(this.createdAt.toJSON().slice(0,19))
      document.getElementById( 'datenow' ).value = this.createdAt.toJSON().slice(0,19)
      $('#saverow').hide();
      $('#clear').show();
      $('#updaterow').show();
      Meteor.call('getmovementbysku',this.product_sku,(error2, result2) => {
        console.log('sku',result2)
        data = result2.expiredAt
        Session.set('expired_date',result2)
      })
      Session.set('chosse_expired_date',new Date(this.expiredDate))
      Session.set('statusinout',this.category)
      // $('#scaned1').val(this.item_sku);

      // Session.set('barcode',this.item_sku)
      // console.log($('#scaned1').val() )

  },
  'click .btnDelete': function (e, tpl) {
    e.preventDefault();
    var id = this._id;
    console.log('id',id)
    if (confirm('Do you want to delete this row??')) {
      Meteor.call("manualstock.delete",id,function (error,res) {
        if (res) {
          toastr.success('Delete is Succsessfully');
          // console.log('success update accept list')
        } else {
          toastr.success('Delete is Failed');
          // console.log('Fail to update accept list')
        }
      });
    }

  }
})


Template.editbroken.events({
  'click .btnEdit2': function (e, tpl) {
      e.preventDefault();
      Session.set('scan',true);
      Session.set('id',this._id);
      console.log('sku',this.product_sku)
      document.getElementById( 'scanhere2' ).style.display = 'none'
      document.getElementById( 'scaningbroken' ).style.display = 'block'
      document.getElementById( 'scaningbroken' ).readOnly =true
      document.getElementById('scaningbroken').value = this.product_sku;
      Session.set('label',this.product_name)
      document.getElementById( 'inputqty2' ).style.display = 'block';
      document.getElementById( 'inputqty2' ).value = this.qty
      Session.set('inputqty',this.qty)
      Session.set('statusinout',this.category)
      $('#select3').show();
      document.getElementById( 'datenow2' ).style.display = 'block';
      // console.log(this.createdAt.toJSON().slice(0,19))
      document.getElementById( 'datenow2' ).value = this.createdAt.toJSON().slice(0,19)
      $('#saverow2').hide();
      $('#updaterow2').show();
      $('#clear2').show();
      // $('#scaned1').val(this.item_sku);

      // Session.set('barcode',this.item_sku)
      // console.log($('#scaned1').val() )

  },
  'click .btnDelete': function (e, tpl) {
    e.preventDefault();
    var id = this._id;
    if (confirm('Do you want to delete this row??')) {
      Meteor.call("manualstock.delete",id,function (error,res) {
        if (res) {
          toastr.success('Delete is Succsessfully');
          // console.log('success update accept list')
        } else {
          toastr.success('Delete is Failed');
          // console.log('Fail to update accept list')
        }
    });
    }

  },
})

Template.edittransfer.events({
  'click .btnEdit3': function (e, tpl) {
      e.preventDefault();
      Session.set('scan',true);
      Session.set('id',this._id);
      console.log('sku',this.product_sku)
      document.getElementById( 'scanhere3' ).style.display = 'none'
      document.getElementById( 'scaningtransfer' ).style.display = 'block'
      document.getElementById( 'scaningtransfer' ).readOnly =true
      document.getElementById('scaningtransfer').value = this.product_sku;
      Session.set('label',this.product_name)
      document.getElementById( 'inputqty3' ).style.display = 'block';
      document.getElementById( 'inputqty3' ).value = this.qty
      Session.set('inputqty',this.qty)
      Session.set('statusinout',this.category)
      Session.set('from',this.warehouseidFrom)
      Session.set('to',this.warehouseidTo)
      $('#select4').show();
      $('#select5').show();
      document.getElementById( 'datenow3' ).style.display = 'block';
      // console.log(this.createdAt.toJSON().slice(0,19))
      document.getElementById( 'datenow3' ).value = this.createdAt.toJSON().slice(0,19)
      $('#saverow3').hide();
      $('#updaterow3').show();
      $('#clear3').show();
      // $('#scaned1').val(this.item_sku);

      // Session.set('barcode',this.item_sku)
      // console.log($('#scaned1').val() )

  },
  'click .btnDelete': function (e, tpl) {
    e.preventDefault();
    var id = this._id;
    if (confirm('Do you want to delete this row??')) {
      Meteor.call("manualstock.delete",id,function (error,res) {
        if (res) {
          toastr.success('Delete is Succsessfully');
          // console.log('success update accept list')
        } else {
          toastr.success('Delete is Failed');
          // console.log('Fail to update accept list')
        }
    });
    }

  },
})
// Template.inreport.helpers({
//   showbtn: function () {
//     var checking = Template.instance().data
//     if(checking.brand === bd){
//       for(let data of data21){
//         console.log('id',typeof(data._id),'ref',typeof(checking.ref))
//         $('#in'+data._id).val(data.in )
//         // return (data._id == checking.ref ? data.in : 0);
//       }
//     }  
//   },
// })

// Template.ballancereport.helpers({
//   showbtn: function () {
//     // console.log('this ref',this.ref)
//     var checking = Template.instance().data
//     if(checking.brand === bd){
//       for(let data of data21){
//         $('#ballance'+data._id).val(checking.stock + (data.in - data.out))
//         // return (data._id == checking.ref ? checking.stock + (data.in - data.out) : 0);
//       }
//     }  
//   },
// })


// Template.outreport.helpers({
//   showbtn: function () {
//     var checking = Template.instance().data
//     if(checking.brand === bd){
//       for(let data of data21){
//           $('#out'+data._id).val(data.out)
        
//         // return (data._id == checking.ref ? data.out : 0);
//       }
//     }  
//   },
// })
