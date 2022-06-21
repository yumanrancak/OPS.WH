
import { Mongo } from 'meteor/mongo';

export const Logistics = new Mongo.Collection('logistics');
export const Shipment = new Mongo.Collection('shipment');
export const ShipmentRate = new Mongo.Collection('shipmentRate');
export const ShipmentProduct = new Mongo.Collection('shipmentProduct');