// Methods related to links

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
// import { check } from 'meteor/check';
import { TokopediaOrders, ShopeeOrders, BukalapakOrders, LazadaOrders,loghistory, JdidOrders, ZaloraOrders, BlibliOrders, allOrder, OrderErrorLogs } from '../../orders/orders';
import { batchList, batchListDetail } from '../picklist';
import { MongoObject } from 'simpl-schema';
import { Product, product_bundle } from '../../product/product';


Meteor.methods({

  'checkproduct.picklist'(data,sku) {
    // console.log('awals',sku,data)
    var checkhead = OrderErrorLogs.findOne({'invoice_no':data.invoice_no,typescan: 'Pick List'})
    console.log('errorlog',checkhead)
    if(checkhead){
      OrderErrorLogs.remove(checkhead)
    }
    if(sku.item_sku !== ""){
      var dataorder = Product.findOne({'product_sku':sku.item_sku})
      if(sku.item_sku == dataorder.product_sku){
        return dataorder
      }
    }
  },

  'checkproduct.picklist2'(data,sku) {
    var dataorder = Product.findOne({'product_sku':sku.item_sku})
    
        if(sku.item_sku == dataorder.product_sku){
          if(dataorder.is_bundle == 1){
            var databundle = product_bundle.find({'parent_child':sku.item_sku}).fetch()
            var emp = []
            for(let bundle of databundle){
              var prod = Product.findOne({'product_sku':bundle.child_sku})
              emp.push({
                transaksiid : data._id._str,
                item_sku: bundle.child_sku,
                label: prod.product_name,
                sku_bundle:bundle.parent_sku,
                // brand: datafor.nama_brand,
                brand_id: prod.brand_id._str,
                data_bundle: dataorder.is_bundle,
                qty: parseInt(sku.qty)*parseInt(prod.qty),
                orderid: data.order_id.toString(),
                marketplace: data.marketplace,
                invoice_no: data.invoice_no,
                createdBy: Meteor.userId(),
                createdAt: new Date()
              })
              Session.set('emp',emp)
            }
            console.log('emp',Session.get('emp'))
            var update = allOrder.update({ '_id': data._id }, {
              $set: {
                checkboxstatus: true,
                comment:null,
                errorLog:0,
                checkstatusBy: Meteor.userId()
                // validasi1At: new Date(),
              }
            });
            return Session.get('emp')
          }
          else{
            var emp = []
            emp.push({
              transaksiid : data._id._str,
              item_sku: dataorder.product_sku,
              label: dataorder.product_name,
              brand: sku.brand,
              brand_id: dataorder.brand_id._str,
              data_bundle: 0,
              qty: parseInt(sku.qty),
              orderid: data.order_id.toString(),
              marketplace: data.marketplace,
              invoice_no: data.invoice_no,
              createdBy: Meteor.userId(),
              createdAt: new Date()
            })
            Session.set('emp',emp)
            console.log('emp',Session.get('emp'))
            var update = allOrder.update({ '_id': data._id }, {
              $set: {
                checkboxstatus: true,
                comment:null,
                errorLog:0,
                checkstatusBy: Meteor.userId()
                // validasi1At: new Date(),
              }
            });
            return Session.get('emp')
          }
          
        }
    
  },
  'getfail.product'() {
    return allOrder.find({ pickliststatus: false, checkboxstatus: false }).fetch()
  },

  'finddetail.total'(id) {
    var batch = batchListDetail.find({ 'batchid': id }, { sort: { 'invoice_no': -1, 'label_header': -1 } }).fetch();
    return batch

  },

  'checkdetailbundle'(sku,data) {
    var products = Product.findOne({'product_sku':sku})
    var order = allOrder.findOne({ invoice_no:data })
    if(!products){
        console.log('products',products)
        OrderErrorLogs.insert({
          trackingNo: order.tracking_no,
          orderid: order.order_id,
          invoice_no: order.invoice_no,
          marketplace: order.marketplace,
          store_id: order.store_id,
          brand: order.store_name,
          errorLog: 'Bundle product not found',
          statusLog : 5,
          item_sku: sku,
          typescan: 'Pick List',
          createdAt: new Date(),
          usedBy: Meteor.userId()
        })
        allOrder.update({ '_id': order._id }, {
          $set: {
            pickliststatus: false,
            errorLog : 5,
            comment: 'Bundle product not found',
            productavailablestatus: false,
            checkboxstatus: false,
            batchid: null,
          }
        });
      }
      
    return products
  },
  'checkbundle'(sku,data) {
    // console.log('data',data)
    var list = product_bundle.find({parent_sku:sku}, {}).fetch();
    console.log('lists',list.length)
    return list
  },
  'findpicklist'() {
    var list = allOrder.find({validasi1status: true, validasi2status: false, pickliststatus: false }, {}).fetch();
    return list

  },
  'finddetail.list'(id) {
    console.log('batchId:' + id);
    var batch = batchListDetail.find({ 'batchid': id }, { sort: { 'brand': -1, 'label': -1 }}).fetch();
    var batch2 = batchListDetail.aggregate([
      {
        $match: {
          batchid: id
        }
      },
      {
        $group: {
          _id: "$item_sku",
          sku_bundle:{$max:"$sku_bundle"},
          brand: { $max: "$brand" },
          brand_id: { $max: "$brand_id" },
          label: { $max: "$label" },
          totalsum: { $sum: "$qty" },
          orderid: { $max: "$orderid" },
          data_bundle: { $max: "$data_bundle" },
          invoice_no: { $sum: "$invoice_no" }
        }
      }
    ])
    console.log('batch2:' + batch2);
    return batch2

  },
  'batchlistorder.delete'(ids){
    console.log('id', ids)

    var id = new Mongo.ObjectID(ids._str)
    var data = allOrder.findOne({ '_id': id });
    if(data.pickliststatus === true  && data.validasi2status !== true ){
      console.log('picklist' , data );      
        var history = loghistory.insert({
          transactionid:id,
          order_id:data.order_id,
          invoice_no:data.invoice_no,
          sku_before:"",
          status:"Pick List",
          qty_before:data.qty,
          comment:"log delete order product",
          type:"delete",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        })
        console.log('create log',history)
        var order = allOrder.update({'_id': id},{
          $set:{
            checkboxstatus:false,
            batchid:"nll",
            pickliststatus:false,
          }
        })
        // console.log('orderall' ,order );
        var check = batchListDetail.findOne({ transaksiid: id._str }, {})
        if (check) {
          console.log('check', check)
          batchListDetail.remove({ transaksiid: id._str})
          var checkbatch = batchListDetail.find({ batchid: data.batchid }, {}).count()
            if (checkbatch === 0) {
              console.log('batch', checkbatch)
              batchList.remove({ _id: data.batchid })
            }
        }
      return history
    }
    // scan2 
    else if(data.validasi2status === true  ){
      console.log('scan2' , bft );
        var history = loghistory.insert({
          transactionid:id._str,
          order_id:data.order_id,
          invoice_no:data.invoice_no,
          sku_before:"",
          status:"Pick List",
          qty_before:data.qty,
          comment:"log delete order product",
          type:"delete",
          usedBy:Meteor.userId(),
          createdAt:new Date(),
        })
        console.log('create log',history)
        var order = allOrder.update({'_id': id},{
          $set:{
            checkboxstatus:false,
            batchid:"",
            pickliststatus:false,
          }
        })
        console.log('orderall' ,order );
        var check = batchListDetail.findOne({ transaksiid: id._str }, {})
        if (check) {
          console.log('check', check)
          batchListDetail.remove({ transaksiid: id._str})
          var checkbatch = batchListDetail.find({ batchid: data.batchid }, {}).count()
            if (checkbatch === 0) {
              console.log('batch', checkbatch)
              batchList.remove({ _id: data.batchid })
            }
        }
        var product = data.products
        for(let bft of product){
            var checkmovement = MovementProduct.findOne({ transaksi_id: id._str,item_sku:bft.item_sku }, {})
            if(checkmovement){
              console.log('checkmove', checkmovement)
              MovementProduct.remove({ transaksi_id: id,item_sku:bft.item_sku })
              var datas = {
                order_id:this.order_id,
                item_sku:bft.item_sku
              }
              HTTP.post('https://api-product.egogohub.tech/test/cancel-movement',
                  { data: datas },
                  function (err, res) {
                    console.log(res); // 4
                  });
            } 
        }
      return history
    }
    
  },
  'batchlistdetail.delete'(ids,bft) {
    console.log('test' , bft, ids );
    var id = new Mongo.ObjectID(ids._str) 
    var data = allOrder.findOne({ '_id': id });
    //picklist
    if(data.pickliststatus === true  && data.validasi2status !== true ){
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
        // var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
        //   $set:{
        //     "products.$.cancelstatus":true,
        //   }
        // })
        // console.log('orderall' ,order );
        var check = batchListDetail.findOne({ orderid: data.orderid,item_sku:bft.item_sku }, {})
        if (check) {
          console.log('check', check)
          batchListDetail.remove({ orderid: data.orderid,item_sku:bft.item_sku })
          var checkbatch = batchListDetail.find({ batchid: data.batchid }, {}).count()
            if (checkbatch === 0) {
              console.log('batch', checkbatch)
              batchList.remove({ _id: data.batchid })
            }
          var checkorder = batchListDetail.find({orderid: data.orderid}).count()
            if(checkorder === 0){
              var order = allOrder.update({'_id': id},{
                $set:{
                  checkboxstatus:false,
                  batchid:"",
                  pickliststatus:false,
                }
              })
            }
      }
      return history
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
        // var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
        //   $set:{
        //     "products.$.cancelstatus":true,
        //   }
        // })
        // console.log('orderall' ,order );
        var check = batchListDetail.findOne({ orderid: data.order_id,item_sku:bft.item_sku }, {})
        if (check) {
          console.log('check', check)
          batchListDetail.remove({ orderid: data.order_id,item_sku:bft.item_sku })
          var checkbatch = batchListDetail.find({ batchid: data.batchid }, {}).count()
            if (checkbatch === 0) {
              console.log('batch', checkbatch)
              batchList.remove({ _id: data.batchid })
            }
          var checkorder = batchListDetail.find({orderid: data.orderid}).count()
            if(checkorder === 0){
              var order = allOrder.update({'_id': id},{
                $set:{
                  checkboxstatus:false,
                  batchid:"",
                  pickliststatus:false,
                }
              })
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
      return history
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
      // var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
      //   $set:{
      //     "products.$.cancelstatus":true,
      //   }
      // })
      // console.log('orderall' ,order );
      return history
    }
  },
  'batchdetail.update'(ids,bft,aft,qtyafter) {
    // console.log('test' , bft , aft,id,qtyafter); 
    var id = new Mongo.ObjectID(ids)
    var data = allOrder.findOne({ '_id': id });
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
  'finddetailbyorder.list'(id,order) {
    console.log('batchId:' + id ,order);
    var data = batchListDetail.find({batchid:id,orderid:order}).count()
    console.log('data',data)
    var ord2 
    if(data === 0){
      ord2 = parseInt(order)
      console.log('tes',ord2)
    }
    else {
      ord2 = order
    }
    var batch2 = batchListDetail.aggregate([
      {
        $match: {
          $and:[
            {
              batchid: id
            },
            {
               orderid: ord2
            }
          ]
        }
      },
      {
        $group: {
          _id: "$item_sku",
          sku_bundle:{$max:"$sku_bundle"},
          item_sku:{$max:"$item_sku"},
          // label_header:{$addToSet:{lblheader:"$label_header"}},
          // item_sku :{$push:{sku:"$item_sku"}},
          // qty :{$push:{qty:"$qty"}},
          nama_brand: { $max: "$brand" },
          brand_id: { $max: "$brand_id" },
          label: { $max: "$label" },
          totalsum: { $sum: "$qty" },
          orderid: { $max: "$orderid" },
          transaksiid: { $max: "$transaksiid" },
          data_bundle: { $max: "$data_bundle" },
          invoice_no: { $max: "$invoice_no" }
        }
      }
    ])
    console.log('batch2:' + batch2);
    return batch2

  },
  'updateAcceptList'(id) {
    var order = batchList.findOne({ '_id': id });
    if (order) {
      return batchList.update({ '_id': id }, {
        $set: {
          acceptStatus: true,
          status: "accept",
          acceptAt: new Date(),
          acceptBy: Meteor.userId()
        }
      });
    }
  },

  'updateHandover'(id) {
    var order = batchList.findOne({ '_id': id });
    if (order) {
      return batchList.update({ '_id': id }, {
        $set: {
          handover: true,
          status: "handover",
          handoverAt: new Date(),
          handoverBy: Meteor.userId()
        }
      });
    }
  },
  'detailorder.dashboard'(batchid){
    var data = allOrder.find({'batchid': batchid}).fetch()
    console.log(data)
    return data
  },
  'updateCompleted'(id) {
    var order = allOrder.find({ 'batchid': id }).fetch();
    
    for(let data of order){
      var ord = allOrder.update({ '_id': data._id }, {
        $set: {
          completedStatus: true,
          // status:"completed",
          completedAt: new Date(),
          completedBy: Meteor.userId()
        }
      });
      console.log(ord)
  
    }
    if (order.length > 0) {
      return batchList.update({ '_id': id }, {
        $set: {
          completedStatus: true,
          status: "completed",
          completedAt: new Date(),
          completedBy: Meteor.userId()
        }
      });
    }
  },

  'updatecheckbox.true'(ids) {
    id = new Mongo.ObjectID(ids)
      return allOrder.update({ '_id': id }, {
        $set: {
          checkboxstatus: true,
          comment:null,
          errorLog:0,
          checkstatusBy: Meteor.userId()
          // validasi1At: new Date(),
        }
      });
  },
  'showhandover'(id) {
    var batch = batchList.findOne({ _id: id, acceptStatus: true, handover: { $ne: true } }, {})
    // console.log('batch',batch)
    return batch
  },
  'hideaccept'(id) {
    var batch = batchList.findOne({ _id: id, handover: true }, {})
    // console.log('batch',batch)
    return batch
  },

  'showcomplete'(id) {
    var batch = batchList.findOne({ _id: id, completedStatus: true }, {})
    // console.log('batch',batch)
    return batch
  },


  'updatecheckbox.false'(ids) {
    id = new Mongo.ObjectID(ids)
    var order = allOrder.findOne({ '_id': id });
    if (order) {
      return allOrder.update({ '_id': id }, {
        $set: {
          checkboxstatus: false,
          // validasi1At: new Date(),
          checkstatusBy: null
        }
      });
    }
  },
  'picklist.createbatchlist'(data) {
    // console.log('checkprod',res)
    var batch = batchList.insert({
      datelist: new Date(),
      createdBy: Meteor.userId(),
      // totaldetail: qty
    })

    batchListDetail.insert(res)
    allOrder.update({ 'order_id': data.order_id }, {
      $set: {
        pickliststatus: true,
        batchid: batch
      }
    });
    let datas = batchListDetail.insert(data)
    return datas
  },

  'picklist.error'(order, sku) {

    var checkhead = OrderErrorLogs.findOne({ 'invoice_no': order.invoice_no ,statusLog : 1,typescan: 'Pick List',item_sku: sku})
    if(checkhead){
      console.log('errorlog',checkhead)
      OrderErrorLogs.remove(checkhead)
    }
    console.log('not found on product ERP')
    OrderErrorLogs.insert({
      trackingNo: order.tracking_no,
      orderid: order.order_id,
      marketplace: order.marketplace,
      store_id: order.store_id,
      invoice_no: data.invoice_no,
      brand: order.store_name,
      errorLog: 'product not found',
      statusLog : 1,
      item_sku: sku.item_sku,
      typescan: 'Pick List',
      createdAt: new Date(),
      usedBy: Meteor.userId()
    });
    allOrder.update({ '_id': order._id }, {
      $set: {
        pickliststatus: false,
        errorLog : 1,
        comment: 'product not found',
        productavailablestatus: false,
        checkboxstatus: false,
        batchid: null,
      }
    });
    return false           // return list
  },

  'PickList.update'(data) {
    let iddata = data
    var batch = batchList.insert({
      datelist: new Date(),
      createdBy: Meteor.userId(),
    })
    console.log('batch', batch)
    for (let ids of iddata) {
      var id = ids.transaksiid
      var order = allOrder.findOne({ '_id': new Mongo.ObjectID(ids.transaksiid) });
      if (order) {
        if(order.errorLog == 0){
          allOrder.update({ '_id': new Mongo.ObjectID(id) }, {
            $set: {
              pickliststatus: true,
              batchid: batch
            }
          });
          var detail = batchListDetail.insert(ids)
          batchListDetail.update({'_id':detail},{
            $set:{batchid:batch}
          })
        }
      }
    }
    return batch
  },

  'PickList.update2'() {
    
    let order = allOrder.find({'validasi1status':true,'checkboxstatus':true,'checkstatusBy':Meteor.userId()}).fetch()
    console.log('order',order)
    var batch = batchList.insert({
      datelist: new Date(),
      createdBy: Meteor.userId(),
    })
    for(let data of order){
      let dataproduct = data.products
      
      console.log('batch', batch)
      for (let datas of dataproduct) {
        var prod = Product.findOne({product_sku:datas.item_sku})
        if (prod.is_bundle == 1) {
          var databundle = product_bundle.find({'parent_sku':prod.product_sku}).fetch()
          for(let bundles of databundle){
            var bundle = Product.findOne({'product_sku':bundles.child_sku})
            var detail = batchListDetail.insert({
                        transaksiid : data._id._str,
                        item_sku: bundles.child_sku,
                        label: bundle.product_name,
                        sku_bundle:prod.product_sku,
                        brand: datas.brand,
                        brand_id: bundle.brand_id._str,
                        data_bundle: prod.is_bundle,
                        qty: parseInt(datas.qty)*parseInt(bundles.qty),
                        orderid: data.order_id.toString(),
                        marketplace: data.marketplace,
                        invoice_no: data.invoice_no,
                        batchid:batch,
                        createdBy: Meteor.userId(),
                        createdAt: new Date()
                        })
          }
        }
        else{
          var prodsatuan = batchListDetail.insert({
                transaksiid : data._id._str,
                item_sku: prod.product_sku,
                label: prod.product_name,
                data_bundle: 0,
                qty: parseInt(datas.qty),
                orderid: data.order_id.toString(),
                brand: datas.brand,
                brand_id: prod.brand_id._str,
                marketplace: data.marketplace,
                invoice_no: data.invoice_no,
                batchid:batch,
                createdBy: Meteor.userId(),
                createdAt: new Date()
          })
        }
      }
      allOrder.update({ '_id': data._id }, {
        $set: {
          pickliststatus: true,
          batchid: batch,
          batchAt: new Date(),
          batchBy: Meteor.userId()
        }
      });
      
    }
    return batch
  },

  'batchdetail.update'(ids,bft,aft,qtyafter) {
    // console.log('test' , bft , aft,id,qtyafter); 
    var id = new Mongo.ObjectID(ids)
    var data = allOrder.findOne({ '_id': id });
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
          // var order = allOrder.update({'_id': id, 'products.item_sku': bft.item_sku},{
          //   $set:{
          //     'products.$.qty':qtyafter,
          //   }
          // })
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
          // var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
          //   $set:{
          //     "products.$.item_sku":aft.no_sku,
          //     "products.$.item_name":aft.label,
          //     "products.$.qty":parseInt(qtyafter),
          //   }
          // })
          // console.log('orderall' ,order );
    
        }
        return history
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
        // var order = allOrder.update({'_id': id, 'products.item_sku': bft.item_sku},{
        //   $set:{
        //     'products.$.qty':parseInt(qtyafter),
        //   }
        // })
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
        // var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
        //   $set:{
        //     "products.$.item_sku":aft.no_sku,
        //     "products.$.item_name":aft.label,
        //     "products.$.qty":parseInt(qtyafter),
        //   }
        // })
        // console.log('orderall' ,order );
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
        // var order = allOrder.update({'_id': id, 'products.item_sku': bft.item_sku},{
        //   $set:{
        //     'products.$.qty':parseInt(qtyafter),
        //   }
        // })
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
        // var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
        //   $set:{
        //     "products.$.item_sku":aft.no_sku,
        //     "products.$.item_name":aft.label,
        //     "products.$.qty":parseInt(qtyafter),
        //   }
        // })
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
              HTTP.post('https://api-product.egogohub.tech/cancel-movement',
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
      return history
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
        // var order = allOrder.update({'_id': id, 'products.item_sku': bft.item_sku},{
        //   $set:{
        //     'products.$.qty':parseInt(qtyafter),
        //   }
        // })  
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
        // var order = allOrder.update({'_id': id, "products.item_sku": bft.item_sku},{
        //   $set:{
        //     "products.$.item_sku":aft.no_sku,
        //     "products.$.item_name":aft.label,
        //     "products.$.qty":parseInt(qtyafter),
        //   }
        // })
      }
      return history
    }
  },
});

