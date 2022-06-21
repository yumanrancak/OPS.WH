// Definition of the links collection

import { Mongo } from 'meteor/mongo';

export const ExternalStore = new Mongo.Collection('externalStore');
export const ExternalStoreOrder = new Mongo.Collection('externalStoreOrder');
