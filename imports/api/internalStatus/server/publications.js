// All links-related publications

import { Meteor } from 'meteor/meteor';
import { InternalStatus } from '../internalStatus.js';

Meteor.publish('internalStatus.all', function () {
  return InternalStatus.find();
});
