import './dash_fulfillment.html';
import { Meteor } from 'meteor/meteor';
// import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { TokpedOrderDetail, TokopediaOrders } from '../../../api/orders/orders';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { AgregateOrders, AgregateFulfillment } from '../../../api/agregate/agregate';
import { allOrder } from '../../../api/orders/orders';

import { ReactiveMethod } from 'meteor/simple:reactive-method';


Tracker.autorun(() => {

    // Meteor.subscribe('tokpedOrdersNew.15');
    // Meteor.subscribe('tokpedOrdersDetailNew.15');
    // Meteor.subscribe('tokpedOrdersDetailFulfill.15');
    Meteor.subscribe('agregateFufillment.all');
    Meteor.subscribe('allOrders.validate1');
    Meteor.subscribe('allOrders.picklist');
    Meteor.subscribe('allOrders.validate2');
    // Meteor.subscribe('agregateOrders.all');
    // Meteor.subscribe('shopMp.all');
});
Template.dash_fulfillment.created = function () {
    // Meteor.subscribe('agregateFufillment.all');
    this.isSubs = new ReactiveVar(false);

}
Template.dash_fulfillment.helpers({
    settingsorder: function () {
        // Session.get('isLoading');
        var order = this;
        console.log('order', order)
        return {
            collection: 'allOrder',
            rowsPerPage: 10,
            showFilter: false,
            fields: [
                { key: 'invoice_no', label: 'Inv No' },
                { key: 'marketplace', label: 'MP' },
                {
                    key: 'create_date', label: 'Date', sortOrder: 0, sortDirection: 'descending', fn: function (date) {
                        // return moment(new Date(date)).format('D-M-YYYY, HH:mm')
                        return moment.utc(date).format('D-MMM-YYYY, HH:mm')
                    }
                },
            ],
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
    countData() {
        console.log('count data');
        return AgregateFulfillment.findOne();
    },
    validate1() {
        console.log('validate1 data');
        return allOrder.find({
            'validasi1status': true, 'pickliststatus': false, 'validasi2status': false
        }, { sort: { 'create_date': -1 }, limit: 50 });
    },
    picklist() {
        console.log('picklist data');
        return allOrder.find({
            'pickliststatus': true, 'validasi2status': false
        }, { sort: { 'create_date': -1 }, limit: 50 });
    },
    validate2() {
        console.log('validate2 data');
        return allOrder.find({
            'validasi2status': true
        }, { sort: { 'create_date': -1 }, limit: 50 });
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
