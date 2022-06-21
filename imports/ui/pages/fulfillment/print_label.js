import './print_label.html';
import { Meteor } from 'meteor/meteor';
// import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { TokpedOrderDetail, TokpedOrders } from '../../../api/orders/orders';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { AgregateOrders } from '../../../api/agregate/agregate';
import { ReactiveMethod } from 'meteor/simple:reactive-method';

Meteor.subscribe('tokpedOrdersNew.15');
Meteor.subscribe('tokpedOrdersDetailNew.15');
Meteor.subscribe('tokpedOrdersDetailFulfill.15');
Meteor.subscribe('tokpedOrdersFulfill.15');
Meteor.subscribe('agregateOrders.all');
Meteor.subscribe('shopMp.all');

Tracker.autorun(() => {

});
Template.printLabel.created = function () {

}
Template.printLabel.helpers({
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
        var orders = TokpedOrders.find({ 'internalStatus': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
        return orders;
    },
    orderFulfill: function () {
        var orders = TokpedOrders.find({ $or: [{ internalStatus: 'PROCESSED' }, { internalStatus: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
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
