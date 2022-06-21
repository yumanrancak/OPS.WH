// Definition of the links collection

import { Mongo } from 'meteor/mongo';

export const AgregateOrders = new Mongo.Collection('agregateOrders');
export const AgregateSumOrders = new Mongo.Collection('agregateSumOrders');
export const AgregateFulfillment = new Mongo.Collection('agregateFulfillment');
export const AgregateFulfillmentDay = new Mongo.Collection('agregateFulfillmentDay');
export const AgregateSumFulfillment = new Mongo.Collection('agregateSumFulfillment');
// export const AgregateTokopedia = new Mongo.Collection('agregateTokopedia');
// export const AgregateShopee = new Mongo.Collection('agregateShopee');
// export const AgregateLazada = new Mongo.Collection('agregateLazada');
// export const AgregateBukalapak = new Mongo.Collection('agregateBukalapak');
// export const AgregateBlibli = new Mongo.Collection('agregateBlibli');
// export const AgregateJdid = new Mongo.Collection('agregateJdid');
// export const AgregateZalora = new Mongo.Collection('agregateZalora');