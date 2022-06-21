// All messages-related publications

import { Meteor } from 'meteor/meteor';
import { Notification } from '../notification.js';


// Meteor.publish('notification.me', function () {
//     var uid = Meteor.userId();
//     if (this.userId) {
//         return Notification.find({ 'uid': uid, 'statusRead': false }, { sort: { createdAt: 1 } });
//     }
//     return [];
// });
// Meteor.publish('notification.admin', function () {
//     var uid = Meteor.userId();
//     if (Roles.userIsInRole(uid, ['admin'])) {
//         return Notification.find({ 'statusAdmin': true, 'statusRead': false }, { sort: { createdAt: 1 } });
//     }
//     return [];
// });
// Meteor.publish('messages', function () {
//   // if (this.userId) {
//   // return Messages.find({}, { sort: { createdAt: 1 } });
//   return Messages.find({});
//   // }
//   // return [];
// });
// if (Meteor.isServer) {
//   Meteor.publish('messages', function () {
//     if (this.userId) {
//       return Messages.find({}, { sort: { createdAt: 1 } });
//     }
//     return [];
//   });
// } else {
//   Tracker.autorun(() => {
//     Meteor.subscribe('messages');
//   });
// }