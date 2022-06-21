// Methods related to links

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
// import { check } from 'meteor/check';
import {
  TokopediaOrders,
  ShopeeOrders,
  LazadaOrders,
  BukalapakOrders,
  BlibliOrders,
  ZaloraOrders,
  JdidOrders,
  allOrder,
  MovementProduct,

} from '../../orders/orders.js';
// import { InternalStatus } from '../../internalStatus/internalStatus.js';
import {
  AgregateOrders,
  AgregateFulfillment,
  AgregateFulfillmentDay,
  // AgregateBlibli,
  // AgregateBukalapak,
  // AgregateJdid,
  // AgregateLazada,
  // AgregateShopee,
  // AgregateTokopedia,
  // AgregateZalora,
  AgregateSumOrders
} from '../agregate.js';
// import { result } from 'lodash';


Meteor.methods({

  'agregateAll.update'() {
    console.log('Agregate All Start');
    // AgregateAll.agregate()
    var result = AgregateOrders.aggregate(
      [
        {
          $group:
          {
            _id: "$status",
            NewOrder: { $sum: "$NewOrder" },
            Process: { $sum: "$Process" },
            Shipping: { $sum: "$Shipping" },
            Delivered: { $sum: "$Delivered" },
            Completed: { $sum: "$Completed" },
            Canceled: { $sum: "$Canceled" },
            Returned: { $sum: "$Returned" },
            Refunded: { $sum: "$Refunded" },

          }
        },
      ]
    )
    // console.log(result[0]);
    var id = AgregateSumOrders.findOne();
    if (id) {
      AgregateSumOrders.update({ _id: id._id }, {
        $set: {
          NewOrder: result[0].NewOrder,
          Process: result[0].Process,
          Shipping: result[0].Shipping,
          Delivered: result[0].Delivered,
          Completed: result[0].Completed,
          Canceled: result[0].Canceled,
          Returned: result[0].Returned,
          Refunded: result[0].Refunded,
          updatedAt: new Date()
        }
      })
    } else {
      AgregateSumOrders.insert({
        NewOrder: result[0].NewOrder,
        Process: result[0].Process,
        Shipping: result[0].Shipping,
        Delivered: result[0].Delivered,
        Completed: result[0].Completed,
        Canceled: result[0].Canceled,
        Returned: result[0].Returned,
        Refunded: result[0].Refunded,
        createdAt: new Date()
      })
    }

  },
  'agregateAllOrders.update'(mp) {
    console.log('Agregate MP Start: ' + mp);
    var countNewOrder = allOrder.find({ 'internal_status': 'VALIDATED', 'marketplace': mp }).count();
    var countProcess = allOrder.find({ 'internal_status': 'PROCESSED', 'marketplace': mp }).count();
    var countShipping = allOrder.find({ 'internal_status': 'SHIPPING', 'marketplace': mp }).count();
    var countDelivered = allOrder.find({ 'internal_status': 'DELIVERED', 'marketplace': mp }).count();
    var countCompleted = allOrder.find({ 'internal_status': 'COMPLETED', 'marketplace': mp }).count();
    var countCancel = allOrder.find({ 'internal_status': 'CANCELED', 'marketplace': mp }).count();
    var countReturn = allOrder.find({ 'internal_status': 'RETURNED', 'marketplace': mp }).count();
    var countRefund = allOrder.find({ 'internal_status': 'REFUNDED', 'marketplace': mp }).count();
    var id = AgregateOrders.findOne({ 'Marketplace': mp });
    // console.log('agreagate tokped' + id);
    if (id) {
      AgregateOrders.update({ _id: id._id }, {
        $set: {
          NewOrder: countNewOrder,
          Process: countProcess,
          Shipping: countShipping,
          Delivered: countDelivered,
          Completed: countCompleted,
          Canceled: countCancel,
          Returned: countReturn,
          Refunded: countRefund,
          Status: true,
          updatedAt: new Date()
        }
      })
    } else {
      AgregateOrders.insert({
        Marketplace: mp,
        NewOrder: countNewOrder,
        Process: countProcess,
        Shipping: countShipping,
        Delivered: countDelivered,
        Completed: countCompleted,
        Canceled: countCancel,
        Returned: countReturn,
        Refunded: countRefund,
        updatedAt: new Date()
      })
    }
  },

  'agregateAllFufillment.update'() {
    console.log('Agregate Fufillment Start');
    var countNewOrder = allOrder.find({ 'internal_status': 'VALIDATED', 'validasi1status': false }).count();
    var countValidate1 = allOrder.find({ 'validasi1status': true, 'pickliststatus': false, 'validasi2status': false }).count();
    var countPicklist = allOrder.find({ 'pickliststatus': true, 'validasi2status': false }).count();
    var countValidate2 = allOrder.find({ 'validasi2status': true, 'internal_status': 'PROCESSED' }).count();
    var countShipping = allOrder.find({ $or: [{ 'internal_status': 'DELIVERED' }, { 'internal_status': 'SHIPPING' }] }).count();
    var countComplete = allOrder.find({ $or: [{ 'internal_status': 'COMPLETED' }] }).count();
    var countCancel = allOrder.find({ $or: [{ 'internal_status': 'CANCELED' }] }).count();
    var countReturn = allOrder.find({ $or: [{ 'internal_status': 'RETURNED' }] }).count();
    var countRefund = allOrder.find({ $or: [{ 'internal_status': 'REFUNDED' }] }).count();
    var id = AgregateFulfillment.findOne();
    if (id) {
      AgregateFulfillment.update({ _id: id._id }, {
        $set: {
          NewOrder: countNewOrder,
          Validate1: countValidate1,
          Picklist: countPicklist,
          Validate2: countValidate2,
          Shipping: countShipping,
          Completed: countComplete,
          Canceled: countCancel,
          Returned: countReturn,
          Refunded: countRefund,
          updatedAt: new Date()
        }
      })
    } else {
      AgregateFulfillment.insert({
        NewOrder: countNewOrder,
        Validate1: countValidate1,
        Picklist: countPicklist,
        Validate2: countValidate2,
        Shipping: countShipping,
        Completed: countComplete,
        Canceled: countCancel,
        updatedAt: new Date()
      })
    }
  },

  'agregateDayFufillment.update'() {
    console.log('Agregate Day Fufillment Start');
    var date = new Date();
    var date1 = moment(date).add(7, 'hour');
    var dateNow = moment(date1).format("YYYY-MMM-DD");
    var startDate1 = moment.utc(dateNow);
    var endDate1 = moment.utc(dateNow).add(24, 'hour');
    var sd1 = moment.utc(startDate1).toISOString();
    var ed1 = moment.utc(endDate1).toISOString();
    var startDate = new Date(sd1);
    var endDate = new Date(ed1);

    var id = AgregateFulfillmentDay.findOne({ 'transactionDate': dateNow });
    if (!id) {
      AgregateFulfillmentDay.insert({
        transactionDate: dateNow,
        startDate: startDate,
        endDate: endDate,
        createdAt: new Date()
      })
    }
  },

  'agregateDayFufillment.update2'(date) {
    console.log('Agregate Day Fufillment Update2 Start');
    // var date = new Date();
    // var date2 = moment(date).add(7, 'hour');
    // var date1 = moment(date2).subtract(7, 'day');
    var dateNow = moment(date).format("YYYY-MMM-DD");

    // var startDate1 = moment.utc(dateNow).subtract(24, 'hour');

    var startDate1 = moment.utc(dateNow);
    var endDate1 = moment.utc(dateNow).add(24, 'hour');

    var sd1 = moment.utc(startDate1).toISOString();
    var ed1 = moment.utc(endDate1).toISOString();

    var startDate = new Date(sd1);
    var endDate = new Date(ed1);

    // console.log('dn:' + dateNow + ' sd:' + startDate + ' ed:' + endDate);
    // console.log('dn:' + dateNow + ' sd1:' + sd1 + ' ed1:' + ed1);

    var countAllOrder = allOrder.find({ 'create_date': { $gte: startDate, $lt: endDate } }).count();
    var countDraft = allOrder.find({ 'internal_status': 'DRAFT', 'validasi1status': false, 'create_date': { $gte: startDate, $lt: endDate } }).count();
    var countNewOrder = allOrder.find({ 'internal_status': 'VALIDATED', 'validasi1status': false, 'create_date': { $gte: startDate, $lt: endDate } }).count();
    var countProcessing = allOrder.find({ 'internal_status': 'PROCESSED', 'validasi1status': false, 'create_date': { $gte: startDate, $lt: endDate } }).count();
    var countValidate1 = allOrder.find({ 'validasi1status': true, 'pickliststatus': false, 'validasi2status': false, 'validasi1At': { $gte: startDate, $lt: endDate } }).count();
    var countPicklist = allOrder.find({ 'pickliststatus': true, 'validasi2status': false, 'completedAt': { $gte: startDate, $lt: endDate } }).count();
    var countValidate2 = allOrder.find({ 'validasi2status': true, 'internal_status': 'PROCESSED', 'validasi2At': { $gte: startDate, $lt: endDate } }).count();
    var countShipping = allOrder.find({ 'create_date': { $gte: startDate, $lt: endDate }, $or: [{ 'internal_status': 'DELIVERED' }, { 'internal_status': 'SHIPPING' }] }).count();
    var countComplete = allOrder.find({ 'create_date': { $gte: startDate, $lt: endDate }, 'internal_status': 'COMPLETED' }).count();
    var countCancel = allOrder.find({ 'create_date': { $gte: startDate, $lt: endDate }, 'internal_status': 'CANCELED' }).count();
    var countReturn = allOrder.find({ 'create_date': { $gte: startDate, $lt: endDate }, 'internal_status': 'RETURNED' }).count();
    var countRefund = allOrder.find({ 'create_date': { $gte: startDate, $lt: endDate }, 'internal_status': 'REFUNDED' }).count();
    var id = AgregateFulfillmentDay.findOne({ 'transactionDate': dateNow });
    var marginOrder = countAllOrder - (countDraft + countNewOrder + countProcessing + countShipping + countComplete + countCancel + countReturn + countRefund);
    // console.log('agreagate tokped' + id);
    if (id) {
      AgregateFulfillmentDay.update({ _id: id._id }, {
        $set: {
          AllOrder: countAllOrder,
          Draft: countDraft,
          NewOrder: countNewOrder,
          Processed: countProcessing,
          Validate1: countValidate1,
          Picklist: countPicklist,
          Validate2: countValidate2,
          Shipping: countShipping,
          Completed: countComplete,
          Canceled: countCancel,
          Returned: countReturn,
          Refunded: countRefund,
          MarginOrder: marginOrder,
          transactionDate: dateNow,
          startDate: startDate,
          endDate: endDate,
          updatedAt: new Date()
        }
      })
    } else {
      AgregateFulfillmentDay.insert({
        AllOrder: countAllOrder,
        Draft: countDraft,
        NewOrder: countNewOrder,
        Processed: countProcessing,
        Validate1: countValidate1,
        Picklist: countPicklist,
        Validate2: countValidate2,
        Shipping: countShipping,
        Completed: countComplete,
        Canceled: countCancel,
        Returned: countReturn,
        Refunded: countRefund,
        MarginOrder: marginOrder,
        transactionDate: dateNow,
        startDate: startDate,
        endDate: endDate,
        updatedAt: new Date()
      })
    }
  },

  // 'agregateTokopedia.update'() {
  //   var countNewOrder = TokopediaOrders.find({ 'internal_status': 'VALIDATED' }).count();
  //   var countProcess = TokopediaOrders.find({ 'internal_status': 'PROCESSED' }).count();
  //   var countShipping = TokopediaOrders.find({ 'internal_status': 'SHIPPING' }).count();
  //   var countDelivered = TokopediaOrders.find({ 'internal_status': 'DELIVERED' }).count();
  //   var countCompleted = TokopediaOrders.find({ 'internal_status': 'COMPLETED' }).count();
  //   var countCancel = TokopediaOrders.find({ 'internal_status': 'CANCELED' }).count();
  //   var id = AgregateOrders.findOne({ 'Marketplace': 'tokopedia' });
  //   // console.log('agreagate tokped' + id);
  //   if (id) {
  //     AgregateOrders.update({ _id: id._id }, {
  //       $set: {
  //         NewOrder: countNewOrder,
  //         Process: countProcess,
  //         Shipping: countShipping,
  //         Delivered: countDelivered,
  //         Completed: countCompleted,
  //         Canceled: countCancel,
  //         Status: true,
  //         updatedAt: new Date()
  //       }
  //     })
  //   } else {
  //     AgregateOrders.insert({
  //       Marketplace: 'tokopedia',
  //       NewOrder: countNewOrder,
  //       Process: countProcess,
  //       Shipping: countShipping,
  //       Delivered: countDelivered,
  //       Completed: countCompleted,
  //       Canceled: countCancel,
  //       updatedAt: new Date()
  //     })
  //   }


  // },
  // 'agregateShopee.update'() {
  //   var countNewOrder = ShopeeOrders.find({ 'internal_status': 'VALIDATED' }).count();
  //   var countProcess = ShopeeOrders.find({ 'internal_status': 'PROCESSED' }).count();
  //   var countShipping = ShopeeOrders.find({ 'internal_status': 'SHIPPING' }).count();
  //   var countDelivered = ShopeeOrders.find({ 'internal_status': 'DELIVERED' }).count();
  //   var countCompleted = ShopeeOrders.find({ 'internal_status': 'COMPLETED' }).count();
  //   var countCancel = ShopeeOrders.find({ 'internal_status': 'CANCELED' }).count();
  //   var id = AgregateOrders.findOne({ 'Marketplace': 'shopee' });
  //   // console.log('agreagate shopee' + id);agregate 
  //   if (id) {
  //     AgregateOrders.update({ _id: id._id }, {
  //       $set: {
  //         NewOrder: countNewOrder,
  //         Process: countProcess,
  //         Shipping: countShipping,
  //         Delivered: countDelivered,
  //         Completed: countCompleted,
  //         Canceled: countCancel,
  //         Status: true,
  //         updatedAt: new Date()
  //       }
  //     })
  //   } else {
  //     AgregateOrders.insert({
  //       Marketplace: 'shopee',
  //       NewOrder: countNewOrder,
  //       Process: countProcess,
  //       Shipping: countShipping,
  //       Delivered: countDelivered,
  //       Completed: countCompleted,
  //       Canceled: countCancel,
  //       updatedAt: new Date()
  //     })
  //   }
  // },
  // 'agregateLazada.update'() {
  //   var countNewOrder = LazadaOrders.find({ 'internal_status': 'VALIDATED' }).count();
  //   var countProcess = LazadaOrders.find({ 'internal_status': 'PROCESSED' }).count();
  //   var countShipping = LazadaOrders.find({ 'internal_status': 'SHIPPING' }).count();
  //   var countDelivered = LazadaOrders.find({ 'internal_status': 'DELIVERED' }).count();
  //   var countCompleted = LazadaOrders.find({ 'internal_status': 'COMPLETED' }).count();
  //   var countCancel = LazadaOrders.find({ 'internal_status': 'CANCELED' }).count();
  //   var id = AgregateOrders.findOne({ 'Marketplace': 'lazada' });
  //   // console.log('agreagate lazada' + id);
  //   if (id) {
  //     AgregateOrders.update({ _id: id._id }, {
  //       $set: {
  //         NewOrder: countNewOrder,
  //         Process: countProcess,
  //         Shipping: countShipping,
  //         Delivered: countDelivered,
  //         Completed: countCompleted,
  //         Canceled: countCancel,
  //         Status: true,
  //         updatedAt: new Date()
  //       }
  //     })
  //   } else {
  //     AgregateOrders.insert({
  //       Marketplace: 'lazada',
  //       NewOrder: countNewOrder,
  //       Process: countProcess,
  //       Shipping: countShipping,
  //       Delivered: countDelivered,
  //       Completed: countCompleted,
  //       Canceled: countCancel,
  //       updatedAt: new Date()
  //     })
  //   }
  // },
  // 'agregateBukalapak.update'() {
  //   var countNewOrder = BukalapakOrders.find({ 'internal_status': 'VALIDATED' }).count();
  //   var countProcess = BukalapakOrders.find({ 'internal_status': 'PROCESSED' }).count();
  //   var countShipping = BukalapakOrders.find({ 'internal_status': 'SHIPPING' }).count();
  //   var countDelivered = BukalapakOrders.find({ 'internal_status': 'DELIVERED' }).count();
  //   var countCompleted = BukalapakOrders.find({ 'internal_status': 'COMPLETED' }).count();
  //   var countCancel = BukalapakOrders.find({ 'internal_status': 'CANCELED' }).count();
  //   var id = AgregateOrders.findOne({ 'Marketplace': 'bukalapak' });
  //   // console.log('agreagate bukalapak' + id);
  //   if (id) {
  //     AgregateOrders.update({ _id: id._id }, {
  //       $set: {
  //         NewOrder: countNewOrder,
  //         Process: countProcess,
  //         Shipping: countShipping,
  //         Delivered: countDelivered,
  //         Completed: countCompleted,
  //         Canceled: countCancel,
  //         Status: true,
  //         updatedAt: new Date()
  //       }
  //     })
  //   } else {
  //     AgregateOrders.insert({
  //       Marketplace: 'bukalapak',
  //       NewOrder: countNewOrder,
  //       Process: countProcess,
  //       Shipping: countShipping,
  //       Delivered: countDelivered,
  //       Completed: countCompleted,
  //       Canceled: countCancel,
  //       updatedAt: new Date()
  //     })
  //   }
  // },
  // 'agregateBlibli.update'() {
  //   var countNewOrder = BlibliOrders.find({ 'internal_status': 'VALIDATED' }).count();
  //   var countProcess = BlibliOrders.find({ 'internal_status': 'PROCESSED' }).count();
  //   var countShipping = BlibliOrders.find({ 'internal_status': 'SHIPPING' }).count();
  //   var countDelivered = BlibliOrders.find({ 'internal_status': 'DELIVERED' }).count();
  //   var countCompleted = BlibliOrders.find({ 'internal_status': 'COMPLETED' }).count();
  //   var countCancel = BlibliOrders.find({ 'internal_status': 'CANCELED' }).count();
  //   var id = AgregateOrders.findOne({ 'Marketplace': 'blibli' });
  //   // console.log('agreagate blibli' + id);
  //   if (id) {
  //     AgregateOrders.update({ _id: id._id }, {
  //       $set: {
  //         NewOrder: countNewOrder,
  //         Process: countProcess,
  //         Shipping: countShipping,
  //         Delivered: countDelivered,
  //         Completed: countCompleted,
  //         Canceled: countCancel,
  //         Status: true,
  //         updatedAt: new Date()
  //       }
  //     })
  //   } else {
  //     AgregateOrders.insert({
  //       Marketplace: 'blibli',
  //       NewOrder: countNewOrder,
  //       Process: countProcess,
  //       Shipping: countShipping,
  //       Delivered: countDelivered,
  //       Completed: countCompleted,
  //       Canceled: countCancel,
  //       updatedAt: new Date()
  //     })
  //   }
  // },
  // 'agregateZalora.update'() {
  //   var countNewOrder = ZaloraOrders.find({ 'internal_status': 'VALIDATED' }).count();
  //   var countProcess = ZaloraOrders.find({ 'internal_status': 'PROCESSED' }).count();
  //   var countShipping = ZaloraOrders.find({ 'internal_status': 'SHIPPING' }).count();
  //   var countDelivered = ZaloraOrders.find({ 'internal_status': 'DELIVERED' }).count();
  //   var countCompleted = ZaloraOrders.find({ 'internal_status': 'COMPLETED' }).count();
  //   var countCancel = ZaloraOrders.find({ 'internal_status': 'CANCELED' }).count();
  //   var id = AgregateOrders.findOne({ 'Marketplace': 'zalora' });
  //   // console.log('agreagate zalora' + id);
  //   if (id) {
  //     AgregateOrders.update({ _id: id._id }, {
  //       $set: {
  //         NewOrder: countNewOrder,
  //         Process: countProcess,
  //         Shipping: countShipping,
  //         Delivered: countDelivered,
  //         Completed: countCompleted,
  //         Canceled: countCancel,
  //         Status: true,
  //         updatedAt: new Date()
  //       }
  //     })
  //   } else {
  //     AgregateOrders.insert({
  //       Marketplace: 'zalora',
  //       NewOrder: countNewOrder,
  //       Process: countProcess,
  //       Shipping: countShipping,
  //       Delivered: countDelivered,
  //       Completed: countCompleted,
  //       Canceled: countCancel,
  //       Status: true,
  //       updatedAt: new Date()
  //     })
  //   }
  // },
  // 'agregateJdid.update'() {
  //   console.log('agregateJdid.update');
  //   var countNewOrder = JdidOrders.find({ 'internal_status': 'VALIDATED' }).count();
  //   var countProcess = JdidOrders.find({ 'internal_status': 'PROCESSED' }).count();
  //   var countShipping = JdidOrders.find({ 'internal_status': 'SHIPPING' }).count();
  //   var countDelivered = JdidOrders.find({ 'internal_status': 'DELIVERED' }).count();
  //   var countCompleted = JdidOrders.find({ 'internal_status': 'COMPLETED' }).count();
  //   var countCancel = JdidOrders.find({ 'internal_status': 'CANCELED' }).count();
  //   var id = AgregateOrders.findOne({ 'Marketplace': 'jdid' });
  //   // console.log('agreagate jdid' + id);
  //   if (id) {
  //     AgregateOrders.update({ _id: id._id }, {
  //       $set: {
  //         NewOrder: countNewOrder,
  //         Process: countProcess,
  //         Shipping: countShipping,
  //         Delivered: countDelivered,
  //         Completed: countCompleted,
  //         Canceled: countCancel,
  //         Status: true,
  //         updatedAt: new Date()
  //       }
  //     })
  //   } else {
  //     AgregateOrders.insert({
  //       Marketplace: 'jdid',
  //       NewOrder: countNewOrder,
  //       Process: countProcess,
  //       Shipping: countShipping,
  //       Delivered: countDelivered,
  //       Completed: countCompleted,
  //       Canceled: countCancel,
  //       updatedAt: new Date()
  //     })
  //   }
  // }

});