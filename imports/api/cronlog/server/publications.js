// All links-related publications

import { Meteor } from 'meteor/meteor';
import { SoCronLog } from '../cronlog.js';

//Cron Log Orders
Meteor.publish('soCronLog.15', function () {
  return SoCronLog.find({}, { sort: { 'createdAt': -1 }, limit: 15 });
});