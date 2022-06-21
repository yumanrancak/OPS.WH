// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { InternalStatus } from '../internalStatus';


Meteor.methods({
  'internalStatus.insert'(mp, mpStatus, internalStatus) {
    // check(url, String);
    // check(title, String);
    // var order = orders
    return InternalStatus.insert({
      mp,
      mpStatus,
      internalStatus,
      createdAt: new Date(),
    });
  },
});
