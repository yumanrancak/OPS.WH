import './dash_error_log2.html';
import { Meteor } from 'meteor/meteor';
import { OrderErrorLogs } from '../../../../api/orders/orders';

Tracker.autorun(() => {
    Meteor.subscribe('errorLogOrder_scan2.100');
  });


Template.dash_error_log2.helpers({
    StoreErrorLog() {
        return OrderErrorLogs.find({'typescan':2},{ sort: { 'createdAt': -1 }, limit: 50});
    },
});
