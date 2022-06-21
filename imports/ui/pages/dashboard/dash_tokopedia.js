import './dash_tokopedia.html';
import { Meteor } from 'meteor/meteor';
// import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { TokpedOrderDetail, TokopediaOrders } from '../../../api/orders/orders';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { AgregateOrders } from '../../../api/agregate/agregate';
import { ReactiveMethod } from 'meteor/simple:reactive-method';


Tracker.autorun(() => {

    // Meteor.subscribe('tokpedOrdersNew.15');
    // Meteor.subscribe('tokpedOrdersDetailNew.15');
    // Meteor.subscribe('tokpedOrdersDetailFulfill.15');
    // Meteor.subscribe('tokpedOrdersFulfill.15');
    // Meteor.subscribe('agregateOrders.all');
    // Meteor.subscribe('shopMp.all');
});
Template.dash_tokopedia.created = function () {

}
Template.dash_tokopedia.helpers({
    detailOrder(orderId) {
        console.log(orderId);
        var data = TokpedOrderDetail.findOne({ 'orderId': orderId });
        // return JSON.stringify(data, null, 2);xx
        // return JSON.parse(data, null, 2);
        return data;

    },
    countData() {
        return AgregateOrders.findOne({ 'Marketplace': 'tokopedia' });
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
