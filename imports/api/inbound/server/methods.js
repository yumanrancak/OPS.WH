// Methods related to links

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
// import { check } from 'meteor/check';
import { loginbound } from '../inbound';
import { Notification } from '../../notification/notification.js';
import { MovementProduct } from '../../orders/orders';
// import { ExternalStore } from '../../externalStore/externalStore';
// import { result } from 'lodash';


Meteor.methods({
  'showbyid.approve'(id){
    // console.log('id',id)
    return loginbound.find({'_id':id},{}).fetch()
  }
  ,
  'showbyid.check'(id){
    // console.log('id',id)
    return loginbound.findOne({'_id':id},{})
  }
  ,

  'updateinbound.check'(id,check){
    var upd = loginbound.update({ '_id': id }, {
      $set: {
        detailupload: check
      }
    })
    console.log('Data Inbound update check data')
    return upd
  }
  ,
  'inbound.update'(id, approve, approvedate, approveby, warehouse) {
    loginbound.update({ '_id': id }, {
      $set: {
        approve: approve,
        approvedate: approvedate,
        approveby: approveby,
        warehouse: warehouse
      }
    })
    var inboud = loginbound.findOne({'_id':id})
    var product = inboud.detailupload
    if(product){
      for(let data of product){
        if (data){
          console.log('data1',product.length)
          var tes = MovementProduct.insert({
            transaksi_id:id,
            deliveryorder: inboud.deliveryorder,
            brandId: data.Brand,
            koil: inboud.koil,
            item_sku: data.itemsku,
            qty: parseInt(data.qty),
            category: 'bookingdo',
            insertTypeHeader: 'in',
            createdAt: new Date(),
            usedBy: Meteor.userId()
          })
          console.log('data',tes)
          
          Meteor.call("agregateMovement.product",data.itemsku)  
        }
      }
    }
    console.log('UPDATE INBOUND SUCCESS');
    var uid = Meteor.userId();
    //user notif
    Notification.insert({
      from: uid,
      to: 'warehouse',
      inboundId: id,
      msg: 'New Inbound Approved, Please Check your Assignment!',
      categoryNotification: "inbound",
      statusRead: false,
      statusAdmin: false,
      createdAt: new Date(),
    });
    //admin Notif
    Notification.insert({
      from: uid,
      to: '',
      inboundId: id,
      msg: 'New Inbound Approved!',
      categoryNotification: "inbound",
      statusRead: false,
      statusAdmin: true,
      createdAt: new Date(),
    });
  },

  'upload.data'(data) {
    console.log('data', data.detailupload);
    var file = loginbound.findOne({ 'file': data.file });
    console.log('file', file)
    loginbound.insert({
      dateprocessed: new Date(data.dateprocessed),
      deliveryorder: data.deliveryorder,
      shipper: data.shipper,
      brand: data.brand,
      koli: data.koli,
      file: data.file,
      detailupload: data.detailupload,
      status: "Sukses Simpan",
      approve: "none",
      createdAt: new Date(),
      createdBy: Meteor.userId()
    });
    var data = "simpan"
    return data;
    // if(!file){
    //   loginbound.insert({
    //     dateprocessed: data.dateprocessed,
    //     deliveryorder: data.deliveryorder,
    //     shipper: data.shipper,
    //     brand:data.brand,
    //     koli: data.koli,
    //     file: data.file,
    //     detailupload: data.detailupload,
    //     status: "Sukses Simpan",
    //     approve: "none",
    //     createdAt: new Date(),
    //     createdBy: Meteor.userId()
    //   });  
    //   var data = "simpan"
    //   return data;
    // }
    // else {
    //   loginbound.update({ '_id': file._id},{
    //     $set:{
    //       dateprocessed: data.dateprocessed,
    //       deliveryorder: data.deliveryorder,
    //       shipper: data.shipper,
    //       brand:data.brand,
    //       koli: data.koli,
    //       file: data.file,
    //       detailupload: data.detailupload,
    //       status: "Sukses Update",
    //       createdAt: new Date(),
    //       createdBy: Meteor.userId()
    //     }
    //   });
    //   var data = "update"
    //   return data;  
    // }
  },
});
