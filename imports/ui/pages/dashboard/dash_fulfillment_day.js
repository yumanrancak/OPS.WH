import './dash_fulfillment_day.html';
import { Meteor } from 'meteor/meteor';
// import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { TokpedOrderDetail, TokopediaOrders } from '../../../api/orders/orders';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { AgregateOrders, AgregateFulfillmentDay } from '../../../api/agregate/agregate';
import { allOrder } from '../../../api/orders/orders';
import { ReactiveMethod } from 'meteor/simple:reactive-method';


Tracker.autorun(() => {

    // Meteor.subscribe('tokpedOrdersNew.15');
    // Meteor.subscribe('tokpedOrdersDetailNew.15');
    // Meteor.subscribe('tokpedOrdersDetailFulfill.15');
    Meteor.subscribe('agregateFufillment.all');
    Meteor.subscribe('agregateFufillmentDay.all');
    Meteor.subscribe('allOrders.validate1');
    Meteor.subscribe('allOrders.picklist');
    Meteor.subscribe('allOrders.validate2');
    // Meteor.subscribe('agregateOrders.all');
    // Meteor.subscribe('shopMp.all');
});
Template.dash_fulfillment_day.created = function () {
    Meteor.subscribe('agregateFufillmentDay.week');
    this.isSubs = new ReactiveVar(false);


}
Template.dash_fulfillment_day.helpers({
    orderByDate: function () {
        return AgregateFulfillmentDay.find({}, { sort: { 'startDate': -1 }, limit: 7 });
    },
    settingsorder: function () {
        // Session.get('isLoading');
        var order = this;
        console.log('order', order)
        return {
            collection: 'allOrderDate',
            rowsPerPage: 10,
            showFilter: false,
            fields: [
                // { key: 'tracking_no', label: 'Tracking No', cellClass: 'text-bold mr-1' },
                // { key: 'order_id', label: 'Order ID' },
                { key: 'invoice_no', label: 'Inv No' },
                { key: 'marketplace', label: 'MP' },
                // { key: 'shipper_internal', label: '3PL' },
                // {
                //     key: 'comment', label: 'Status',
                //     headerClass: 'col-md-1 text-center',
                //     fn: function (data) {
                //         if (!data) {
                //             return new Spacebars.SafeString("<span class='col-md-12 badge badge-info'>open</span>")
                //         }
                //         else {
                //             return new Spacebars.SafeString("<span class='col-md-12 badge badge-warning'>" + data + "</span>")
                //         }
                //     },
                // },
                // {
                //     key: 'validasi1status', label: 'V1', hidden: true,
                //     cellClass: function (data) {
                //         if (data == "none") {
                //             return 'badge badge-danger '
                //         }
                //     },
                // },
                {
                    key: 'create_date', label: 'Date', sortOrder: 0, sortDirection: 'descending', fn: function (date) {
                        // return moment(new Date(date)).format('D-M-YYYY, HH:mm')
                        return moment.utc(date).format('D-MMM-YYYY, HH:mm')
                    }
                },
                // { label: 'Action', tmpl: Template.manualaction, sortable: false, }
            ],
            // filters: ['order', 'searchtrack', 'searchinv', 'searchmp', 'searchshipper'],
            ready: Template.instance().isSubs,
        };
    },
    detailOrder(orderId) {
        console.log(orderId);
        var data = TokpedOrderDetail.findOne({ 'orderId': orderId });
        // return JSON.stringify(data, null, 2);xx
        // return JSON.parse(data, null, 2);
        return data;

    },
    dateNow1() {
        var date = new Date();
        var dateNow = moment(date).format("DD MMM YYYY");
        return dateNow;
    },
    countData() {
        console.log('count data');
        var date = new Date();
        var dateNow = moment(date).format("YYYY-MMM-DD");
        // var dt = new Date(dateNow);
        console.log('dt:', dateNow);
        var data = AgregateFulfillmentDay.findOne({ 'transactionDate': dateNow });
        // var data = AgregateFulfillmentDay.findOne();
        console.log('data:' + data);
        return data;
    },
    validate1() {
        // { 'transactionDate': dateNow }
        var date = new Date();
        var dateNow = moment(date).format("YYYY-MMM-DD");
        var startDate1 = moment.utc(dateNow);
        var endDate1 = moment.utc(dateNow).add(24, 'hour');
        var sd1 = moment.utc(startDate1).toISOString();
        var ed1 = moment.utc(endDate1).toISOString();
        var startDate = new Date(sd1);
        var endDate = new Date(ed1);
        var validate1data = allOrder.find({ 'validasi1status': true, 'pickliststatus': false, 'validasi2status': false, 'validasi1At': { $gte: startDate, $lt: endDate } }, { sort: { 'create_date': -1 }, limit: 50 });
        console.log('validate1 data', validate1data);
        return validate1data;
        // return allOrder.find({
        //     'validasi1status': true, 'pickliststatus': false, 'validasi2status': false, 'validasi1At':
        // }, { sort: { 'create_date': -1 }, limit: 50 });
    },
    picklist() {
        var date = new Date();
        var dateNow = moment(date).format("YYYY-MMM-DD");
        var startDate1 = moment.utc(dateNow);
        var endDate1 = moment.utc(dateNow).add(24, 'hour');
        var sd1 = moment.utc(startDate1).toISOString();
        var ed1 = moment.utc(endDate1).toISOString();
        var startDate = new Date(sd1);
        var endDate = new Date(ed1);
        var picklistData = allOrder.find({ 'pickliststatus': true, 'validasi2status': false, 'completedAt': { $gte: startDate, $lt: endDate } }, { sort: { 'create_date': -1 }, limit: 50 });
        console.log('picklist data', picklistData);
        return picklistData;
    },
    validate2() {
        var date = new Date();
        var dateNow = moment(date).format("YYYY-MMM-DD");
        var startDate1 = moment.utc(dateNow);
        var endDate1 = moment.utc(dateNow).add(24, 'hour');
        var sd1 = moment.utc(startDate1).toISOString();
        var ed1 = moment.utc(endDate1).toISOString();
        var startDate = new Date(sd1);
        var endDate = new Date(ed1);
        var validate2data = allOrder.find({ 'validasi2status': true, 'validasi2At': { $gte: startDate, $lt: endDate } }, { sort: { 'create_date': -1 }, limit: 50 });
        console.log('validate2 data');
        return validate2data;
    },
    newOrder: function () {
        var orders = TokopediaOrders.find({ 'internal_status': 'COMPLETED' }, { sort: { 'createdAt': -1 }, limit: 15 });
        return orders;
    },
    orderFulfill: function () {
        var orders = TokopediaOrders.find({ $or: [{ internal_status: 'COMPLETED' }, { internal_status: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
        return orders;
    },
    userName: function (id) {
        var user = Meteor.user();
        var oId = user && user.profile && user.profile.fullName;
        return oId;
    },
    storeName: function (sid) {
        var n = String(sid);
        var store = ShopMp.findOne({ 'shopid': n });
        if (store) {
            var shopName = store.shopname;
            return shopName;
        } else {
            var shopName = n;
            return shopName;
        }
    },
});
