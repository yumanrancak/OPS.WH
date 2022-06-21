// Definition of the links collection

import { Mongo } from 'meteor/mongo';

export const batchList = new Mongo.Collection('batchList');
export const batchListDetail = new Mongo.Collection('batchListDetail');

