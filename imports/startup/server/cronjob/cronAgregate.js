import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
import { AgregateFulfillmentDay } from '../../../api/agregate/agregate';

SyncedCron.add({
    name: 'Cron Orders Agregate',
    schedule: function (parser) {
        // return parser.text('every 10 second');
        return parser.text('every 10 minute');
    },
    job: function () {
        Meteor.call('agregateAllOrders.update', 'blibli');
        Meteor.call('agregateAllOrders.update', 'bukalapak');
        Meteor.call('agregateAllOrders.update', 'jdid');
        Meteor.call('agregateAllOrders.update', 'lazada');
        Meteor.call('agregateAllOrders.update', 'shopee');
        Meteor.call('agregateAllOrders.update', 'tokopedia');
        Meteor.call('agregateAllOrders.update', 'zalora');
        Meteor.call('agregateAll.update');
    }
});

SyncedCron.add({
    name: 'Cron Fulfillment Agregate',
    schedule: function (parser) {
        // parser is a later.parse object
        // return parser.text('every 10 second');
        return parser.text('every 10 minute');
    },
    job: function () {
        Meteor.call('agregateAllFufillment.update');
    }
});

SyncedCron.add({
    name: 'Cron Fulfillment Day Agregate',
    schedule: function (parser) {
        // return parser.text('every 10 second');
        return parser.text('every 10 minute');
    },
    job: function () {
        Meteor.call('agregateDayFufillment.update');
    }
});
SyncedCron.add({
    name: 'Cron Fulfillment Day update2 Agregate',
    schedule: function (parser) {
        // return parser.text('every 10 second');
        return parser.text('every 10 minute');
    },
    job: function () {
        var date = new Date();
        var date1 = moment(date).subtract(30, 'day');
        // var dateNow = moment(date1).format("YYYY-MMM-DD");
        // console.log(date1);
        var startDate = new Date(date1);
        var datelist = AgregateFulfillmentDay.find({ 'startDate': { $gte: startDate } }).fetch();
        // console.log(datelist);
        for (let i = 0; i < datelist.length; i++) {
            let item = datelist[i];
            var dateGet = item.transactionDate;
            console.log('dataGet', dateGet);
            Meteor.call('agregateDayFufillment.update2', dateGet);
        };
    }
});

SyncedCron.add({
    name: 'Cron Update API MP Token',
    schedule: function (parser) {
        // return parser.text('every 10 second');
        return parser.text('every 1 hour');
    },
    job: function () {
        Meteor.call('apimptokenGet');
    }
});
SyncedCron.start();

