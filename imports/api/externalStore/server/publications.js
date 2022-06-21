// All links-related publications

import { Meteor } from 'meteor/meteor';
import { ExternalStore, ExternalStoreOrder } from '../externalStore.js';

Meteor.publish('externalStore.all', function () {
  return ExternalStore.find();
});
Meteor.publish('externalStoreOrder.all', function () {
  return ExternalStoreOrder.find();
});