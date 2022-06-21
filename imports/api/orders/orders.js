// Definition of the links collection

import { Mongo } from 'meteor/mongo';

export const ProductOrders = new Mongo.Collection('productOrders');
export const shipper = new Mongo.Collection('shipper_header');
export const MovementProduct = new Mongo.Collection('movementProduct');
export const OrderErrorLogs = new Mongo.Collection('orderErrorLogs');

export const loghistory = new Mongo.Collection('logHistory');
export const allOrder = new Mongo.Collection('allOrders');



export const TokpedOrders = new Mongo.Collection('tokpedOrders');
export const TokopediaOrders = new Mongo.Collection('tokopediaOrders');
export const TokpedOrderDetail = new Mongo.Collection('tokpedOrderDetail');
export const TokpedStatus = new Mongo.Collection('tokpedStatus');

export const ShopeeOrders = new Mongo.Collection('shopeeOrders');
export const ShopeeOrderDetail = new Mongo.Collection('shopeeOrderDetail');
export const ShopeeStatus = new Mongo.Collection('shopeeStatus');
export const ShopeeTracking = new Mongo.Collection('shopeeTracking');

export const LazadaOrders = new Mongo.Collection('lazadaOrders');
export const LazadaOrdersDetail = new Mongo.Collection('lazadaOrdersDetail');
export const LazadaStatus = new Mongo.Collection('lazadaStatus');
export const LazadaTracking = new Mongo.Collection('lazadaTracking');

export const BlibliOrders = new Mongo.Collection('blibliOrders');
export const BlibliOrderDetail = new Mongo.Collection('blibliOrderDetail');
export const BlibliStatus = new Mongo.Collection('blibliStatus');
export const BlibliTracking = new Mongo.Collection('blibliTracking');
export const BlibliOrdersItems = new Mongo.Collection('blibliOrdersItems');

export const BukalapakOrders = new Mongo.Collection('bukalapakOrders');
export const BukalapakOrderDetail = new Mongo.Collection('bukalapakOrderDetail');

export const ZaloraOrders = new Mongo.Collection('zaloraOrders');
export const ZaloraOrderDetail = new Mongo.Collection('zaloraOrderDetail');

export const JdidOrders = new Mongo.Collection('jdidOrders');
export const JdidOrderDetail = new Mongo.Collection('jdidOrderDetail');
//All Orders
export const SalesOrders = new Mongo.Collection('salesOrders');
export const SalesOrderDetail = new Mongo.Collection('salesOrderDetail');

