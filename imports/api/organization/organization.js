// Definition of the links collection

import { Mongo } from 'meteor/mongo';

export const Organization = new Mongo.Collection('organization');

// if (Meteor.isClient) {
//     Tracker.autorun(() => {
//         Meteor.subscribe('organization');
//     });
// }