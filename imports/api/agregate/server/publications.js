// All links-related publications

import { Meteor } from 'meteor/meteor';
import {
  AgregateSumOrders,
  AgregateOrders,
  AgregateFulfillment,
  AgregateSumFulfillment,
  AgregateFulfillmentDay
  // AgregateBlibli,
  // AgregateBukalapak,
  // AgregateJdid,
  // AgregateLazada,
  // AgregateShopee,
  // AgregateTokopedia,
  // AgregateZalora
} from '../agregate.js';

Meteor.publish('agregateSumOrders.all', function () {
  return AgregateSumOrders.find();
});
Meteor.publish('agregateOrders.all', function () {
  return AgregateOrders.find();
});
Meteor.publish('agregateFufillment.all', function () {
  return AgregateFulfillment.find();
});
Meteor.publish('agregateFufillmentDay.week', function () {
  var date = new Date();
  var date1 = moment(date).subtract(7, 'day');
  var dateNow = moment(date1).format("YYYY-MMM-DD");

  // var startDate1 = moment.utc(dateNow).subtract(24, 'hour');

  var startDate1 = moment.utc(dateNow);
  var endDate1 = moment.utc(dateNow).add(24, 'hour');

  var sd1 = moment.utc(startDate1).toISOString();
  var ed1 = moment.utc(endDate1).toISOString();

  var startDate = new Date(sd1);
  var endDate = new Date(ed1);

  return AgregateFulfillmentDay.find({ 'startDate': { $gte: startDate, $lt: endDate } }, { sort: { 'startDate': -1 } });
});
Meteor.publish('agregateFufillmentDay.all', function () {
  return AgregateFulfillmentDay.find();
});
Meteor.publish('agregateSumFufillment.all', function () {
  return AgregateSumFulfillment.find();
});
// Meteor.publish('agregateTokopedia.all', function () {
//   return AgregateTokopedia.find();
// });
// Meteor.publish('agregateShopee.all', function () {
//   return AgregateShopee.find();
// });
// Meteor.publish('agregateLazada.all', function () {
//   return AgregateLazada.find();
// });
// Meteor.publish('agregateBukalapak.all', function () {
//   return AgregateBukalapak.find();
// });
// Meteor.publish('agregateBlibli.all', function () {
//   return AgregateBlibli.find();
// });
// Meteor.publish('agregateJdid.all', function () {
//   return AgregateJdid.find();
// });
// Meteor.publish('agregateZalora.all', function () {
//   return AgregateZalora.find();
// });