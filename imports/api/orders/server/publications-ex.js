// // All links-related publications
// import { ReactiveTable } from 'meteor/aslagle:reactive-table';
// import { Meteor } from 'meteor/meteor';
// import {
//   shipper,
//   MovementProduct,
//   TokopediaOrders,
//   ShopeeOrders,
//   LazadaOrders,
//   BlibliOrders,
//   ShopeeOrderDetail,
//   BukalapakOrders,
//   JdidOrders,
//   ZaloraOrders,
//   TokpedOrderDetail,
//   LazadaOrdersDetail,
//   BlibliOrderDetail,
//   BukalapakOrderDetail,
//   JdidOrderDetail,
//   ZaloraOrderDetail,
//   OrderErrorLogs,
//   allOrder

// } from '../orders.js';


// ReactiveTable.publish('AllMP',TokopediaOrders, function () { 
//   // const log = new Mongo.Collection(loginbound.find({ 'approve': 'none' }, { sort: { 'createdAt': -1 } }));

//   return 
// }, {})

// //Tokped Orders
// Meteor.publish('shipperFind.all', function () {
//   return shipper.find({});
// });

// Meteor.publish('errorLogOrder.100', function () {
//   return OrderErrorLogs.find({}, { sort: { 'createdAt': -1 }, limit: 100 });
// });
// Meteor.publish('movementprod.15', function () {
//   return MovementProduct.find({},{ sort: { 'createdAt': -1 }, limit: 100 });
// });

// Meteor.publish('allorderscan.100', function () {
//   return allOrder.find({},{ sort: { 'updateAt': -1 }, limit: 100 });
// });

// //Tokped Orders
// Meteor.publish('tokpedOrdersNew.15', function () {
//   return TokopediaOrders.find({ 'internal_status': 'COMPLETED' }, { sort: { 'createdAt': -1 }, limit: 15 });
// });
// Meteor.publish('tokopediaOrdersScan.15', function () {
//   return TokopediaOrders.find({ 'validasi1status': true }, { sort: { 'updateAt': -1 }, limit: 15 })
// });
// Meteor.publish('tokpedOrdersDetailNew.15', function () {
//   return TokpedOrderDetail.find({ 'internal_status': 'COMPLETED' }, { sort: { 'createdAt': -1 }, limit: 100 });
// });
// Meteor.publish('tokpedOrdersFulfill.15', function () {
//   return TokopediaOrders.find({ $or: [{ internal_status: 'COMPLETED' }, { internal_status: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
// });
// Meteor.publish('tokpedOrdersDetailFulfill.15', function () {
//   return TokpedOrderDetail.find({ $or: [{ internal_status: 'COMPLETED' }, { internal_status: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 100 });
// });


// //Shopee Orders
// Meteor.publish('shopeeOrdersNew.15', function () {
//   return ShopeeOrders.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
// });
// Meteor.publish('shopeeOrders.all', function () {
//   return ShopeeOrders.find();
// });
// Meteor.publish('shopeeOrdersScan.15', function () {
//   return ShopeeOrders.find({ 'validasi1status': true }, { sort: { 'updateAt': -1 }, limit: 15 })
// });
// Meteor.publish('shopeeOrdersDetailNew.15', function () {
//   return ShopeeOrderDetail.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 100 });
// });
// Meteor.publish('shopeeOrdersFulfill.15', function () {
//   return ShopeeOrders.find({ $or: [{ internal_status: 'PROCESSED' }, { internal_status: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
// });
// Meteor.publish('shopeeOrderDetail.id', function (id) {
//   return ShopeeOrderDetail.find({ '_id': id });
// });

// // Lazada Orders
// Meteor.publish('lazadaOrdersNew.15', function () {
//   return LazadaOrders.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
// });
// Meteor.publish('lazadaOrdersScan.15', function () {
//   return LazadaOrders.find({ 'validasi1status': true }, { sort: { 'updateAt': -1 }, limit: 15 })
// });
// Meteor.publish('lazadaOrders.all', function () {
//   return LazadaOrders.find();
// });
// Meteor.publish('lazadaOrdersDetailNew.15', function () {
//   return LazadaOrdersDetail.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 100 });
// });
// Meteor.publish('lazadaOrdersFulfill.15', function () {
//   return LazadaOrders.find({ $or: [{ internal_status: 'PROCESSED' }, { internal_status: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
// });

// //Blibli Orders
// Meteor.publish('blibliOrdersNew.15', function () {
//   return BlibliOrders.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
// });
// Meteor.publish('blibliOrders.all', function () {
//   return BlibliOrders.find();
// });
// Meteor.publish('blibliOrdersScan.15', function () {
//   return BlibliOrders.find({ 'validasi1status': true }, { sort: { 'updateAt': -1 }, limit: 15 })
// });
// Meteor.publish('blibliOrdersDetailNew.15', function () {
//   return BlibliOrderDetail.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 100 });
// });
// Meteor.publish('blibliOrdersFulfill.15', function () {
//   return BlibliOrders.find({ $or: [{ internal_status: 'PROCESSED' }, { internal_status: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
// });

// //Bukalapak Orders
// Meteor.publish('bukalapakOrdersNew.15', function () {
//   return BukalapakOrders.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
// });

// Meteor.publish('bukalapakOrdersScan.15', function () {
//   return BukalapakOrders.find({ 'validasi1status': true }, { sort: { 'updateAt': -1 }, limit: 15 })
// });
// Meteor.publish('bukalapakOrders.all', function () {
//   return BukalapakOrders.find();
// });
// Meteor.publish('bukalapakOrdersDetailNew.15', function () {
//   return BukalapakOrderDetail.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
// });
// Meteor.publish('bukalapakOrdersFulfill.15', function () {
//   return BukalapakOrders.find({ $or: [{ internal_status: 'PROCESSED' }, { internal_status: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
// });

// //JDid Orders
// Meteor.publish('jdidOrdersNew.15', function () {
//   return JdidOrders.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
// });
// Meteor.publish('jdidOrders.all', function () {
//   return JdidOrders.find();
// });
// Meteor.publish('jdidOrdersScan.15', function () {
//   return JdidOrders.find({ 'validasi1status': true }, { sort: { 'updateAt': -1 }, limit: 15 })
// });
// Meteor.publish('jdidOrdersDetailNew.15', function () {
//   return JdidOrderDetail.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
// });
// Meteor.publish('jdidOrdersFulfill.15', function () {
//   return JdidOrders.find({ $or: [{ internal_status: 'PROCESSED' }, { internal_status: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
// });

// //Zalora Orders
// Meteor.publish('zaloraOrdersNew.15', function () {
//   return ZaloraOrders.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
// });
// Meteor.publish('zaloraOrders.all', function () {
//   return ZaloraOrders.find();
// });
// Meteor.publish('zaloraOrdersScan.15', function () {
//   return ZaloraOrders.find({ 'validasi1status': true }, { sort: { 'updateAt': -1 }, limit: 15 })
// });
// Meteor.publish('zaloraOrdersDetailNew.15', function () {
//   return ZaloraOrderDetail.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
// });
// Meteor.publish('zaloraOrdersFulfill.15', function () {
//   return ZaloraOrders.find({ $or: [{ internal_status: 'PROCESSED' }, { internal_status: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
// });