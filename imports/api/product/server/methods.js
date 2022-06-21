// Methods related to counseling

import { each } from 'jquery';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { logdailtstock, logdailystock, Lot, manualstock, Product, ProductCategories, ProductLot, ProductStock, ProductVariant, Stock, Variant } from '../product.js';
import { MovementProduct } from '../../orders/orders.js';

Meteor.methods({
  
  'getmovementbysku'(sku) {
    var products = MovementProduct.find({'product_sku':sku,movementType:"in",expiredAt:{$ne:null}},{$sort:{expiredAt:1}}).fetch()
  // console.log('test',products)
    return products
  } 
  ,
  'getproductbysku'(sku) {
    var products = Product.findOne({'product_sku':sku})
  console.log('test',products)
    return products
  },
  'getstockbysku'(id) {
    var products = ProductStock.findOne({'product_sku':id})
    //   console.log('test',products)
      return products
    },
  'getstock'(id) {
    var products = ProductStock.findOne({'product_id':id})
    //   console.log('test',products)
      return products
    },
  'stockin.save'(data, qty, status, expired,wh) {
      console.log('data', expired)
      var ins = manualstock.insert({
          product_id: data.product_id,
          product_sku: data.product_sku,
          product_name: data.product_name,
          brand_id: data.brand_id,
          category: status,
          qty: parseInt(qty),
          warehouseid: wh,
          insertTypeHeader: "in",
          expiredAt: expired != null ? new Date(expired) : null,
          createdBy: Meteor.userId(),
          createdAt: new Date()
      })
      return ins
  },
  'manualstock.save'(data, qty, status, expired) {
    console.log('data', data)
    var out = manualstock.insert({
      product_id: data.product_id,
      product_sku: data.product_sku,
      product_name: data.product_name,
      brand_id: data.brand_id,
      category: status,
      qty: parseInt(qty),
      insertTypeHeader: data.type,
      expiredAt: expired != null ? new Date(expired) : null,
      createdBy: Meteor.userId(),
      createdAt: new Date()
    })
    return out
  },
  'manualstocktransfer.save'(data, qty, status, from, to) {
    // console.log('data', data)
    var out = manualstock.insert({
      product_id: data.product_id,
      product_sku: data.product_sku,
      product_name: data.product_name,
      brand_id: data.brand_id,
      category: status,
      qty: parseInt(qty),
      insertTypeHeader: data.type,
      warehouseidFrom:from,
      warehouseidTo:to,
      createdBy: Meteor.userId(),
      createdAt: new Date()
    })

    return out
  }

  ,
  'manualstockin.update'(id, expired, qty, status,wh) {
    console.log('data', status)
    console.log('data', id)
    var out = manualstock.update({ '_id': id }, {
      $set: {
        category: status,
        warehouseid: wh,
        qty: parseInt(qty),
        expiredAt: expired != null ? new Date(expired) : null,
        updateBy: Meteor.userId(),
        updateAt: new Date()
      }
    })
    return out
  },
  'manualstocktransfer.update'(id, qty, status,from,to) {
    console.log('data', status)
    console.log('data', id)
    var out = manualstock.update({ '_id': id }, {
      $set: {
        category: status,
        qty: parseInt(qty),
        warehouseidFrom:from,
        warehouseidTo:to,
        updateBy: Meteor.userId(),
        updateAt: new Date()
      }
    })
    return out
  },
  'manualstock.update'(id, expired, qty, status) {
    console.log('data', status)
    console.log('data', id)
    var out = manualstock.update({ '_id': id }, {
      $set: {
        category: status,
        qty: parseInt(qty),
        expiredAt: expired != null ? new Date(expired) : null,
        updateBy: Meteor.userId(),
        updateAt: new Date()
      }
    })
    return out
  },
//   'countin.stock'() {
//     return manualstock.find({ finalstatus: { $eq: true }, $or: [{ category: 'innew' }, { category: 'inreturn' }] }).count()
//   },
//   'countout.stock'() {
//     var data = manualstock.find({ finalstatus: { $eq: true }, $or: [{ category: 'outkol' }, { category: 'outwithdrawal' }, { category: 'outincomplete' }] }).count()
//     console.log('data',data)
//     return  data 
//   },
//   'countbroken.stock'() {
//     return manualstock.find({ finalstatus: { $eq: true }, $or: [{ category: 'outbroken' }, { category: 'outbrokenpackage' }] }).count()
//   },
//   'counttransfer.stock'() {
//     var data = manualstock.find({ finalstatus: { $eq: true }, category: 'transfer' }).count()
//     // console.log('data',data)
//     return  data
//  },
  'stockin.submit-update'() {
    var stock = manualstock.find({ finalstatus: { $ne: true }, $or: [{ category: 'innew' }, { category: 'inreturn' }] }).fetch()
    console.log('stock',stock)
    if (stock) {
      var array = []
      var typemove ="" 
      for (let data of stock) {  
        manualstock.update({ '_id': data._id }, {
          $set: {
            finalstatus: true,
            finalupdateBy: Meteor.userId(),
            finalupdateAt: new Date(),
          }
        })
        MovementProduct.insert({
          transaksi_id: data._id,
          product_sku: data.product_sku,
          brand_id: data.brand_id,
          qty: parseInt(data.qty),
          movementCategory: data.category,
          expiredAt: data.expiredAt != null ? new Date(data.expiredAt) : null,
          movementType: data.insertTypeHeader,
          createdAt: new Date(),
          createdBy: Meteor.userId()
        });

        var prod = ProductStock.findOne({product_sku: data.product_sku })

        var dateNow = moment(new Date()).format("YYYY-MMM-DD");

        var startDate1 = moment.utc(dateNow);
        var endDate1 = moment.utc(dateNow).add(24, 'hour');

        var sd1 = moment.utc(startDate1).toISOString();
        var ed1 = moment.utc(endDate1).toISOString();


        // console.log('dn:' + dateNow + ' sd:' + startDate + ' ed:' + endDate);
        // console.log('dn:' + dateNow + ' sd1:' + sd1 + ' ed1:' + ed1);

        var startDate = new Date(sd1);
        var endDate = new Date(ed1);
        var logstock = logdailystock.findOne({'product_sku':data.product_sku,'updatedAt':{ $gte: startDate, $lt: endDate }},{sort:{updatedAt:-1}})
        console.log('logstock',logstock)
          if(logstock){
            logdailystock.update({'product_sku': data.product_sku, _id:logstock._id },{
              $set:{
                stock:prod.stock + data.qty,
                updatedBy:Meteor.userId(),
                updatedAt:new Date(),
              }
            })
          }
          else{
            // console.log('date log',logdate)
            logdailystock.insert({
              product_id:data.product_id,
              product_sku:data.product_sku,
              brand_id:data.brand_id,
              updatedAt:new Date(),
              createdAt:new Date(),
              createdBy:Meteor.userId(),
              updatedBy:Meteor.userId(),
              stock:prod.stock + data.qty
            })
          }
        ProductStock.update({'product_sku': data.product_sku,'product_id':data.product_id },{
          $set:{
            stock:prod.stock + data.qty
          }
        })
      }
      return stock
    }
  },
  'stock.submit-update'() {
    var stock = manualstock.find({ finalstatus: { $ne: true }, $or: [{ category: 'outkol' }, { category: 'outwithdrawal' }, { category: 'outincomplete' },{ category: 'outsample' },{ category: 'outclaimgaransi' }] }).fetch()
    console.log(stock)
    var typemove = 0
    if (stock) {
      var array = []
      for (let data of stock) {
        manualstock.update({ '_id': data._id }, {
          $set: {
            finalstatus: true,
            finalupdateBy: Meteor.userId(),
            finalupdateAt: new Date(),
          }
        })
        MovementProduct.insert({
          transaksi_id: data._id,
          product_sku: data.product_sku,
          brand_id: data.brand_id,
          qty: parseInt(data.qty),
          movementCategory: data.category,
          expiredAt: data.expiredAt != null ? new Date(data.expiredAt) : null,
          movementType: data.insertTypeHeader,
          createdAt: new Date(),
          createdBy: Meteor.userId()
        });

          var prod = ProductStock .findOne({product_sku: data.product_sku })

          var dateNow = moment(new Date()).format("YYYY-MMM-DD");
  
          var startDate1 = moment.utc(dateNow);
          var endDate1 = moment.utc(dateNow).add(24, 'hour');
  
          var sd1 = moment.utc(startDate1).toISOString();
          var ed1 = moment.utc(endDate1).toISOString();
  
  
          // console.log('dn:' + dateNow + ' sd:' + startDate + ' ed:' + endDate);
          // console.log('dn:' + dateNow + ' sd1:' + sd1 + ' ed1:' + ed1);
  
          var startDate = new Date(sd1);
          var endDate = new Date(ed1);
          var logstock = logdailystock.findOne({'product_sku':data.product_sku,'updatedAt':{ $gte: startDate, $lt: endDate }},{sort:{updatedAt:-1}})
          // console.log('logstock',logstock)
            if(logstock){
              logdailystock.update({'product_sku': data.product_sku, _id:logstock._id },{
                $set:{
                  stock:prod.stock - data.qty,
                  updatedAt:new Date(),
                  updatedBy:Meteor.userId(),
                }
              })
            }
            else{
              // console.log('date log',logdate)
              logdailystock.insert({
                transaksi_id: data._id,
                product_sku: data.product_sku,
                brand_id: data.brand_id,
                createdAt:new Date(),
                createdBy:Meteor.userId(),
                updatedAt:new Date(),
                updatedBy:Meteor.userId(),
                stock:prod.stock - data.qty,
              })
            }
          ProductStock.update({'product_sku': data.product_sku,'product_id': data.product_id },{
            $set:{
              stock:prod.stock - data.qty
            }
          })
        }
      return stock
    }
  }, 
  'stockbroken.submit-update'() {
    var stock = manualstock.find({ finalstatus: { $ne: true }, $or: [{ category: 'outbroken' }, { category: 'outbrokenpackage' }] }).fetch()
    console.log(stock)
    if (stock) {
      var array = []
      for (let data of stock) {
        manualstock.update({ '_id': data._id }, {
          $set: {
            finalstatus: true,
            finalupdateBy: Meteor.userId(),
            finalupdateAt: new Date(),
          }
        })
        MovementProduct.insert({
          transaksi_id: data._id,
          product_sku: data.product_sku,
          brand_id: data.brand_id,
          qty: parseInt(data.qty),
          expiredAt: data.expiredAt != null ? new Date(data.expiredAt) : null,
          movementCategory: data.category,
          movementType: data.insertTypeHeader,
          createdAt: new Date(),
          createdBy: Meteor.userId()
        });

          var prod = ProductStock.findOne({product_sku: data.product_sku })

          var dateNow = moment(new Date()).format("YYYY-MMM-DD");
  
          var startDate1 = moment.utc(dateNow);
          var endDate1 = moment.utc(dateNow).add(24, 'hour');
  
          var sd1 = moment.utc(startDate1).toISOString();
          var ed1 = moment.utc(endDate1).toISOString();
  
  
          // console.log('dn:' + dateNow + ' sd:' + startDate + ' ed:' + endDate);
          // console.log('dn:' + dateNow + ' sd1:' + sd1 + ' ed1:' + ed1);
  
          var startDate = new Date(sd1);
          var endDate = new Date(ed1);
          var logstock = logdailystock.findOne({'product_sku':data.item_sku,'updatedAt':{ $gte: startDate, $lt: endDate }},{sort:{updatedAt:-1}})
          // console.log('logstock',logstock)
            if(logstock){
              logdailystock.update({'product_sku': data.product_sku, _id:logstock._id },{
                $set:{
                  stock:prod.stock - data.qty,
                  updatedAt:new Date(),
                  updatedBy:Meteor.userId(),
                }
              })
            }
            else{
              // console.log('date log',logdate)
              logdailystock.insert({
                transaksi_id: data._id,
                product_sku: data.product_sku,
                brand_id: data.brand_id,
                createdAt:new Date(),
                createdBy:Meteor.userId(),
                updatedAt:new Date(),
                updatedBy:Meteor.userId(),
                stock:prod.stock - data.qty,
              })
            }
          ProductStock.update({'product_sku': data.product_sku,'product_id': data.product_id },{
            $set:{
              stock:prod.stock - data.qty
            }
          })
        
      }
      return stock
    }
  },
  'stocktransfer.submit-update'() {
    var stock = manualstock.find({ finalstatus: { $ne: true }, category: 'transfer' }).fetch()
    console.log(stock)
    if (stock) {
      var array = []
      for (let data of stock) {
        manualstock.update({ '_id': data._id }, {
          $set: {
            finalstatus: true,
            finalupdateBy: Meteor.userId(),
            finalupdateAt: new Date(),
          }
        })
        MovementProduct.insert({
          transaksi_id: data._id,
          product_sku: data.product_sku,
          brand_id: data.brand_id,
          expiredAt: data.expiredAt != null ? new Date(data.expiredAt) : null,
          qty: parseInt(data.qty),
          movementCategory: data.category,
          movementType: data.insertTypeHeader,
          createdAt: new Date(),
          createdBy: Meteor.userId()
        });

          var prod = ProductStock.findOne({product_sku: data.product_sku })

          var dateNow = moment(new Date()).format("YYYY-MMM-DD");
  
          var startDate1 = moment.utc(dateNow);
          var endDate1 = moment.utc(dateNow).add(24, 'hour');
  
          var sd1 = moment.utc(startDate1).toISOString();
          var ed1 = moment.utc(endDate1).toISOString();
  
  
          // console.log('dn:' + dateNow + ' sd:' + startDate + ' ed:' + endDate);
          // console.log('dn:' + dateNow + ' sd1:' + sd1 + ' ed1:' + ed1);
  
          var startDate = new Date(sd1);
          var endDate = new Date(ed1);
          var logstock = logdailystock.findOne({'product_sku':data.product_sku,'updatedAt':{ $gte: startDate, $lt: endDate }},{sort:{updatedAt:-1}})
          // console.log('logstock',logstock)
            if(logstock){
              logdailystock.update({'product_sku': data.product_sku, _id:logstock._id },{
                $set:{
                  stock:prod.stock - data.qty,
                  updatedAt:new Date(),
                  updatedBy:Meteor.userId(),
                }
              })
            }
            else{
              // console.log('date log',logdate)
              logdailystock.insert({
                transaksi_id: data._id,
                product_sku: data.product_sku,
                brand_id: data.brand_id,
                createdAt:new Date(),
                createdBy:Meteor.userId(),
                updatedAt:new Date(),
                updatedBy:Meteor.userId(),
                stock:prod.prod - data.qty,
              })
            }
          ProductStock.update({'product_sku': data.product_sku,'product_id': data.product_id },{
            $set:{
              stock:prod.stock - data.qty
            }
          })
      }
      return stock
    }
  },
  'manualstock.delete'(id) {
    var stock = manualstock.findOne({ '_id': id })
    return manualstock.remove(stock)

  },
});
