import './dash_error_picklist.html';
import { Meteor } from 'meteor/meteor';
import { OrderErrorLogs } from '../../../../api/orders/orders';


Tracker.autorun(() => {
    Meteor.subscribe('errorLogOrder_picklist.100');
    Meteor.subscribe('userList');
  });

Template.dash_error_picklist.helpers({
    StoreErrorLog() {
        return OrderErrorLogs.find({'typescan':"Pick List"},{ sort: { 'createdAt': -1 }, limit: 50});
    },
    userNameDrop: function (uid) {
        // console.log(uid);
        var user = Meteor.users.findOne(uid);
        // console.log(user);
        var oId = user && user.username;
        // console.log(oId);
        return oId;
      },
});
