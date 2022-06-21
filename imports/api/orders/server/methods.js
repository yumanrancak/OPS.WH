// Methods related to links

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
// import { check } from 'meteor/check';
import { TokopediaOrders, ShopeeOrderDetail, TokpedOrderDetail, ShopeeOrders, BukalapakOrders, LazadaOrders, JdidOrders, ZaloraOrders, BlibliOrders, ProductOrders, MovementProduct, OrderErrorLogs, allOrder, stockout, loghistory } from '../orders';
import { InternalStatus } from '../../internalStatus/internalStatus';
import { ShopMp } from '../../marketplace/marketplace';
import moment from 'moment';
import { Roles } from 'meteor/alanning:roles';
import { batchList, batchListDetail } from '../../picklist/picklist';
import { parseInt, sum } from 'lodash';
import { data } from 'jquery';
import { logdailystock, Product, ProductStock, product_bundle } from '../../product/product';
import { Brand } from '../../brand/brand';
// import { ExternalStore } from '../../externalStore/externalStore';
// import { result } from 'lodash';


Meteor.methods({
  'checkToken'(email, password) {
    console.log('check api login');
    var ctk = HTTP.call('GET', 'https://erp.egogohub.com/api/index.php/login?login=' + email + '&password=' + password + '&reset=0', {}, (err, res) => {
      // setTimeout(function () {
      if (err) {
        console.log('timeout', err)
        return err;
      } else {
        var resdata = res.data;
        console.log('login: ', resdata)
        const ownerId = Accounts.createUser({
          username: email,
          password: password
        });
        return resdata;
      }
      // }, 3000)
    });
    // console.log('ctk', ctk);

    // var role = result.data.success
    // var roledata = role.nom
    // var roleexist = Roles.findOne({ '_id': roledata }).count();
    // var roleexist = Meteor.roleAssignment.find({ 'role._id': roledata }).count()
    // var roleexist = Meteor.role.find({ '_id': roledata }).count()
    // console.log('roleexist:' + roleexist);
    // if (roleexist == 0) {
    //   Roles.createRole(roledata);
    // }
    // return result;
  },

  'getmovement'(sds,eds,bd){
    var sd = new Date(sds+"T07:00:00")
    var ed = new Date(eds+"T23:59:59")
    console.log('sd',ed)
    if(bd === null){
        var movement = MovementProduct.find({ createdAt: {'$gte': sd,'$lte':ed}}, {}).fetch()
        console.log('m',movement)
        return movement
    }
    else{
      var movement = MovementProduct.find({ createdAt: {'$gte': sd,'$lte':ed},brandId:bd}, {}).fetch()
        console.log('m',movement)
        return movement
    }
    // return new Promise((resolve,reject) =>
    // {  
    //   HTTP.call('GET', 'https://api-product.egogohub.tech/test/get-product?offset=0&limit=100', {
    //   }, (error, result) => {
    //     console.log( result)
    //     if (error) {
    //     console.log(error)
    //     // return reject(fail)
    //   }
    //   else {
    //       console.log('resp', result.data)
    //       return resolve(result.data.data)
    //     }
    //   });
    // })
  },
  'datastore_id'(storeid) {
    var store = ShopMp.findOne({ shopid: storeid}, {})
    // console.log('store',store)
    return store
  },
  'storeget'() {
    var store = ShopMp.find({}, {}).fetch()
    // console.log('store',store)
    return store
  },
  'showcancel'(id) {
    var batch = allOrder.findOne({ _id: id, cancelManual: true}, {})
    // console.log('batch',batch)
    return batch
  },
  'showcompleted'(id) {
    var batch = allOrder.findOne({ _id: id, internal_status: "COMPLETED"}, {})
    // console.log('batch',batch)
    return batch
  },
  'orderreview.reset'(id){
    console.log('id',id)
    var data = allOrder.findOne({ '_id': id });
    if(data){
      console.log('data',data)
      var history = loghistory.insert({
        transactionid:id._str,
        order_id:data.order_id,
        invoice_no:data.invoice_no,
        status:"reset status fulfilment",
        comment:"log review order",
        type:"reset",
        usedBy:Meteor.userId(),
        createdAt:new Date(),
      })
      console.log('create log',history)
      var order = allOrder.update(
        {'_id': id},
        {
          $set:
              {
                validasi1status:false,
                completedStatus:false,
                validasi2status:false,
                cancelManual:false,
                checkboxstatus:false,
                pickliststatus:false,
                batchid:null,
                resetstatus:true,
                resetAt:new Date(),
                resetBy:Meteor.userId(),
              }
        }
      );
      return order
    }

  },
  'orderreview.cancel'(id,data) {
    // console.log('test' , data ); 
    var id = data._id 
    // var data = allOrder.findOne({ '_id': id });
    //scan1
    if(data.validasi1status === true && data.pickliststatus !== true ){
        var history = loghistory.insert({
          transactionid:id,
          order_id:data.order_id,
          invoice_no:data.invoice_no,
          status:"scan1",
          comment:"log cancel order",
          type:"cancel",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        })
        console.log('create log',history)
        var order = allOrder.update(
          {'_id': id},
          {
            $set:
                {
                  validasi1status:'cancel',
                  completedStatus:'cancel',
                  validasi2status:'cancel',
                  checkboxstatus:false,
                  pickliststatus:false,
                  batchid:null,
                  cancelManual:true,
                  canceledAt:new Date(),
                  canceledBy:Meteor.userId(),
                }
          }
        );
        console.log('orderall' ,order );
        return order
    }
    //picklist
    if(data.pickliststatus === true  && data.validasi2status !== true ){
      console.log('picklist' , data );
          
        var history = loghistory.insert({
          transactionid:id,
          order_id:data.order_id,
          invoice_no:data.invoice_no,
          status:"picklist",
          comment:"log cancel order",
          type:"cancel",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        })
        console.log('create log',history)
        var order = allOrder.update(
          {'_id': id},
          {
            $set:
                {
                  // validasi1status:'cancel',
                  completedStatus:false,
                  validasi2status:false,
                  checkboxstatus:false,
                  pickliststatus:false,
                  batchid:null,
                  cancelManual:true,
                  canceledAt:new Date(),
                  canceledBy:Meteor.userId(),
                }
          }
        );
        console.log('orderall' ,order );
        var check = batchListDetail.find({ orderid: data.order_id }, {}).fetch()
        if (check.length > 0) {
          console.log('check', check)
          batchListDetail.remove({ orderid: data.order_id })
          var checkbatch = batchListDetail.find({ batchid: data.batchid }, {}).count()
            if (checkbatch === 0) {
              console.log('batch', data.batchid)
              batchList.remove({ _id: data.batchid })
            }
      }
      return order
    }
    // scan2 
    else if(data.validasi2status === true  ){
      console.log('scan2' , data );
        var history = loghistory.insert({
          transactionid:id,
          order_id:data.order_id,
          invoice_no:data.invoice_no,
          status:"scan2",
          comment:"log cancel order",
          type:"cancel",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        })
        console.log('create log',history)
        var order = allOrder.update(
          {'_id': id},
          {
            $set:
                {
                  validasi1status:false,
                  completedStatus:false,
                  validasi2status:false,
                  checkboxstatus:false,
                  batchid:null,
                  pickliststatus:false,
                  cancelManual:true,
                  canceledAt:new Date(),
                  canceledBy:Meteor.userId(),
                }
        }
        );
        console.log('id', id)
        var checkmovement = MovementProduct.find({ transaksi_id: id }, {}).fetch()
        console.log('checkmove', checkmovement)
        if(checkmovement.length > 0){
          for(let movem of checkmovement){
          var datas = {
            order_id:data.order_id,
            item_sku:movem.item_sku
          }
          MovementProduct.remove({ transaksi_id: id })
          console.log(datas); // 4
          HTTP.post('https://api-product.egogohub.tech/test/cancel-movement',
              { data: datas },
              function (err, res) {
                console.log(res); // 4
                console.log(err); // 4
              }); 
          }
        } 
        console.log('orderall' ,order );
        var check = batchListDetail.find({ orderid: data.order_id }, {}).fetch()
        if (check.length > 0) {
          console.log('check', check)
          batchListDetail.remove({ orderid: data.order_id })
          var checkbatch = batchListDetail.find({ batchid: data.batchid }, {}).count()
            if (checkbatch === 0) {
              console.log('batch', data.batchid)
              batchList.remove({ _id: data.batchid })
            }
          }
       
      return order
    }
    else {
      console.log('no prosess' , data );
      var history = loghistory.insert({
        transactionid:id,
        order_id:data.order_id,
        invoice_no:data.invoice_no,
        status:"none",
        comment:"log cancel order",
        type:"cancel",
        usedBy:Meteor.userId(),
        createdAt:new Date(),
      })
      console.log('create log',history)
      var order = allOrder.update(
        {'_id': id},
        {
          $set:
              {
                validasi1status:false,
                completedStatus:false,
                validasi2status:false,
                checkboxstatus:false,
                batchid:null,
                pickliststatus:false,
                cancelManual:true,
                canceledAt:new Date(),
                canceledBy:Meteor.userId(),
              }
        }
      );
      return order
    }
  },
  'orderreview.delete'(ids,bft) {
    console.log('test' , bft );
    
    var id = new Mongo.ObjectID(ids) 
    var data = allOrder.findOne({ '_id': id });
    if(data){
      var check = OrderErrorLogs.findOne({ 'trackingNo': data.tracking_no,typescan: 1 });
      console.log('check',check)
      if (check) {
       OrderErrorLogs.remove(check)
      }
    }
    //scan1
    if(data.validasi1status === true && data.pickliststatus !== true ){
          var history = loghistory.insert({
            transactionid:id,
            order_id:bft.order_id,
            invoice_no:bft.invoice_no,
            sku_before:bft.item_sku,
            status:"scan1",
            qty_before:bft.qty,
            comment:"log delete order product",
            type:"delete",
            usedBy:Meteor.userId(),
            createdAt:new Date(),
          })
          console.log('create log',history)
          var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
            $set:{
              "products.$.cancelstatus":true,
            }
          })
          console.log('orderall' ,order );
        return order
    }
    //picklist
    else if(data.pickliststatus === true  && data.validasi2status !== true ){
      console.log('picklist' , bft );
          
        var history = loghistory.insert({
          transactionid:id,
          order_id:bft.order_id,
          invoice_no:bft.invoice_no,
          sku_before:bft.item_sku,
          status:"Pick List",
          qty_before:bft.qty,
          comment:"log delete order product",
          type:"delete",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        })
        console.log('create log',history)
        var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
          $set:{
            "products.$.cancelstatus":true,
          }
        })
        console.log('orderall' ,order );
        var check = batchListDetail.findOne({ orderid: data.order_id,item_sku:bft.item_sku }, {})
        if (check) {
          console.log('check', check)
          batchListDetail.remove({ orderid: data.order_id,item_sku:bft.item_sku })
          var checkbatch = batchListDetail.find({ batchid: data.batchid }, {}).count()
            if (checkbatch === 0) {
              console.log('batch', batch)
              batchList.remove({ _id: data.batchid })
            }
      }
      return order
    }
    // scan2 
    else if(data.validasi2status === true  ){
      console.log('scan2' , bft );
        var history = loghistory.insert({
          transactionid:id,
          order_id:bft.order_id,
          invoice_no:bft.invoice_no,
          sku_before:bft.item_sku,
          status:"Pick List",
          qty_before:bft.qty,
          comment:"log delete order product",
          type:"delete",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        })
        console.log('create log',history)
        var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
          $set:{
            "products.$.cancelstatus":true,
          }
        })
        console.log('orderall' ,order );
        var check = batchListDetail.findOne({ orderid: data.order_id,item_sku:bft.item_sku }, {})
        if (check) {
          console.log('check', check)
          batchListDetail.remove({ orderid: data.order_id,item_sku:bft.item_sku })
          var checkbatch = batchListDetail.find({ batchid: data.batchid }, {}).count()
            if (checkbatch === 0) {
              console.log('batch', batch)
              batchList.remove({ _id: data.batchid })
            }
          }
        var checkmovement = MovementProduct.findOne({ transaksi_id: id,item_sku:bft.item_sku }, {})
        if(checkmovement){
          console.log('checkmove', checkmovement)
          MovementProduct.remove({ transaksi_id: id,item_sku:bft.item_sku })
          var datas = {
            order_id:order_id,
            item_sku:item_sku
          }
          HTTP.post('https://api-product.egogohub.tech/test/cancel-movement',
              { data: datas },
              function (err, res) {
                console.log(res); // 4
              });
        } 
      return order
    }
    else {
      var history = loghistory.insert({
        transactionid:id,
        order_id:bft.order_id,
        invoice_no:bft.invoice_no,
        sku_before:bft.item_sku,
        status:"none",
        qty_before:bft.qty,
        comment:"log delete order product",
        type:"delete",
        usedBy:Meteor.userId(),
        createdAt:new Date(),
      })
      console.log('create log',history)
      var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
        $set:{
          "products.$.cancelstatus":true,
        }
      })
      console.log('orderall' ,order );
      return order
    }
  },

  //REVIEW ORDER - UPDATE
  'orderreview.update'(ids,bft,aft,qtyafter) {
    // console.log('test' , bft , aft,id,qtyafter); 
    var id = new Mongo.ObjectID(ids)
    var data = allOrder.findOne({ '_id': id });
    if (data) {
      var check = OrderErrorLogs.findOne({ 'trackingNo': data.tracking_no,typescan: 1 });
      console.log('check',check)
      if (check) {
       OrderErrorLogs.remove(check)
      }
    }
    //scan1
    if(data.validasi1status === true && data.pickliststatus !== true ){
        if(!aft){
          var history = loghistory.insert({
            transactionid:id,
            order_id:bft.order_id,
            invoice_no:bft.invoice_no,
            sku_before:bft.item_sku,
            sku_after:"",
            qty_before:bft.qty,
            qty_after:0,
            status:"scan1",
            qty_after:qtyafter,
            comment:"log edit order product qty",
            type:"editqty",
            usedBy:Meteor.userId(),
            createdAt:new Date(),
          }) 
          console.log('create log',history)
          var order = allOrder.update({'_id': id, 'products.item_sku': bft.item_sku},{
            $set:{
              'products.$.qty':qtyafter,
            }
          })
        }
        else{
          var history = loghistory.insert({
            transactionid:id,
            order_id:bft.order_id,
            invoice_no:bft.invoice_no,
            sku_before:bft.item_sku,
            sku_after:aft.no_sku,
            status:"scan1",
            qty_before:bft.qty,
            qty_after:parseInt(qtyafter),
            comment:"log edit order product",
            type:"edit",
            usedBy:Meteor.userId(),
            createdAt:new Date(),
          })
          console.log('create log',history)
          var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
            $set:{
              "products.$.item_sku":aft.no_sku,
              "products.$.item_name":aft.label,
              "products.$.qty":parseInt(qtyafter),
            }
          })
          console.log('orderall' ,order );
    
        }
        return order
    }
    //picklist
    else if(data.pickliststatus === true && data.validasi2status !== true ){
      // console.log('picklist' , bft , aft);
      if(!aft){
        var history = loghistory.insert({
          transactionid:id,
          order_id:bft.order_id,
          invoice_no:bft.invoice_no,
          sku_before:bft.item_sku,
          sku_after:"",
          qty_before:bft.qty,
          qty_after:0,
          status:"picklist",
          comment:"log edit order product qty",
          type:"editqty",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        }) 
        console.log('create log',history)
        var order = allOrder.update({'_id': id, 'products.item_sku': bft.item_sku},{
          $set:{
            'products.$.qty':parseInt(qtyafter),
          }
        })
        if(bft.data_bundle === 0 || !bft.data_bundle){
          var check = batchListDetail.findOne({ orderid: data.order_id,item_sku:bft.item_sku }, {})
          if (check) {
            console.log('check',check)
            batchListDetail.update({ orderid: data.order_id,item_sku:bft.item_sku },
              {
                $set:{
                  qty:parseInt(qtyafter),
                }
              })
          }
        }
        else{
          var check = batchListDetail.find({ orderid: data.order_id,sku_bundle:bft.item_sku }, {}).fetch()
          if (check.length > 0) {
            for(let datas of check){
            console.log('datasqty',datas.qty)
            console.log('qty',parseInt(qtyafter))
            const test = datas.qty
            var update = batchListDetail.update({ orderid: datas.order_id,item_sku:datas.item_sku },
              {
                $set:{
                  qty:parseInt(qtyafter)*datas.qty,
                }
              })
            console.log('datas',datas)
            console.log('update',update)
            }
          }
        }
      }
      else{
        var history = loghistory.insert({
          transactionid:id,
          order_id:bft.order_id,
          invoice_no:bft.invoice_no,
          sku_before:bft.item_sku,
          sku_after:aft.no_sku,
          qty_before:bft.qty,
          qty_after:parseInt(qtyafter),
          comment:"log edit order product",
          type:"edit",
          status:"picklist",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        })
        console.log('create log',history)
        var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
          $set:{
            "products.$.item_sku":aft.no_sku,
            "products.$.item_name":aft.label,
            "products.$.qty":parseInt(qtyafter),
          }
        })
        console.log('orderall' ,order );
        if(bft.data_bundle === 0 || !bft.data_bundle){
          var check = batchListDetail.findOne({ orderid: data.order_id,item_sku:bft.item_sku }, {})
          if (check) {
            console.log('check',check)
            batchListDetail.update({ orderid: data.order_id,item_sku:bft.item_sku },
              {
                $set:{
                  item_sku:aft.no_sku,
                  label:aft.label,
                  qty:parseInt(qtyafter),
                }
              })
          }
        }
        else{
          var check = batchListDetail.find({ orderid: data.order_id,sku_bundle:bft.item_sku }, {}).fetch()
          if (check.length > 0) {
            var deletebatch = batchListDetail.remove({orderid:data.order_id,sku_bundle:bft.item_sku})
            console.log('batchlist detail'+ data.order_id +' has been remove ',deletebatch)
            if(aft.data_bundle != 0){
              for(let datas of aft.data_bundle){
                console.log('datas',datas)
              var insert = batchListDetail.insert({
                transaksiid : data._id,
                item_sku: datas.fk_sku,
                label: datas.label,
                sku_bundle:datas.sku,
                brand: aft.nama_brand,
                data_bundle: datas.length,
                batchid: data.batchid,
                qty: parseInt(datas.qty)*parseInt(qtyafter),
                orderid: data.order_id,
                marketplace: data.marketplace,
                invoice_no: data.invoice_no,
                createdBy: Meteor.userId(),
                createdAt: new Date()
                })
                console.log('insert',insert)
              }  
            }
            else{
              var insert = batchListDetail.insert({
                transaksiid : data._id,
                item_sku: datas.no_sku,
                label: aft.label,
                sku_bundle:null,
                brand: aft.nama_brand,
                data_bundle: null,
                batchid: data.batchid,
                qty: parseInt(datas.qty)*parseInt(qtyafter),
                orderid: data.order_id,
                marketplace: data.marketplace,
                invoice_no: data.invoice_no,
                createdBy: Meteor.userId(),
                createdAt: new Date()
                })
                console.log('insert',insert)
            }
          }
        }
      }
      return order
    }
    // scan2 
    else if(data.validasi2status === true  ){
      console.log('scan2' , bft , aft);
      if(!aft){
        var history = loghistory.insert({
          transactionid:id,
          order_id:bft.order_id,
          invoice_no:bft.invoice_no,
          sku_before:bft.item_sku,
          sku_after:"",
          qty_before:bft.qty,
          qty_after:0,
          status:"scan2",
          comment:"log edit order product qty",
          type:"editqty",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        }) 
        console.log('create log',history)
        var order = allOrder.update({'_id': id, 'products.item_sku': bft.item_sku},{
          $set:{
            'products.$.qty':parseInt(qtyafter),
          }
        })
        var check = batchListDetail.findOne({ orderid: data.order_id,item_sku:bft.item_sku }, {})
        if(bft.data_bundle === 0 || !bft.data_bundle){
            var check = batchListDetail.findOne({ orderid: data.order_id,item_sku:bft.item_sku }, {})
            if (check) {
              console.log('check',check)
              batchListDetail.update({ orderid: data.order_id,item_sku:bft.item_sku },
                {
                  $set:{
                    qty:parseInt(qtyafter),
                  }
                })
            }
            var checkmovement = MovementProduct.findOne({ transaksi_id: id,item_sku:bft.item_sku }, {})
            if(checkmovement){
              console.log('checkmove', checkmovement)
              MovementProduct.update({ transaksi_id: id,item_sku:bft.item_sku },
                {
                  $set:{
                    qty:parseInt(qtyafter),
                  }
                })
                var data2 = {
                  order_id:data.order_id,
                  item_sku:bft.item_sku
                }
                HTTP.post('https://api-product.egogohub.tech/test/cancel-movement',
                    { data: data2 },
                    function (err, res) {
                      console.log(res); // 4
                    });

                var move =[]
                move.push(checkmovement)
                let datas = {
                  "data": move
                }
                HTTP.post('https://api-product.egogohub.tech/test/stock-movement',
                  { data: datas },
                  function (err, res) {
                    console.log(res); // 4
                  });
                console.log('array', array)
        
                console.log('movement updatestock ' + MovementProduct.order_id);
                move = []
            }
          }
          //end !bundle bft
        else{
            var check = batchListDetail.find({ orderid: data.order_id,sku_bundle:bft.item_sku }, {}).fetch()
            if (check.length > 0) {
              for(let datas of check){
              const test = datas.qty
              var update = batchListDetail.update({ orderid: datas.order_id,item_sku:datas.item_sku },
                {
                  $set:{
                    qty:parseInt(qtyafter)*datas.qty,
                  }
                })
              }
            }
            var checkmovement = MovementProduct.find({ transaksi_id: id,sku_bundle:bft.item_sku }, {}).fetch()
            if(checkmovement.length > 0 ){
              console.log('checkmove', checkmovement)
              var move =[]
              for(let datas of checkmovement){
                  MovementProduct.update({ transaksi_id: id,item_sku:datas.item_sku },
                    {
                      $set:{
                        qty:parseInt(qtyafter)*datas.qty,
                      }
                    })
                    var data2 = {
                      order_id:data.order_id,
                      item_sku:datas.item_sku
                    }

                    console.log('array', data2)
                    HTTP.post('https://api-product.egogohub.tech/test/cancel-movement',
                        { data: data2 },
                        function (err, res) {
                          console.log('rescacnel',res); // 4
                        });

                    move.push(datas)
                  }
              let data12 = {
                "data": move
              }
              HTTP.post('https://api-product.egogohub.tech/test/stock-movement',
                { data: data12 },
                function (err, res) {
                  console.log('res hasil',res); // 4
                });
              console.log('movement updatestock ' + MovementProduct.order_id);
              move = []
            }
          }
          //end bundle bft
      }
      //end !aft
      else{
        var history = loghistory.insert({
          transactionid:id,
          order_id:bft.order_id,
          invoice_no:bft.invoice_no,
          sku_before:bft.item_sku,
          sku_after:aft.no_sku,
          qty_before:bft.qty,
          qty_after:parseInt(qtyafter),
          comment:"log edit order product",
          type:"edit",
          status:"scan2",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        })
        console.log('create log',history)
        var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
          $set:{
            "products.$.item_sku":aft.no_sku,
            "products.$.item_name":aft.label,
            "products.$.qty":parseInt(qtyafter),
          }
        })
        console.log('orderall' ,order );
        if(bft.data_bundle === 0 || !bft.data_bundle){ 
            var checkmovement2 = MovementProduct.findOne({ transaksi_id: id,item_sku:bft.item_sku }, {})
            var check = batchListDetail.find({ orderid: data.order_id,item_sku:bft.item_sku }, {}).fetch()
            if (check.length > 0) {
              var deletebatch = batchListDetail.remove({orderid:data.order_id,item_sku:bft.item_sku})
              var deletemove = MovementProduct.remove({orderId:data.order_id,item_sku:bft.item_sku})
              console.log('batchlist detail'+ data.order_id +' has been remove ',deletebatch,  ' remove movement', +deletemove)
              var data2 = {
                order_id:data.order_id,
                item_sku:bft.item_sku
              }
              HTTP.post('https://api-product.egogohub.tech/test/cancel-movement',
              { data: data2 },
              function (err, res) {
                console.log('cancelres',res); // 4
              });
              if(aft.data_bundle.length > 0){
                var move = []
                  for(let datas of aft.data_bundle){
                    console.log('datas',datas)
                      var insert = batchListDetail.insert({
                      transaksiid : data._id,
                      item_sku: datas.fk_sku,
                      label: datas.label,
                      sku_bundle:datas.sku,
                      brand: aft.nama_brand,
                      data_bundle: datas.length,
                      batchid: data.batchid,
                      qty: parseInt(datas.qty)*parseInt(qtyafter),
                      orderid: data.order_id,
                      marketplace: data.marketplace,
                      invoice_no: data.invoice_no,
                      createdBy: Meteor.userId(),
                      createdAt: new Date()
                      })
                    console.log('insert',insert)
                    var insert2 = MovementProduct.insert({
                      transaksi_id: data._id,
                      marketplaceId: data.marketplace,
                      label: datas.label,
                      brandId: aft.nama_brand,
                      orderId: data.order_id,
                      sku_bundle: datas.sku ,
                      trackingNo: data.tracking_no,
                      invoice_no: data.invoice_no,
                      item_sku: datas.fk_sku,
                      qty: parseInt(datas.qty)*parseInt(qtyafter),
                      movementCategory: 'marketplace',
                      movementType: 'out',
                      createdBy: Meteor.userId(),
                      createdAt: new Date()
                      })
                      var moveprod = {
                        marketplaceId: data.marketplace,
                        brandId: aft.nama_brand,
                        orderId: data.order_id,
                        trackingNo: data.tracking_no,
                        item_sku: datas.fk_sku,
                        qty: datas.qty*parseInt(qtyafter),
                        movementCategory: 'marketplace',
                        movementType: 'out',
                        createdAt: new Date(),
                        createdBy: Meteor.userId()
                      }
                      move.push(moveprod)
                  }
                  let data24 = {
                    "data": move
                  }
                  HTTP.post('https://api-product.egogohub.tech/test/stock-movement',
                    { data: data24 },
                    function (err, res) {
                      console.log('updateres',res); // 4
                    });
                  console.log('array', data24)
          
                  console.log('movement updatestock ' + MovementProduct.order_id);
                  move = []
              }
              else if(aft.data_bundle === 0){
                  var move = []
                    var insert = batchListDetail.insert({
                      transaksiid : data._id,
                      item_sku: aft.no_sku,
                      label: aft.label,
                      sku_bundle:null,
                      brand: aft.nama_brand,
                      data_bundle: 0,
                      batchid: data.batchid,
                      qty: parseInt(qtyafter),
                      orderid: data.order_id,
                      marketplace: data.marketplace,
                      invoice_no: data.invoice_no,
                      createdBy: Meteor.userId(),
                      createdAt: new Date()
                      })
                      console.log('insert',insert)
                      var insert2 = MovementProduct.insert({
                        transaksi_id: data._id,
                        marketplaceId: data.marketplace,
                        label: aft.label,
                        brandId: aft.nama_brand,
                        orderId: data.order_id,
                        sku_bundle: datas.sku ,
                        trackingNo: data.tracking_no,
                        invoice_no: data.invoice_no,
                        item_sku: aft.fk_sku,
                        qty: parseInt(qtyafter),
                        movementCategory: 'marketplace',
                        movementType: 'out',
                        createdBy: Meteor.userId(),
                        createdAt: new Date()
                        })
                        var moveprod = {
                          marketplaceId: data.marketplace,
                          brandId: aft.nama_brand,
                          orderId: data.order_id,
                          trackingNo: data.tracking_no,
                          item_sku: aft.no_sku,
                          qty: parseInt(qtyafter),
                          movementCategory: 'marketplace',
                          movementType: 'out',
                          createdAt: new Date(),
                          createdBy: Meteor.userId()
                        }
                        move.push(moveprod)
                        let data24 = {
                          "data": move
                        }
                        HTTP.post('https://api-product.egogohub.tech/test/stock-movement',
                          { data: data24 },
                          function (err, res) {
                            console.log(res); // 4
                          });
                        console.log('array', data24)
                
                        console.log('movement updatestock ' + MovementProduct.order_id);
                        move = []
              }
            }
        }
        //end !data_bundle        
        else{
            var checkmovement3 = MovementProduct.find({ transaksi_id: id,sku_bundle:bft.item_sku }, {}).fetch()
            var check = batchListDetail.find({ orderid: data.order_id,sku_bundle:bft.item_sku }, {}).fetch()
            if (check.length > 0) {
              var deletebatch = batchListDetail.remove({orderid:data.order_id,sku_bundle:bft.item_sku})
              var deletemove3 = MovementProduct.remove({orderId:data.order_id,sku_bundle:bft.item_sku})
              console.log('batchlist detail'+ data.order_id +' has been remove ',deletebatch, ' remove movement ' + deletemove3)
              for(let data10 of checkmovement3 ){
                var data2 = {
                  order_id:data.order_id,
                  item_sku:data10.item_sku
                }
                console.log('data2', data2)
                HTTP.post('https://api-product.egogohub.tech/test/cancel-movement',
                    { data: data2 },
                    function (err, res) {
                      console.log('cancelres',res); // 4
                    });
              }
              if(aft.data_bundle.length > 0){
                  var move = []
                  for(let datas of aft.data_bundle){
                    // console.log('datas',datas)
                      var insert = batchListDetail.insert({
                      transaksiid : data._id,
                      item_sku: datas.fk_sku,
                      label: datas.label,
                      sku_bundle:datas.sku,
                      brand: aft.nama_brand,
                      data_bundle: datas.length,
                      batchid: data.batchid,
                      qty: parseInt(datas.qty)*parseInt(qtyafter),
                      orderid: data.order_id,
                      marketplace: data.marketplace,
                      invoice_no: data.invoice_no,
                      createdBy: Meteor.userId(),
                      createdAt: new Date()
                      })
                    console.log('insert',insert)
                    var insert2 = MovementProduct.insert({
                      transaksi_id: data._id,
                      marketplaceId: data.marketplace,
                      label: datas.label,
                      brandId: aft.nama_brand,
                      orderId: data.order_id,
                      sku_bundle: datas.sku ,
                      trackingNo: data.tracking_no,
                      invoice_no: data.invoice_no,
                      item_sku: datas.fk_sku,
                      qty: parseInt(datas.qty)*parseInt(qtyafter),
                      movementCategory: 'marketplace',
                      movementType: 'out',
                      createdBy: Meteor.userId(),
                      createdAt: new Date()
                      })
                      var moveprod = {
                        marketplaceId: data.marketplace,
                        brandId: aft.nama_brand,
                        orderId: data.order_id,
                        trackingNo: data.tracking_no,
                        item_sku: datas.fk_sku,
                        qty: datas.qty*parseInt(qtyafter),
                        movementCategory: 'marketplace',
                        movementType: 'out',
                        createdAt: new Date(),
                        createdBy: Meteor.userId()
                      }
                      move.push(moveprod)
                  }
                  let data24 = {
                    "data": move
                  }
                  HTTP.post('https://api-product.egogohub.tech/test/stock-movement',
                    { data: data24 },
                    function (err, res) {
                      console.log('updateres',res); // 4
                    });
          
                  console.log('movement updatestock ' + MovementProduct.order_id);
                  move = []
              }
              else if(aft.data_bundle === 0){
                var move = []
                var insert = batchListDetail.insert({
                  transaksiid : data._id,
                  item_sku: aft.no_sku,
                  label: aft.label,
                  sku_bundle:null,
                  brand: aft.nama_brand,
                  data_bundle: 0,
                  batchid: data.batchid,
                  qty: parseInt(qtyafter),
                  orderid: data.order_id,
                  marketplace: data.marketplace,
                  invoice_no: data.invoice_no,
                  createdBy: Meteor.userId(),
                  createdAt: new Date()
                  })
                  console.log('insert',insert)
                  var insert2 = MovementProduct.insert({
                    transaksi_id: data._id,
                    marketplaceId: data.marketplace,
                    label: aft.label,
                    brandId: aft.nama_brand,
                    orderId: data.order_id,
                    sku_bundle: 0 ,
                    trackingNo: data.tracking_no,
                    invoice_no: data.invoice_no,
                    item_sku: aft.no_sku,
                    qty: parseInt(qtyafter),
                    movementCategory: 'marketplace',
                    movementType: 'out',
                    createdBy: Meteor.userId(),
                    createdAt: new Date()
                    })
                    var moveprod = {
                      marketplaceId: data.marketplace,
                      brandId: aft.nama_brand,
                      orderId: data.order_id,
                      trackingNo: data.tracking_no,
                      item_sku: aft.no_sku,
                      qty: parseInt(qtyafter),
                      movementCategory: 'marketplace',
                      movementType: 'out',
                      createdAt: new Date(),
                      createdBy: Meteor.userId()
                    }
                    move.push(moveprod)
                    let data24 = {
                      "data": move
                    }
                    HTTP.post('https://api-product.egogohub.tech/test/stock-movement',
                      { data: data24 },
                      function (err, res) {
                        console.log('updateres',res); // 4
                      });
                    console.log('array', data24)
            
                    console.log('movement updatestock ' + MovementProduct.order_id);
                    move = []
              }
            }
        }
      }
      return order
    }
    else {
      console.log('none' , bft , aft);
      if(!aft){
        var history = loghistory.insert({
          transactionid:id,
          order_id:bft.order_id,
          invoice_no:bft.invoice_no,
          sku_before:bft.item_sku,
          sku_after:"",
          qty_before:bft.qty,
          qty_after:0,
          status:"none",
          comment:"log edit order product qty",
          type:"editqty",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        }) 
        console.log('create log',history)
        var order = allOrder.update({'_id': id, 'products.item_sku': bft.item_sku},{
          $set:{
            'products.$.qty':parseInt(qtyafter),
          }
        })  
      }
      else{
        var history = loghistory.insert({
          transactionid:id,
          order_id:bft.order_id,
          invoice_no:bft.invoice_no,
          sku_before:bft.item_sku,
          sku_after:aft.no_sku,
          qty_before:bft.qty,
          qty_after:parseInt(qtyafter),
          comment:"log edit order product",
          type:"edit",
          status:"none",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        })
        console.log('create log',history)
        var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
          $set:{
            "products.$.item_sku":aft.no_sku,
            "products.$.item_name":aft.label,
            "products.$.qty":parseInt(qtyafter),
          }
        })
      }
      return order
    }
  },
  'showlog.error'(id) {
    console.log('order:' + id);
    var order = OrderErrorLogs.findOne({ '_id' : id });
    console.log('order:' + order);
    return order
  },
  'order.list'(id) {
    console.log('order:' + id);
    var order = allOrder.findOne({ '_id' : new Mongo.ObjectID(id) });
    console.log('order:' + order);
    return order
  },

  'order.byorderid'(orderid) {
    // console.log('tracking:' + track);
    var order = allOrder.findOne({ 'order_id' : orderid});
    console.log('orderid:' + order);
    return order
  },
  'order.invoice'(track) {
    // console.log('tracking:' + track);
    var order = allOrder.findOne({ 'invoice_no' : track });
    console.log('invoice:' + order);
    return order
  },
  'order.tracking'(track) {
    // console.log('tracking:' + track);
    var order = allOrder.findOne({ 'tracking_no' : track });
    console.log('tracking:' + order);
    return order
  },
  'checkproduct'(id) {
    var data = allOrder.findOne({ '_id': id });
    var product = data.products
    var fail = true
    console.log('data:' + data + ' product:' + product + ' fail:' + fail);
    for (let dataproduct of product) {
      console.log('prod', dataproduct)
      return new Promise((resolve,reject) =>
      {   
        HTTP.call('GET', 'https://api-product.egogohub.tech/test/get-sku-fix?sku' + dataproduct.item_sku, {
        }, (error, result) => {
          if (error) {
          OrderErrorLogs.insert({
            trackingNo: data.tracking_no,
            orderid: data.order_id,
            marketplace: data.marketplace,
            errorLog: 'SKU Product not Found' + dataproduct.item_sku,
            item_sku: dataproduct.item_sku,
            shiperchoose: data.shipper_internal,
            typescan: 1,
            createdAt: new Date(),
            usedBy: Meteor.userId()
          })
          fail = false
          console.log(error)
          return reject(fail)
        }
        else {
          var respData = result.data.data[0];
          if (respData) {
            // console.log('resp', result.data)
            // return resolve(respData)
            console.log('test') 
          }
          else {
            OrderErrorLogs.insert({
              trackingNo: data.tracking_no,
              orderid: data.order_id,
              marketplace: data.marketplace,
              errorLog: 'SKU Product not Found' + dataproduct.item_sku,
              item_sku: dataproduct.item_sku,
              shiperchoose: data.shipper_internal,
              typescan: 1,
              createdAt: new Date(),
              usedBy: Meteor.userId()
            })
            fail = false
            console.log(error)
            return reject(fail)
          }
          }
        });
      })
    }
  },
  'createRole'(email, password, role) {
    console.log('Create Role', email, password);
    console.log('user', Meteor.users.find({ 'username': email }).count());
    if (Meteor.users.find({ 'username': email }).count() === 0) {
      // var uid = Meteor.userId();
      let ownerId = Accounts.createUser({
        username: email,
        password: password
      });
      // console.log('uid',ownerId + '-' + role)
      Roles.addUsersToRoles(ownerId, role);
    }
  },

  'createdby.log1'() {
    const createdDatas = OrderErrorLogs.aggregate(
      [
        {
          $group:
          {
            _id: "$usedBy",
          }
        },
      ]
    );
    console.log(createdDatas);
    return createdDatas;
  },
  'createdby.all.drop'() {
    const createdData = allOrder.aggregate(
      [
        {
          $group:
          {
            _id: "$validasi1By",
          }
        },
      ]
    );
    // console.log(createdData);
    return createdData;
  },
  'All.tracking'(tracking) {
    console.log('Scan Validate Start: ' + tracking);
    var order = allOrder.findOne({ 'tracking_no': tracking });
    var order_invoice = allOrder.findOne({ 'invoice_no': tracking });
    var check = OrderErrorLogs.find({ 'trackingNo': tracking,typescan: 1 }).fetch();
    var check_inv = OrderErrorLogs.find({ 'invoice_no': tracking,typescan: 1 }).fetch();
    console.log('check',check + check_inv)
    var i = 0
    if (order) {
      if (check) {
       for(let data of check){
         OrderErrorLogs.remove(data)
       }
      }
      //CHECK PRODUCT
        if(order.validasi1status === true){
          console.log('already');
          return 'already'
        }
        else{
          allOrder.update({ 'tracking_no': tracking }, {
            $set: {
              comment : null,
              errorLog : 0,
            }
          });
          console.log('test')
          var vail = true
          for (let a = 0 ;a < order.products.length;a++) {
            var dataproduct = order.products[a]
            if(dataproduct.item_sku !== ""){
              console.log('test',dataproduct.item_sku)
              var dataorder = Product.findOne({product_sku:dataproduct.item_sku})
                console.log('dataorder',dataorder)
                if(!dataorder ){
                  vail = false
                  allOrder.update({ 'tracking_no': order.tracking_no }, {
                    $set: {
                      comment : "product not found",
                      errorLog : 1,
                      pickliststatus: false,
                      productavailablestatus: false,
                      validasi1status: false,
                      validasi2status: false,
                      validasi1At: new Date(),
                      validasi1By: Meteor.userId()
                    }
                  });
                  OrderErrorLogs.insert({
                    trackingNo: order.tracking_no,
                    invoice_no: order.invoice_no,
                    store_id: order.store_id,
                    brand: order.store_name,
                    orderid: order.order_id,
                    marketplace: order.marketplace,
                    errorLog: 'product not found',
                    item_sku: dataproduct.item_sku,
                    statusLog : 1,
                    typescan: 1,
                    createdAt: new Date(),
                    usedBy: Meteor.userId()
                  });
                }
                else if(dataorder.is_bundle == 1){
                  var databundle = product_bundle.find({'parent_sku':dataproduct.item_sku}).fetch()
                  if(databundle.length != 0){
                    for(let bundle of databundle){
                      var skuchild = Product.findOne({product_sku:bundle.child_sku})
                      if(!skuchild){
                        allOrder.update({ 'tracking_no': order.tracking_no }, {
                          $set: {
                            comment : "bundle product not found",
                            errorLog : 5,
                            pickliststatus: false,
                            productavailablestatus: false,
                            validasi1status: false,
                            validasi2status: false,
                            validasi1At: new Date(),
                            validasi1By: Meteor.userId()
                          }
                        });
                        OrderErrorLogs.insert({
                          trackingNo: order.tracking_no,
                          invoice_no: order.invoice_no,
                          store_id: order.store_id,
                          brand: order.store_name,
                          orderid: order.order_id,
                          marketplace: order.marketplace,
                          errorLog: 'bundle product not found',
                          item_sku: dataproduct.item_sku,
                          statusLog : 5,
                          typescan: 1,
                          createdAt: new Date(),
                          usedBy: Meteor.userId()
                        });                                
                      }
                    }
                  }
                  else{
                    allOrder.update({ 'tracking_no': order.tracking_no }, {
                      $set: {
                        comment : "bundle not found",
                        errorLog : 4,
                        pickliststatus: false,
                        productavailablestatus: false,
                        validasi1status: false,
                        validasi2status: false,
                        validasi1At: new Date(),
                        validasi1By: Meteor.userId()
                      }
                    });
                    OrderErrorLogs.insert({
                      trackingNo: order.tracking_no,
                      invoice_no: order.invoice_no,
                      store_id: order.store_id,
                      brand: order.store_name,
                      orderid: order.order_id,
                      marketplace: order.marketplace,
                      errorLog: 'bundle not found',
                      item_sku: dataproduct.item_sku,
                      statusLog : 4,
                      typescan: 1,
                      createdAt: new Date(),
                      usedBy: Meteor.userId()
                    });
                  }
                }
            }
            else{
              console.log('nuls',null)    
              OrderErrorLogs.insert({
                trackingNo: order.tracking_no,
                invoice_no: order.invoice_no,
                orderid: order.order_id,
                store_id: order.store_id,
                brand: order.store_name,
                marketplace: order.marketplace,
                errorLog: 'SKU MP Null',
                item_sku: dataproduct.item_sku,
                statusLog : 2,
                typescan: 1,
                createdAt: new Date(),
                usedBy: Meteor.userId()
              });
              allOrder.update({ '_id': order._id }, {
                $set: {
                  errorLog : 2,
                  pickliststatus: false,
                  comment: 'SKU MP Null',
                  productavailablestatus: false,
                  checkboxstatus: false,
                }
              });
            }
          }
          
        return order
        }
    }
    else if(!order){
      if(order_invoice){
        if (check_inv) {
          for(let data of check_inv){
            OrderErrorLogs.remove(data)
          }
        }
        if(order_invoice.validasi1status === true){
          console.log('already');
          return 'already'
        }
        else{
          allOrder.update({ 'invoice_no': tracking }, {
            $set: {
              comment : null,
              errorLog : 0,
            }
          });
          console.log('test')
          var vail = true
          for (let a = 0 ;a < order_invoice.products.length;a++) {
            var dataproduct = order_invoice.products[a]
            if(dataproduct.item_sku !== ""){
              console.log('test',dataproduct.item_sku)
              var dataorder = Product.findOne({product_sku:dataproduct.item_sku})
                console.log('dataorder',dataorder)
                if(!dataorder ){
                  vail = false
                  allOrder.update({ 'tracking_no': order_invoice.tracking_no }, {
                    $set: {
                      comment : "product not found",
                      errorLog : 1,
                      pickliststatus: false,
                      productavailablestatus: false,
                      validasi1status: false,
                      validasi2status: false,
                      validasi1At: new Date(),
                      validasi1By: Meteor.userId()
                    }
                  });
                  OrderErrorLogs.insert({
                    trackingNo: order_invoice.tracking_no,
                    invoice_no: order_invoice.invoice_no,
                    store_id: order_invoice.store_id,
                    brand: order_invoice.store_name,
                    orderid: order_invoice.order_id,
                    marketplace: order_invoice.marketplace,
                    errorLog: 'product not found',
                    item_sku: dataproduct.item_sku,
                    statusLog : 1,
                    typescan: 1,
                    createdAt: new Date(),
                    usedBy: Meteor.userId()
                  });
                }
                else if(dataorder.is_bundle == 1){
                  var databundle = product_bundle.find({'parent_sku':dataproduct.item_sku}).fetch()
                  if(databundle.length != 0){
                    for(let bundle of databundle){
                      var skuchild = Product.findOne({product_sku:bundle.child_sku})
                      if(!skuchild){
                        allOrder.update({ 'invoice_no': order_invoice.tracking_no }, {
                          $set: {
                            comment : "bundle product not found",
                            errorLog : 5,
                            pickliststatus: false,
                            productavailablestatus: false,
                            validasi1status: false,
                            validasi2status: false,
                            validasi1At: new Date(),
                            validasi1By: Meteor.userId()
                          }
                        });
                        OrderErrorLogs.insert({
                          trackingNo: order_invoice.tracking_no,
                          invoice_no: order_invoice.invoice_no,
                          store_id: order_invoice.store_id,
                          brand: order_invoice.store_name,
                          orderid: order_invoice.order_id,
                          marketplace: order_invoice.marketplace,
                          errorLog: 'bundle product not found',
                          item_sku: dataproduct.item_sku,
                          statusLog : 5,
                          typescan: 1,
                          createdAt: new Date(),
                          usedBy: Meteor.userId()
                        });                                
                      }
                    }
                  }
                  else{
                    allOrder.update({ 'invoice_no': order_invoice.tracking_no }, {
                      $set: {
                        comment : "bundle not found",
                        errorLog : 4,
                        pickliststatus: false,
                        productavailablestatus: false,
                        validasi1status: false,
                        validasi2status: false,
                        validasi1At: new Date(),
                        validasi1By: Meteor.userId()
                      }
                    });
                    OrderErrorLogs.insert({
                      trackingNo: order_invoice.tracking_no,
                      invoice_no: order_invoice.invoice_no,
                      store_id: order_invoice.store_id,
                      brand: order_invoice.store_name,
                      orderid: order_invoice.order_id,
                      marketplace: order_invoice.marketplace,
                      errorLog: 'bundle not found',
                      item_sku: dataproduct.item_sku,
                      statusLog : 4,
                      typescan: 1,
                      createdAt: new Date(),
                      usedBy: Meteor.userId()
                    });
                  }
                }
            }
            else{
              console.log('nuls',null)    
              OrderErrorLogs.insert({
                trackingNo: order_invoice.tracking_no,
                invoice_no: order_invoice.invoice_no,
                orderid: order_invoice.order_id,
                store_id: order_invoice.store_id,
                brand: order_invoice.store_name,
                marketplace: order_invoice.marketplace,
                errorLog: 'SKU MP Null',
                item_sku: dataproduct.item_sku,
                statusLog : 2,
                typescan: 1,
                createdAt: new Date(),
                usedBy: Meteor.userId()
              });
              allOrder.update({ '_id': order_invoice._id }, {
                $set: {
                  errorLog : 2,
                  pickliststatus: false,
                  comment: 'SKU MP Null',
                  productavailablestatus: false,
                  checkboxstatus: false,
                }
              });
              // return false
            }
          }
          
        return order_invoice
        }
      }
      else if(!order_invoice && !order){
        OrderErrorLogs.insert({
          trackingNo: tracking,
          statusLog : 3,
          invoice_no:"",
          store_id: "",
          brand: "",
          orderid: "",
          marketplace: "",
          errorLog: 'Data not Found',
          typescan: 1,
          shiperchoose: "",
          createdAt: new Date(),
          usedBy: Meteor.userId()
        });
      
        return false
      }
      else {       
        OrderErrorLogs.insert({
          trackingNo: "",
          statusLog : 3,
          invoice_no:tracking,
          store_id: "",
          brand: "",
          orderid: "",
          marketplace: "",
          errorLog: 'Data not Found',
          typescan: 1,
          shiperchoose: "",
          createdAt: new Date(),
          usedBy: Meteor.userId()
        });
      
        return false 
      }
      
    }
  },
  'All.trackinvoice'(tracking) {
    console.log('Scan Validate Start: ' + tracking);
    var order = allOrder.findOne({ 'invoice_no': tracking });
    var check = OrderErrorLogs.findOne({ 'invoice_no': tracking,typescan: 1 });
    console.log('check',check)
    var i = 0
    if (order) {
      if (check) {
       OrderErrorLogs.remove(check)
      }
      //CHECK PRODUCT
        if(order.validasi1status === true){
          console.log('already');
          return 'already'
        }
        else{
          allOrder.update({ 'invoice_no': tracking }, {
            $set: {
              comment : null,
              errorLog : 0,
            }
          });
          var vail = true
          for (let a = 0 ;a < order.products.length;a++) {
            var dataproduct = order.products[a]
            if(dataproduct.item_sku !== ""){
              var dataorder = Product.findOne({product_sku:dataproduct.item_sku})
                console.log('dataorder',dataorder)
                if(!dataorder ){
                  vail = false
                  allOrder.update({ 'tracking_no': order.tracking_no }, {
                    $set: {
                      comment : "product not found",
                      errorLog : 1,
                      pickliststatus: false,
                      productavailablestatus: false,
                      validasi1status: false,
                      validasi2status: false,
                      validasi1At: new Date(),
                      validasi1By: Meteor.userId()
                    }
                  });
                  OrderErrorLogs.insert({
                    trackingNo: order.tracking_no,
                    invoice_no: order.invoice_no,
                    store_id: order.store_id,
                    brand: order.store_name,
                    orderid: order.order_id,
                    marketplace: order.marketplace,
                    errorLog: 'product not found',
                    item_sku: dataproduct.item_sku,
                    statusLog : 1,
                    typescan: 1,
                    createdAt: new Date(),
                    usedBy: Meteor.userId()
                  });
                }
            }
            else{
              console.log('nuls',null)    
              OrderErrorLogs.insert({
                trackingNo: order.tracking_no,
                invoice_no: order.invoice_no,
                orderid: order.order_id,
                store_id: order.store_id,
                brand: order.store_name,
                marketplace: order.marketplace,
                errorLog: 'SKU MP Null',
                item_sku: dataproduct.item_sku,
                statusLog : 2,
                typescan: 1,
                createdAt: new Date(),
                usedBy: Meteor.userId()
              });
              allOrder.update({ '_id': order._id }, {
                $set: {
                  errorLog : 2,
                  pickliststatus: false,
                  comment: 'SKU MP Null',
                  productavailablestatus: false,
                  checkboxstatus: false,
                }
              });
              // return false
            }
          }
          
        return order
        }
    }
    else if(!order){
      if (check) {
        OrderErrorLogs.remove(check)
       }
      OrderErrorLogs.insert({
        trackingNo: "",
        invoice_no:tracking,
        store_id: "",
        brand: "",
        orderid: "",
        marketplace: "",
        statusLog : 3,
        errorLog: 'Data not Found',
        typescan: 1,
        shiperchoose: "",
        createdAt: new Date(),
        usedBy: Meteor.userId()
      });
    
      return false
    }
  },

  're.tracking1'(track){
    var order = allOrder.findOne({ '_id': track });
    var fail = false
    console.log('errorLog',order.errorLog)
    if(order.errorLog == 0  ){
      var data = allOrder.update({ '_id': track }, {
        $set: {
          pickliststatus: false,
          validasi1status: true,
          validasi2status: false,
          validasi1At: new Date(),
          validasi1By: Meteor.userId()
        }
      })
      fail = true
      console.log('data',fail)
      return fail
    }
    else { 
      return fail
    }
  },
  'all.updatemanual'(track) {
    console.log('Scan Validate Manual Start: ' + track);
    var order = allOrder.findOne({ '_id': track });
    console.log('order:' + order.invoice_no )
    if (order) {
      //CHECK PRODUCT
        if(order.validasi1status === true){
          console.log('already');
          return 'already'
        }
        else{
          var update1 =allOrder.update({ 'invoice_no': order.invoice_no }, {
            $set: {
              comment : null,
              errorLog : 0
            }
          })
          for (let a = 0 ;a < order.products.length;a++) {
            var dataproduct = order.products[a]
            console.log('dataproduct',dataproduct)
            if(dataproduct.item_sku != ""){
              var dataorder = Product.findOne({product_sku:dataproduct.item_sku})
                console.log('dataorder',dataorder)
                if(!dataorder){
                  allOrder.update({ 'invoice_no': order.invoice_no }, {
                    $set: {
                      comment : "product not found",
                      errorLog : 1,
                      pickliststatus: false,
                      productavailablestatus: false,
                      validasi1status: false,
                      validasi2status: false,
                      validasi1At: new Date(),
                      validasi1By: Meteor.userId()
                    }
                  });
                  OrderErrorLogs.insert({
                    trackingNo: order.tracking_no,
                    invoice_no: order.invoice_no,
                    store_id: order.store_id,
                    brand: order.store_name,
                    invoice_no: order.invoice_no,
                    orderid: order.order_id,
                    marketplace: order.marketplace,
                    errorLog: 'product not found',
                    item_sku: dataproduct.item_sku,
                    statusLog : 1,
                    typescan: 1,
                    createdAt: new Date(),
                    usedBy: Meteor.userId()
                  });
                }
                else if(dataorder.is_bundle == 1){
                  var databundle = product_bundle.find({'parent_sku':dataproduct.item_sku}).fetch()
                  if(databundle.length != 0){
                    for(let bundle of databundle){
                      var skuchild = Product.findOne({product_sku:bundle.child_sku})
                      if(!skuchild){
                        allOrder.update({ 'invoice_no': order.tracking_no }, {
                          $set: {
                            comment : "bundle product not found",
                            errorLog : 5,
                            pickliststatus: false,
                            productavailablestatus: false,
                            validasi1status: false,
                            validasi2status: false,
                            validasi1At: new Date(),
                            validasi1By: Meteor.userId()
                          }
                        });
                        OrderErrorLogs.insert({
                          trackingNo: order.tracking_no,
                          invoice_no: order.invoice_no,
                          store_id: order.store_id,
                          brand: order.store_name,
                          orderid: order.order_id,
                          marketplace: order.marketplace,
                          errorLog: 'bundle product not found',
                          item_sku: dataproduct.item_sku,
                          statusLog : 5,
                          typescan: 1,
                          createdAt: new Date(),
                          usedBy: Meteor.userId()
                        });               
                      }
                    }
                  }
                  else{
                    allOrder.update({ 'invoice_no': order.tracking_no }, {
                      $set: {
                        comment : "bundle not found",
                        errorLog : 4,
                        pickliststatus: false,
                        productavailablestatus: false,
                        validasi1status: false,
                        validasi2status: false,
                        validasi1At: new Date(),
                        validasi1By: Meteor.userId()
                      }
                    });
                    OrderErrorLogs.insert({
                      trackingNo: order.tracking_no,
                      invoice_no: order.invoice_no,
                      store_id: order.store_id,
                      brand: order.store_name,
                      orderid: order.order_id,
                      marketplace: order.marketplace,
                      errorLog: 'bundle not found',
                      item_sku: dataproduct.item_sku,
                      statusLog : 4,
                      typescan: 1,
                      createdAt: new Date(),
                      usedBy: Meteor.userId()
                    });
                  }
                }
            }
            else{
              console.log('nuls',null)    
              OrderErrorLogs.insert({
                trackingNo: order.tracking_no,
                invoice_no: order.invoice_no,
                orderid: order.order_id,
                store_id: order.store_id,
                brand: order.store_name,
                marketplace: order.marketplace,
                errorLog: 'SKU MP Null',
                item_sku: dataproduct.item_sku,
                statusLog : 2,
                typescan: 1,
                createdAt: new Date(),
                usedBy: Meteor.userId()
              });
              allOrder.update({ '_id': order._id }, {
                $set: {
                  errorLog : 2,
                  pickliststatus: false,
                  comment: 'SKU MP Null',
                  productavailablestatus: false,
                  checkboxstatus: false,
                }
              });
            }
          }
          
          return order
        }
    }
    else {
      OrderErrorLogs.insert({
        trackingNo: "",
        statusLog : 3,
        invoice_no:tracking,
        store_id: "",
        brand: "",
        orderid: "",
        marketplace: "",
        errorLog: 'Data not Found',
        typescan: 1,
        shiperchoose: "",
        createdAt: new Date(),
        usedBy: Meteor.userId()
      });
      return false
    }
  },
  'all.updatemanual2'(id) {
    var allorders = allOrder.findOne({ '_id': id, 'validasi1status': true });
    if (allorders) {
      console.log('tracking', allorders);
      // var prodscount = ProductOrders.find({ 'order_id': allorders.order_id }).count()
      var prods = allorders.products
      let array = []
      if (!prods || prods.length === 0 || prods === []) {
        // var track = tokped
        OrderErrorLogs.insert({
          trackingNo: allorders.tracking_no,
          orderid: allorders.order_id,
          marketplace: allorders.marketplace,
          errorLog: 'Product not Found',
          shiperchoose: allorders.shipper_internal,
          typescan: 2,
          createdAt: new Date(),
          usedBy: Meteor.userId()
        });
        console.log('prod', prodscount);
        return false
      }
      else {
        OrderErrorLogs.remove({ 'trackingNo': allorders.tracking_no })
        OrderErrorLogs.remove({ 'transaksi_id': id })
        var batchdetail = batchListDetail.find({orderid:allorders.order_id}).fetch()
        for (let prod of batchdetail) {
          var productdata = Product.findOne({'product_sku':prod.item_sku})
          var productstocks = ProductStock.findOne({'product_sku':prod.item_sku})
              MovementProduct.insert({
                transaksi_id: allorders._id._str,
                marketplaceId: allorders.marketplace,
                brand_id: productdata.brand_id,
                product_sku: prod.item_sku,
                orderId: allorders.order_id,
                sku_bundle: prod.sku_bundle,
                trackingNo: allorders.tracking_no,
                invoice_no: allorders.invoice_no,
                qty: prod.qty,
                movementCategory: 'marketplace',
                movementType: 'out',
                createdAt: new Date(),
                createdBy: Meteor.userId()
              });

              var dateNow = moment(new Date()).format("YYYY-MMM-DD");
      
              var startDate1 = moment.utc(dateNow);
              var endDate1 = moment.utc(dateNow).add(24, 'hour');
      
              var sd1 = moment.utc(startDate1).toISOString();
              var ed1 = moment.utc(endDate1).toISOString();
      
      
              console.log('dn:' + dateNow + ' sd:' + startDate + ' ed:' + endDate);
              console.log('dn:' + dateNow + ' sd1:' + sd1 + ' ed1:' + ed1);
      
              var startDate = new Date(sd1);
              var endDate = new Date(ed1);
              var logstock = logdailystock.findOne({'product_sku':prod.item_sku,'updatedAt':{ $gte: sd1, $lt: ed1 }},{sort:{updatedAt:-1}})
              console.log('logstock',logstock)
                if(logstock){
                  logdailystock.update({'product_sku': prod.item_sku, _id:logstock._id },{
                    $set:{
                      stock:productstocks.stock - prod.qty,
                      updatedBy:Meteor.userId(),
                      updatedAt:new Date(),
                    }
                  })
                }
                else{
                  console.log('productstock',productstocks)
                  logdailystock.insert({
                    product_id:productdata.product_id,
                    product_sku:productdata.product_sku,
                    brand_id:productdata.brand_id,
                    updatedAt:new Date(),
                    createdAt:new Date(),
                    createdBy:Meteor.userId(),
                    updatedBy:Meteor.userId(),
                    stock:productstocks.stock - prod.qty
                  })
                }
              ProductStock.update({'product_sku': prod.item_sku },{
                $set:{
                  stock:productstocks.stock - prod.qty
                }
              })
              
            }
            allOrder.update({ 'order_id': allorders.order_id }, {
              $set: {
                validasi2status: true,
                printedstatus:false,
                validasi2At: new Date(),
                validasi2By: Meteor.userId()
              }
            });
            
      }
    }
    else {
      OrderErrorLogs.insert({
        // trackingNo: tracking,
        transaksi_id: id,
        marketplace: "",
        orderd: "",
        statusLog : 3,
        errorLog: 'Data not Found',
        shiperchoose: "",
        typescan: 2,
        createdAt: new Date(),
        usedBy: Meteor.user()
      });
      return false
    }
    return allorders
  },
  // start all tracking
  'all_tracking.tracking2'(tracking, shp1) {
    console.log('tracking', tracking, shp1);
    var shp = shp1.toString();
    var check = OrderErrorLogs.findOne({ 'trackingNo': tracking ,typescan: 2});
    var allorders = allOrder.findOne({ 'tracking_no': tracking, 'shipper_internal': shp, 'validasi1status': true });
    // var allorders = allOrder.findOne({ 'tracking_no': tracking,'shipper_internal': shp});
    if (allorders) {
      if(allorders.validasi2status == false){
        var array = []
        console.log(check)
        if(check){
          OrderErrorLogs.remove(check)
        }
        // OrderErrorLogs.remove({ 'transaksi_id': id })
        // var prodscount = ProductOrders.find({ 'order_id': allorders.order_id }).count()
        var batchdetail = batchListDetail.find({'orderid':allorders.order_id}).fetch()
        for (let prod of batchdetail) {
          var productdata = Product.findOne({'product_sku':prod.item_sku})
          var productstock = ProductStock.findOne({'product_sku':prod.item_sku})
          console.log('batch',batchdetail)
          MovementProduct.insert({
            transaksi_id: allorders._id,
            marketplaceId: allorders.marketplace,
            brand_id: productdata.brand_id,
            orderId: allorders.order_id,
            trackingNo: allorders.tracking_no,
            invoice_no: allorders.invoice_no,
            product_sku: prod.item_sku,
            sku_bundle: prod.sku_bundle ,
            qty: prod.qty,
            movementCategory: 'marketplace',
            movementType: 'out',
            createdAt: new Date(),
            createdBy: Meteor.userId()
          });

          var dateNow = moment(new Date()).format("YYYY-MMM-DD");
  
          var startDate1 = moment.utc(dateNow);
          var endDate1 = moment.utc(dateNow).add(24, 'hour');
  
          var sd1 = moment.utc(startDate1).toISOString();
          var ed1 = moment.utc(endDate1).toISOString();
  
  
          // console.log('dn:' + dateNow + ' sd:' + startDate + ' ed:' + endDate);
          // console.log('dn:' + dateNow + ' sd1:' + sd1 + ' ed1:' + ed1);
  
          var startDate = new Date(sd1);
          var endDate = new Date(ed1);
          var logstock = logdailystock.findOne({'product_sku':prod.item_sku,'updatedAt':{ $gte: startDate, $lt: endDate }},{sort:{updatedAt:-1}})
          // console.log('logstock',logstock)
            if(logstock){
              logdailystock.update({'product_sku': prod.item_sku, _id:logstock._id },{
                $set:{
                  stock:productstock.stock - prod.qty,
                  updatedBy:Meteor.userId(),
                  updatedAt:new Date(),
                }
              })
            }
            else{
              // console.log('date log',logdate)
              logdailystock.insert({
                product_id:productdata.product_id,
                product_sku:productdata.product_sku,
                brand_id:productdata.brand_id,
                updatedAt:new Date(),
                createdAt:new Date(),
                createdBy:Meteor.userId(),
                updatedBy:Meteor.userId(),
                stock:productstock.stock - prod.qty
              })
            }
          ProductStock.update({'product_sku': prod.item_sku },{
            $set:{
              stock:productstock.stock - prod.qty
            }
          })
        }

        allOrder.update({ 'order_id': allorders.order_id }, {
          $set: {
            validasi2status: true,
            printedstatus: false,
            validasi2At: new Date(),
            validasi2By: Meteor.userId()
          }
        });
        
          
      }
      else{
        return true
      }
      return allorders
    }
    else {
      console.log('log',check)
      if(check){
        OrderErrorLogs.remove(check)
      }
      OrderErrorLogs.insert({
        trackingNo: tracking,
        marketplace: "",
        orderd: "",
        statusLog : 3,
        errorLog: 'Data not Found',
        shiperchoose: shp,
        typescan: 2,
        createdAt: new Date(),
        usedBy: Meteor.user()
      });  
      
      return false
    }
  },
  //End all tracking

  // show scan2
  'scan2show.all'(track, shp) {
    console.log('scan2');
    var scan =
      TokopediaOrders.aggregate([
        { $unionWith: { coll: "bukalapakOrders", } },
        { $unionWith: { coll: "lazadaOrders", } },
        { $unionWith: { coll: "shopeeOrders", } },
        { $unionWith: { coll: "blibliOrders", } },
        { $unionWith: { coll: "jdidOrders", } },
        { $unionWith: { coll: "zaloraOrders", } },
        {
          $project: {
            order_id: 1, tracking_no: 1, shipper_internal: 1, marketplace: 1, brand_id: 1, validstatus: 1, validstatus2: {
              $cond: [
                { $ifNull: ['$validstatus2', false] }, // if
                true, // then
                false // else
              ]
            }, item_sku: {
              $reduce: {
                input: "$products.item_sku", initialValue: "", in: {
                  "$cond": {
                    if: { "$eq": [{ "$indexOfArray": ["$products.item_sku", "$$this"] }, 0] },
                    then: { "$concat": ["$$value", "$$this"] },
                    else: { "$concat": ["$$value", ",  ", "$$this"] }
                  }
                }
              }
            },
          }
        },
        {
          $match: {
            $and: [
              { tracking_no: track },
              { shipper_internal: shp },
              { validstatus: true },
              { validstatus2: true }
            ]
          }
        },
        {
          $sort: { 'updateAt': -1 }
        }
        , { $limit: 15 }
      ])
    console.log('result', scan)
    return scan
  },
  // end show scan2
  'validation.all'() {
    console.log('validation1');
    var validmp =
      TokopediaOrders.aggregate([
        { $unionWith: { coll: "bukalapakOrders", } },
        { $unionWith: { coll: "lazadaOrders", } },
        { $unionWith: { coll: "shopeeOrders", } },
        { $unionWith: { coll: "blibliOrders", } },
        { $unionWith: { coll: "jdidOrders", } },
        { $unionWith: { coll: "zaloraOrders", } },

        {
          $project: {
            invoice_no: 1,
            order_id: 1, tracking_no: 1, shipper_internal: 1, marketplace: 1, validasi1At: 1, validasi1By: 1, validasi1status: 1, validasi2status: {
              $cond: [
                { $ifNull: ['$validasi2status', false] }, // if
                true, // then
                false // else
              ]
            }, pickliststatus: {
              $cond: [
                { $ifNull: ['$pickliststatus', false] }, // if
                true, // then
                false // else
              ]
            }, checkboxstatus: {
              $cond: [
                { $ifNull: ['$checkboxstatus', false] }, // if
                true, // then
                false // else
              ]
            }
          }
        },
        {
          $match: {
            $and: [
              { validasi1status: true },
              { validasi2status: false },
              { pickliststatus: false }
            ]
          }
        },
        {
          $sort: { 'validasi1At': 1 }
        }
        // , { $limit: 15 }
      ])
    return validmp
  },
  // end Validation

  'getNewOrder'(orderId, mp) {
    console.log('Get New Order START: ' + orderId + ' mp:' + mp);
    // try {
    HTTP.call('GET', 'https://cronmp.egogohub.tech/getData/get_order?order_id=' + orderId + '&marketplace=' + mp, {
    }, (error, result) => {
      // console.log('get update order error:', error);
      console.log('Get Update Result: ' + result.data.order_id);
      if (!error) {
        var result1 = result.data;
        let productData = result1.products
        // allOrder.insert(result);
        var insertId = allOrder.insert({
          store_id: result1.store_id,
          // brand_id: result1.brand_id,
          // brand_name: result1.brand_name,
          marketplace: result1.marketplace,
          order_id: result1.order_id,
          insurance_cost: result1.insurance_cost,
          invoice_no: result1.invoice_no,
          payment_date: result1.payment_date != null ? new Date(result1.payment_date) : null,
          payment_method: result1.payment_method,
          delivery_date: result1.delivery_date != null ? new Date(result1.delivery_date) : null,
          completion_date: result1.completion_date != null ? new Date(result1.completion_date) : null,
          customer_name: result1.customer_name,
          customer_phone: result1.customer_phone,
          customer_email: result1.customer_email,
          sub_total: result1.sub_total,
          shipping_cost: result1.shipping_cost,
          grand_total: result1.grand_total,
          marketplace_status: result1.marketplace_status,
          fk_user_create: result1.fk_user_create,
          recipient_name: result1.recipient_name,
          recipient_phone: result1.recipient_phone,
          shipping_address: result1.shipping_address,
          shipping_area: result1.shipping_area,
          shipping_city: result1.shipping_city,
          shipping_province: result1.shipping_province,
          shipping_post_code: result1.shipping_post_code,
          shipping_country: result1.shipping_country,
          shipper_mp: result1.shipper_mp,
          shipper_internal: result1.shipper_internal,
          tracking_no: result1.tracking_no,
          channel_status: result1.channel_status,
          internal_status: result1.internal_status,
          cancel_reason: result1.cancel_reason,
          cancel_reason_detail: result1.cancel_reason_detail,
          products: result1.products,
          validasi1status: false,
          create_date: new Date(result1.create_date)
        });
        console.log('insertId: ' + insertId);
        // console.log('blibli result:' + result);
        productData.forEach(product => {
          var productId = ProductOrders.insert(product)
          console.log('productId: ' + productId);
        });
        // var mp = result.marketplace;
        // if (mp == 'blibli') {
        //   Meteor.call('agregateBlibli.update');
        // } else if (mp == 'tokopedia') {
        //   Meteor.call('agregateTokopedia.update');
        // } else if (mp == 'bukalapak') {
        //   Meteor.call('agregateBukalapak.update');
        // } else if (mp == 'jdid') {
        //   Meteor.call('agregateJdid.update');
        // } else if (mp = 'lazada') {
        //   Meteor.call('agregateLazada.update');
        // } else if (mp == 'shopee') {
        //   Meteor.call('agregateShopee.update');
        // } else if (mp == 'zalora') {
        //   Meteor.call('agregateZalora.update');
        // }
      }
    });
    // Meteor.call('agregateAll.update');
  },
  'getUpdateOrder'(orderId, mp) {
    console.log('Get New Order START: ' + orderId + ' mp:' + mp);
    // try {
    return new Promise((resolve,reject) =>
    {  
      HTTP.call('GET', 'https://cronmp.egogohub.tech/getData/get_order?order_id=' + orderId + '&marketplace=' + mp, {
      }, (error, result) => {
      // console.log('get update order error:', error);
      console.log('Get Update Result: ' + result.data.order_id);
        if (!error) {
          var result1 = result.data;
          let productData = result1.products
          
          var updateId = allOrder.update({'order_id':orderId},
            {
              $set:{
              shipper_mp: result1.shipper_mp,
              shipper_internal: result1.shipper_internal,
              tracking_no: result1.tracking_no,
              channel_status: result1.channel_status,
              internal_status: result1.internal_status,
              cancel_reason: result1.cancel_reason,
              cancel_reason_detail: result1.cancel_reason_detail,
              }
          });
          console.log('updateId: ' + updateId);
          return resolve(result)
        }
        else{
          return reject(false)
        }
      });
    }) 
  },

  // https://erp.egogohub.com/cron/sync_tokopedia3.php?act=getSingleOrderItem&orderid=[orderid]
  'tokopediaDetailOrder.update'(orderId) {
    console.log('TOKOPEDIA UPDATE START ' + orderId);
    // try {
    HTTP.call('GET', 'https://erp.egogohub.com/cron/sync_tokopedia3.php?act=getSingleOrderItem&orderid=' + orderId, {
    }, (error, result) => {
      if (!error) {
        // console.log(result.data.data);
        respData = result.data.data;
        var shopId = respData.seller_id;
        var mpStatus = respData.order_status;
        var invoiceNo = respData.invoice_number;
        var is = InternalStatus.findOne({ 'mp': 'tokopedia', 'mpStatus': mpStatus });
        TokopediaOrders.update({ 'orderId': orderId }, {
          $set: {
            mpStatus: mpStatus,
            internalStatus: is.internalStatus,
            invoiceNo: invoiceNo,
            mpCreateTime: respData.create_time,
            trackingNo: respData.order_info.shipping_info.awb,
            insertType: 'API Detail - Update Duplicate',
            updateAt: new Date()
          }
        });
        TokpedOrderDetail.update({ 'orderId': orderId }, {
          $set: {
            mpStatus: mpStatus,
            internalStatus: is.internalStatus,
            invoiceNo: invoiceNo,
            mpCreateTime: respData.create_time,
            orders: respData,
            trackingNo: respData.order_info.shipping_info.awb,
            insertType: 'API Detail - Update',
            updateAt: new Date()
          }
        });
        console.log('TOKOPEDIA UPDATE FINISH ' + orderId);
        return true;
      } else {
        console.log('TOKOPEDIA UPDATE FAILED ' + orderId);
      }
    });
  },


  'tokopediaDetailOrder.insert'(orderId) {
    console.log('TOKOPEDIA INSERT START ' + orderId);
    // try {
    HTTP.call('GET', 'https://erp.egogohub.com/cron/sync_tokopedia3.php?act=getSingleOrderItem&orderid=' + orderId, {
    }, (error, result) => {
      if (!error) {
        // console.log(result.data.data);
        respData = result.data.data;
        var shopId = respData.seller_id;
        var mpStatus = respData.order_status;
        var invoiceNo = respData.invoice_number;
        // var brandData = ShopMp.findOne({ 'shopid': shopId });
        var is = InternalStatus.findOne({ 'mp': 'tokopedia', 'mpStatus': mpStatus });
        // console.log(mpStatus);
        // console.log(is.internalStatus);
        // if (orderCount > 0) {
        // } else {
        TokopediaOrders.insert({
          // { 'orderId': orderId }, {
          // $set: {
          marketplaceId: "tokopedia",
          // brandId: brandData.brand,
          orderId: orderId,
          shopId: shopId,
          mpStatus: mpStatus,
          internalStatus: is.internalStatus,
          invoiceNo: invoiceNo,
          mpCreateTime: respData.create_time,
          trackingNo: respData.order_info.shipping_info.awb,
          insertType: 'API Detail - Insert New',
          createdAt: new Date()
          // }
        });
        TokpedOrderDetail.insert({
          marketplaceId: "tokopedia",
          // brandId: brandData.brand,
          shopId: shopId,
          orderId: orderId,
          invoiceNo: invoiceNo,
          internalStatus: is.internalStatus,
          mpStatus: mpStatus,
          orders: respData,
          mpCreateTime: respData.create_time,
          trackingNo: respData.order_info.shipping_info.awb,
          insertType: 'API Detail - Insert New',
          createdAt: new Date()
        });
        console.log('TOKOPEDIA UPDATE FINISH ' + orderId);
        return true;
        // }
      } else {
        console.log('TOKOPEDIA UPDATE FAILED ' + orderId);
      }
    });
  },
  'shopeeDetailOrder'(orderId, shopId) {
    // console.log('SHOPEE DETAIL START ' + orderId);
    // try {
    HTTP.call('GET', 'https://erp.egogohub.com/cron/sync_shopee3.php?act=getSingleOrderItem&shopid=' + shopId + '&orderid=' + orderId, {
    }, (error, result) => {
      if (!error) {
        // console.log(result.data);

        respData = result.data;
        // var brandData = ShopMp.findOne({ 'shopid': shopId });
        var mpStatus = respData.orders[0].order_status;
        var orderCount = ShopeeOrderDetail.find({ 'orderId': orderId }).count();
        var is = InternalStatus.findOne({ 'mp': 'shopee', 'mpStatus': mpStatus });
        // console.log('shopee detail order, oid:' + orderId + ' sid: ' + shopId + ' mpStat: ' + mpStatus + ' iStat: ' + is.internalStatus);
        // console.log(mpStatus)
        // console.log(is.internalStatus);
        if (orderCount > 0) {

          ShopeeOrders.update({ 'orderId': orderId }, {
            $set: {
              invoiceNo: orderId,
              // brandId: brandData.brand,
              mpStatus: mpStatus,
              internalStatus: is.internalStatus,
              mpCreateTime: new Date(moment(respData.orders[0].create_time, 'X').format()),
              trackingNo: respData.orders[0].tracking_no,
              insertType: 'API Detail - Update Duplicate',
              updateAt: new Date()
            }
          });
          ShopeeOrderDetail.update({ 'orderId': orderId }, {
            $set: {
              invoiceNo: orderId,
              // brandId: brandData.brand,
              mpStatus: mpStatus,
              internalStatus: is.internalStatus,
              orders: respData.orders[0],
              mpCreateTime: new Date(moment(respData.orders[0].create_time, 'X').format()),
              trackingNo: respData.orders[0].tracking_no,
              insertType: 'API Detail - Update',
              updateAt: new Date()
            }
          });
          console.log('SHOPEE UPDATE FINISH ' + orderId);
        } else {

          ShopeeOrders.update({ 'orderId': orderId }, {
            $set: {
              invoiceNo: orderId,
              // brandId: brandData.brand,
              mpStatus: mpStatus,
              internalStatus: is.internalStatus,
              mpCreateTime: new Date(moment(respData.orders[0].create_time, 'X').format()),
              trackingNo: respData.orders[0].tracking_no,
              insertType: 'API Detail - Update',
              updateAt: new Date()
            }
          });
          ShopeeOrderDetail.insert({
            orderId: orderId,
            // brandId: brandData.brand,
            shopId: shopId,
            marketplaceId: "shopee",
            invoiceNo: orderId,
            internalStatus: is.internalStatus,
            mpStatus: mpStatus,
            orders: respData.orders[0],
            mpCreateTime: new Date(moment(respData.orders[0].create_time, 'X').format()),
            trackingNo: respData.orders[0].tracking_no,
            insertType: 'API Detail - Insert New',
            createdAt: new Date()
          });
          console.log('SHOPEE INSERT FINISH ' + orderId);
        }

        // return result;
      } else {
        console.log('SHOPEE UPDATE FAILED ' + orderId);
      }
    });
  },

  // Report
  'print.change'(data) {
    console.log('data',data)
    for(let dat of data){
      var test= allOrder.findOne({ 'invoice_no': dat.invoice_no });
      console.log('test',test)
      if(test){
        var order = allOrder.update(
          {'_id': test._id},
          {
            $set:
                {
                  printedstatus:true,
                  printedAt:new Date(),
                  printedBy:Meteor.userId(),
                }
          }
        );
      }
    }
    return data
},

  'brand.shopmp'() {
    var test= ShopMp.aggregate([
        {
          $match:{brand:{$exists:true}}
        }
      ,
        {
            $group:
                {
                    _id: "$brand",
                }
        },
        {
          $sort : {_id:1}
      } 
    ]
    );
    // console.log('test',test)
    return test
},
  'exportdatascan2'(startDate, endDate,shipper,print) {
    // return Return.find({ 'complainDate': { $gt: startDate, $lt: endDate } }).fetch();
    var sd = startDate +"T00:00:00"
    var ed = endDate +"T23:59:59"
    
    const Data = allOrder.aggregate(
      [
        {
          $match:
          { "$expr":
            { $and: [
                { "$gte": [ "$validasi2At", new Date(sd) ] },
                { "$lte": [ "$validasi2At", new Date(ed) ] },
                { "$eq": ["$shipper_internal", shipper.toString()]},
                { "$eq": ["$printedstatus", print]},
                { "$eq": ["$validasi2status", true]},
              ]   
            }
          },
        },
        {
            $project: {
              _id: '$_id._str',
              'Tracking Number': '$tracking_no',
              'Invoice Number': '$invoice_no',
              'Brand Name': '$store_name',
              'Shipping': '$shipper_internal',
            }
        },
        {
          $addFields:{
            'Date Export':new Date()    
          }
        }
      ]
    );
    // console.log('data',Data);
    return Data;
  },
  'printscan2'(startDate, endDate,shipper,print) {
    var sd = startDate +"T00:00:00"
    var ed = endDate +"T23:59:59"
    if(print === "false"){
      const Data = allOrder.aggregate(
        [
          {
            $match:
            { "$expr":
              { $and: [
                  { "$gte": [ "$validasi2At", new Date(sd) ] },
                  { "$lte": [ "$validasi2At", new Date(ed) ] },
                  { "$eq": ["$shipper_internal", shipper]},
                  { "$ne": ["$printedstatus", true]},
                  { "$eq": ["$validasi2status", true]},
                  
                ]   
              }
            },
          },
          {
              $project: {
                _id: '$_id._str',
                'invoice_no': '$invoice_no',
                'store_name': '$store_name',
                'tracking_no': '$tracking_no',
                'shipper_internal': '$shipper_internal',
              }
            }
        ]
      );
      return Data;
    }
    else{
      const Data = allOrder.aggregate(
        [
          {
            $match:
            { "$expr":
              { $and: [
                  { "$gte": [ "$validasi2At", new Date(sd) ] },
                  { "$lte": [ "$validasi2At", new Date(ed) ] },
                  { "$eq": ["$shipper_internal", shipper]},
                  { "$eq": ["$printedstatus", true]},
                  { "$eq": ["$validasi2status", true]},
                  
                ]   
              }
            },
          },
          {
              $project: {
                _id: '$_id._str',
                'invoice_no': '$invoice_no',
                'store_name': '$store_name',
                'tracking_no': '$tracking_no',
                'shipper_internal': '$shipper_internal',
              }
            }
        ]
      );
      return Data;
    }
    
  },

  'getballancemovement'(sds, eds,bd,sku) {
    var sd = new Date(sds+"T00:00:00")
    var ed = new Date(eds+"T23:59:59")
    if(!bd){
      const Data = logdailystock.findOne({product_sku:sku,updatedAt:{$lte:ed}},{sort:{'updatedAt':-1}})
      // console.log('Data',Data)
      // const Data = MovementProduct.aggregate(
      //   [
      //     {
      //       $match:
      //       { "$expr":
      //         { $and: [
      //           { "$eq": [ "$item_sku", sku ] },
      //             // { "$gte": [ "$createdAt", sd ] },
      //             { "$lte": [ "$createdAt", ed ] },
      //             // { "$eq": [ "$item_sku", sku ] },
      //           ]   
      //         }
      //       },
      //     },
      //     {
      //       $group:
      //             {
      //               _id: "$item_sku",
      //               out: {
      //                 "$sum": { "$cond": [
      //                     { "$eq": [ "$movementType", "out" ] },
      //                     "$qty",
      //                     0
      //                 ]}
      //                 },
      //                 in: {
      //                     "$sum": { "$cond": [
      //                         { "$eq": [ "$movementType", "in" ] },
      //                         "$qty",
      //                         0
      //                     ]}
      //                   },

      //             }
      //     },
      //     { $sort : { datec : -1 } }
      //   ]
      // );
      // console.log('datasgroup1',Data);
      return Data;
    }
    else{
      const Data = logdailystock.findOne({product_sku:sku,updatedAt:{$lte:ed},brand_id:bd},{sort:{'updatedAt':-1}})
      // const Data = MovementProduct.aggregate(
      //   [
      //     {
      //       $match:
      //       { "$expr":
      //         { $and: [
      //           { "$eq": [ "$item_sku", sku ] },
      //             // { "$gte": [ "$createdAt", sd ] },
      //             { "$lte": [ "$createdAt", ed ] },
      //             { "$eq": [ "$brandId", bd ] },
      //           ]   
      //         }
      //       },
      //     },
      //     {
      //       $group:
      //             {
      //               _id: "$item_sku",
      //               out: {
      //                 "$sum": { "$cond": [
      //                     { "$eq": [ "$movementType", "out" ] },
      //                     "$qty",
      //                     0
      //                 ]}
      //                 },
      //                 in: {
      //                     "$sum": { "$cond": [
      //                         { "$eq": [ "$movementType", "in" ] },
      //                         "$qty",
      //                         0
      //                     ]}
      //                   }

      //             }
      //     }
      //   ]
      // );

      // console.log('datagroup2',Data);
      return Data;
    }
  },
  'getgroupmouvment'(sds, eds,bd,sku) {
    var sd = new Date(sds+"T00:00:00")
    var ed = new Date(eds+"T23:59:59")
      const Data = MovementProduct.aggregate(
        [
          {
            $match:
            { "$expr":
              { $and: [
                { "$eq": [ "$product_sku", sku ] },
                  { "$gte": [ "$createdAt", sd ] },
                  { "$lte": [ "$createdAt", ed ] },
                  // { "$eq": [ "$item_sku", sku ] },
                ]   
              }
            },
          },
          {
            $group:
                  {
                    _id: "$product_sku",
                    out: {
                      "$sum": { "$cond": [
                          { "$eq": [ "$movementType", "out" ] },
                          "$qty",
                          0
                      ]}
                      },
                      in: {
                          "$sum": { "$cond": [
                              { "$eq": [ "$movementType", "in" ] },
                              "$qty",
                              0
                          ]}
                        },

                  }
          }
        ]
      );
      return Data;
    
  },
  'exportoutsummary'(sds, eds,bd) {
    var sd = new Date(sds+"T07:00:00")
    var ed = new Date(eds+"T23:59:59")

      console.log('sd',bd);
    if(!bd){
      const Data = Product.aggregate(
        [
          {
          
              "$lookup":
              {
                  "from": "movementProduct", 
                  "let": {"ref": "$ref"},
                  "pipeline":[
                      {
                          "$match": {"$expr":{ $and: [
                              { "$gte": [ "$createdAt", new Date("sd") ] },
                              { "$lte": [ "$createdAt", new Date(ed) ] },
                              // { "$eq": ["$brandId", "BARDI"]},
                            ]   
                          }}
                      },
                  ],
                  "as": "movement"
              }
          },
        {
          $match:
            { $and: [
              {"is_bundle": 0 },
              {ref: {$not:{ $regex: "Inactive", $options: "i" }} }
              ]   
            }
        },
        {
          $group:
                {
                  _id: "$ref",
                  label: { $max:"$label"},
                  brand: {$max:"$brand"},
                  stock:  { $max:"$stock"},
                  out: {
                    "$sum": { "$cond": [
                        { "$eq": [ {$arrayElemAt: ["$insertTypeHeader", 0]}, "out" ] },
                        {$arrayElemAt: ["$qty", 0]},
                        0
                    ]}
                    },
                    in: {
                        "$sum": { "$cond": [
                            { "$eq": [ {$arrayElemAt: ["$insertTypeHeader", 0]}, "in" ] },
                            {$arrayElemAt: ["$qty", 0]},
                            0
                        ]}
                      },

                }
        },
      ]
      );
      // console.log('datasgroup1',Data);
      return Data;
    }
    else{
      const Data = Product.aggregate(
        [
          {
          
              "$lookup":
              {
                  "from": "movementProduct", 
                  "let": {"ref": "$ref"},
                  "pipeline":[
                      {
                          "$match": {"$expr":{ $and: [
                              { "$gte": [ "$createdAt", new Date(sd) ] },
                              { "$lte": [ "$createdAt", new Date(ed) ] },
                            ]   
                          }}
                      },
                  ],
                  "as": "movement"
              }
          },
        {
          $match:
            { $and: [
              {"is_bundle": 0 },
              {ref: {$not:{ $regex: "Inactive", $options: "i" }} },
              {"brand": bd},
              ]   
            }
        },
        {
          $group:
                {
                  _id: "$ref",
                  label: { $max:"$label"},
                  brand: {$max:"$brand"},
                  stock:  { $max:"$stock"},
                  out: {
                    "$sum": { "$cond": [
                        { "$eq": [ {$arrayElemAt: ["$insertTypeHeader", 0]}, "out" ] },
                        {$arrayElemAt: ["$qty", 0]},
                        0
                    ]}
                    },
                    in: {
                        "$sum": { "$cond": [
                            { "$eq": [ {$arrayElemAt: ["$insertTypeHeader", 0]}, "in" ] },
                            {$arrayElemAt: ["$qty", 0]},
                            0
                        ]}
                      },

                }
        },
      ]
      );

      console.log('datagroup2',Data);
      return Data;
    }
  },
  'brand.log1'() {
    const createdDatas = OrderErrorLogs.aggregate(
      [
        {
          $group:
          {
            _id: "$brand",
          }
        },
      ]
    );
    // console.log(createdDatas);
    return createdDatas;
  },
});
