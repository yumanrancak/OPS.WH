// Methods related to counseling

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Notification } from '../notification.js';
import { Roles } from 'meteor/alanning:roles'

Meteor.methods({
  'showNotif.all'(){
      var uid = Meteor.userId();
      // return Notification.find({});
      // console.log('notif uid:' + uid);
      // console.log('notif uid:',Roles.userIsInRole(uid, ['admin']) );
      if (Roles.userIsInRole(uid, ['admin'])) {
          return Notification.find({ 'statusAdmin': true }, { sort: { createdAt: -1 },limit:10 }).fetch();
      } else {
        // console.log('test',Notification.find({ 'statusAdmin': false }, { sort: { createdAt: -1 },limit:10 }).fetch())
          return Notification.find({ 'statusAdmin': false }, { sort: { createdAt: -1 },limit:10 }).fetch();
      }
  }
  ,
  'sendNotificationVote'(cgId, uid) {
    Notification.insert({
      from: this.userId,
      to: uid,
      cgId: cgId,
      msg: 'You Have New Vote!',
      statusRead: false,
      statusAdmin: false,
      createdAt: new Date(),
    });
  },
  'sendNotificationComment'(cgId, uid) {
    Notification.insert({
      from: this.userId,
      to: uid,
      cgId: cgId,
      msg: 'You Have New Comment!',
      statusRead: false,
      statusAdmin: false,
      createdAt: new Date(),
    });
  },
  'sendNotificationRegister'(cgId, uid) {
    Notification.insert({
      from: this.userId,
      to: uid,
      cgId: cgId,
      msg: 'New Participant!',
      statusRead: false,
      statusAdmin: true,
      createdAt: new Date(),
    });
  },
  'sendNotificationUpload'(cgId, uid) {
    Notification.insert({
      from: this.userId,
      to: uid,
      cgId: cgId,
      msg: 'New Upload!',
      statusRead: false,
      statusAdmin: true,
      createdAt: new Date(),
    });
  },
  'markReadAll'(uid) {
    // var uid = Meteor.userId();
    // console.log('uid mark all:' + uid);
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    Notification.update(
      { 'to': "warehouse" },
      {
        $set: {
          statusRead: true,
          updatedAt: new Date(),
        },
      },
      { multi: true }
    );
  },
  'markRead'(nid) {
    var uid = Meteor.userId();
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    Notification.update(
      { '_id': nid },
      {
        $set: {
          statusRead: true,
          updatedAt: new Date(),
        },
      }
    );
  },
});
