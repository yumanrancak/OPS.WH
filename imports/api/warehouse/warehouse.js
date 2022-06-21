
import { Mongo } from 'meteor/mongo';

export const Warehouse = new Mongo.Collection('warehouse');
export const Movement = new Mongo.Collection('movement');
export const Stock = new Mongo.Collection('stock');