// Fill the DB with example data on startup

import { Meteor } from 'meteor/meteor';
import { SoCronLog, SoCronLogTokopedia } from '../../api/cronlog/cronlog.js';
import { InternalStatus } from '../../api/internalStatus/internalStatus.js';
// import { Links } from '../../api/links/links.js';

Meteor.startup(() => {
  // if the Links collection is empty
  var dummyUserEmail = 'it@egogohub.com';
  var dummyUserEmail1 = 'admin@egogohub.com';
  var dummyUserEmail2 = 'user@egogohub.com';
  if (Meteor.users.find({ "emails.address": dummyUserEmail }).count() == 0) {
    // Create a test user. `createUser` returns the id of the created user
    Roles.createRole('superadmin');
    Roles.createRole('admin');
    Roles.createRole('user');
    const ownerId = Accounts.createUser({
      email: dummyUserEmail,
      password: 'test1234'
    });
    Roles.addUsersToRoles(ownerId, 'superadmin');
    const ownerId1 = Accounts.createUser({
      email: dummyUserEmail1,
      password: 'test1234'
    });
    Roles.addUsersToRoles(ownerId1, 'admin');
    const ownerId2 = Accounts.createUser({
      email: dummyUserEmail2,
      password: 'test1234'
    });
    Roles.addUsersToRoles(ownerId2, 'user');

    //Update User
    Meteor.users.update({ _id: ownerId }, {
      $set: {
        profile: {
          'position': 'superadmin',
          'description': 'There are many variations of data available.',
          'full_name': 'IT Division',
          'education': 'Computer Science from Paradise',
          'location': 'Jakarta',
          'status': 'active'
        }
      }
    });
    Meteor.users.update({ _id: ownerId1 }, {
      $set: {
        profile: {
          'position': 'admin',
          'description': 'There are many variations of admin available.',
          'full_name': 'Admin IT',
          'location': 'Jakarta',
          'status': 'active'
        }
      }
    });
    Meteor.users.update({ _id: ownerId2 }, {
      $set: {
        profile: {
          'position': 'user',
          'description': 'There are many variations of greatness available.',
          'full_name': 'User It',
          'location': 'Jakarta',
          'status': 'active'
        }
      }
    });
  };


  if (InternalStatus.find().count() === 0) {
    const data = [
      { mp: "tokopedia", mpStatus: 0, internalStatus: "CANCELED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 2, internalStatus: "CANCELED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 3, internalStatus: "CANCELED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 4, internalStatus: "CANCELED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 5, internalStatus: "CANCELED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 6, internalStatus: "CANCELED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 10, internalStatus: "CANCELED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 699, internalStatus: "CANCELED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 15, internalStatus: "CANCELED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 11, internalStatus: "DRAFT", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 100, internalStatus: "DRAFT", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 103, internalStatus: "DRAFT", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 200, internalStatus: "VALIDATED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 220, internalStatus: "VALIDATED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 221, internalStatus: "VALIDATED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 400, internalStatus: "PROCESSED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 450, internalStatus: "PROCESSED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 500, internalStatus: "SHIPPING", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 501, internalStatus: "SHIPPING", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 520, internalStatus: "SHIPPING", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 530, internalStatus: "SHIPPING", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 540, internalStatus: "SHIPPING", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 550, internalStatus: "RETURNED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 600, internalStatus: "DELIVERED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 601, internalStatus: "DELIVERED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 690, internalStatus: "DELIVERED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 691, internalStatus: "DELIVERED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 695, internalStatus: "DELIVERED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 698, internalStatus: "DELIVERED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 700, internalStatus: "COMPLETED", createdAt: new Date() },
      { mp: "tokopedia", mpStatus: 701, internalStatus: "COMPLETED", createdAt: new Date() }
    ];
    data.forEach(internalStatus => InternalStatus.insert(internalStatus));
  }
  if (SoCronLogTokopedia.find().count() === 0) {
    const data = [
      {
        startDate: "2021-12-01",
        endDate: "2021-12-02",
        marketplaceId: 'tokopedia',
        nTransaction: 0,
        createdAt: new Date(),
        isActive: 0,
        storeId: 0
      }
    ];
    data.forEach(soCronLog => SoCronLogTokopedia.insert(soCronLog));
  }

});
