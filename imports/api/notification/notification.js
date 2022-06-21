// Definition of the links collection

import { Mongo } from 'meteor/mongo';
import { Roles } from 'meteor/alanning:roles'

export const Notification = new Mongo.Collection('notification');

if (Meteor.isServer) {
    Meteor.publish('notification', function () {
        var uid = Meteor.userId();
        // return Notification.find({});
        // console.log('notif uid:' + uid);
        // console.log('notif uid:' + Roles.userIsInRole("RHg9PbWdXrvkrxdsP", ['admin']));
        if (Roles.userIsInRole(uid, ['Administration'])) {
            return Notification.find({ 'statusAdmin': true, 'statusRead': false }, { sort: { createdAt: 1 } });
        } else if(Roles.userIsInRole(uid, ['Warehouse Spv'])) {
            return Notification.find({ 'to': 'warehouse', 'statusRead': false, 'statusAdmin': false }, { sort: { createdAt: 1 } });
        }
    });
} else {
    Tracker.autorun(() => {
        Meteor.subscribe('notification');
        // Meteor.subscribe('notification.admin');
    });
}