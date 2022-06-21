// All links-related publications
import { ReactiveTable } from 'meteor/aslagle:reactive-table';
import { Meteor } from 'meteor/meteor';
import { Product } from '../../product/product.js';
import {
  shipper,
  MovementProduct,
  TokopediaOrders,
  ShopeeOrders,
  LazadaOrders,
  BlibliOrders,
  ShopeeOrderDetail,
  BukalapakOrders,
  JdidOrders,
  ZaloraOrders,
  TokpedOrderDetail,
  LazadaOrdersDetail,
  BlibliOrderDetail,
  BukalapakOrderDetail,
  JdidOrderDetail,
  ZaloraOrderDetail,
  OrderErrorLogs,
  allOrder,
  users,
  usersone,
  
} from '../orders.js';

ReactiveTable.publish('movementProduct', MovementProduct, function () {
  return {
    // sort: { 'createAt': -1 }
  }
}, {})
ReactiveTable.publish('Product', Product, function () {
  return {
    // validasi1status: true, pickliststatus: false,
    is_bundle: { $eq: 0 }, status_active:{$eq:1} 
  }
}, {})

ReactiveTable.publish('allOrder', allOrder, function () {
  return { $or: [{ internal_status: 'PROCESSED' }, { internal_status: 'VALIDATED' }], validasi1status: false }
}, {})

ReactiveTable.publish('allOrderDate', allOrder, function () {
  var date = new Date();
  var dateNow = moment(date).format("YYYY-MMM-DD");

  // var startDate1 = moment.utc(dateNow).subtract(24, 'hour');

  var startDate1 = moment.utc(dateNow);
  var endDate1 = moment.utc(dateNow).add(24, 'hour');

  var sd1 = moment.utc(startDate1).toISOString();
  var ed1 = moment.utc(endDate1).toISOString();

  var startDate = new Date(sd1);
  var endDate = new Date(ed1);
  return { 'internal_status': 'VALIDATED', 'validasi1status': false, 'create_date': { $gte: startDate, $lt: endDate } }

}, {})

ReactiveTable.publish('allorderforCancel', allOrder, function () {
  var d = new Date();
  d.setDate(d.getDate() - 14);
  return {
    // validasi1status: { $exists: false }, create_date: { $gt: d }
    // validasi1status: { $exists: false },
    create_date: { $gte: d },
    internal_status: { $ne: 'DRAFT' }
    // internalStatus: 

    // validasi1status: false
  }
  // , { limit: 100 };
}, {})

ReactiveTable.publish('scan1', allOrder, function () {

  return {
    validasi1status: true, validasi2status: false, pickliststatus: false
  }
}, {})

ReactiveTable.publish('batchCompleted', allOrder, function () {

  return { validasi1status: true, validasi2status: false, completedStatus: true }
}, {})

ReactiveTable.publish('scan2', allOrder, function () {

  return { $or: [{ internal_status: 'PROCESSED' }, { internal_status: 'VALIDATED' }], validasi2status: true }
}, {})

ReactiveTable.publish('pickscan1', allOrder, function () {

  return {
    validasi1status: true, pickliststatus: false,
    internal_status: { $ne: 'CANCELED' }
  }
}, {})

ReactiveTable.publish('logserror', OrderErrorLogs, function () {

  return { typescan: 1 }
}, {})
ReactiveTable.publish('reportdata', allOrder, function () {

  return { validasi2status: true }
}, {})

Meteor.publish('allOrders.validate1', function () {
  return allOrder.find({
    'validasi1status': true, 'pickliststatus': false, 'validasi2status': false
  }, { sort: { 'create_date': -1 }, limit: 50 });
});
Meteor.publish('allOrders.picklist', function () {
  return allOrder.find({
    'pickliststatus': true, 'validasi2status': false
  }, { sort: { 'create_date': -1 }, limit: 50 });
});
Meteor.publish('allOrders.validate2', function () {
  return allOrder.find({
    'validasi2status': true, 'internal_status': 'PROCESSED'
  }, { sort: { 'create_date': -1 }, limit: 50 });
});

Meteor.publish('shipperFind.all', function () {
  return shipper.find({});
});

Meteor.publish('errorLogOrder_picklist.100', function () {
  return OrderErrorLogs.find({ 'typescan': "Pick List" }, { sort: { 'createdAt': -1 }, limit: 100 });
});
Meteor.publish('errorLogOrder_scan1.100', function () {
  return OrderErrorLogs.find({ 'typescan': 1 }, { sort: { 'createdAt': -1 }, limit: 100 });
});
Meteor.publish('errorLogOrder_scan2.100', function () {
  return OrderErrorLogs.find({ 'typescan': 2 }, { sort: { 'createdAt': -1 }, limit: 100 });
});
Meteor.publish('movementprod.15', function () {
  return MovementProduct.find({}, { sort: { 'createdAt': -1 }, limit: 100 });
});

Meteor.publish('allorderscan.1000', function () {
  return allOrder.find({}, { sort: { 'updateAt': -1 }, limit: 1000 });
});
Meteor.publish('userList', function () {
  return Meteor.users.find({});
});