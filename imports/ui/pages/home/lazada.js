import './lazada.html';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { LazadaOrders } from '../../../api/orders/orders';
import { ShopMp } from '../../../api/marketplace/marketplace';

// Meteor.subscribe('lazadaOrders.all');
Meteor.subscribe('shopMp.all');

Template.App_lazada.helpers({
    countNewOrder() {
        return LazadaOrders.find({ 'internalStatus': 'VALIDATED' }).count();
    },
    countProcess() {
        return LazadaOrders.find({ 'internalStatus': 'PROCESSED' }).count();
    },
    countShipping() {
        return LazadaOrders.find({ 'internalStatus': 'SHIPPING' }).count();
    },
    countDevivered() {
        return LazadaOrders.find({ 'internalStatus': 'DELIVERED' }).count();
    },
    countCompleted() {
        return LazadaOrders.find({ 'internalStatus': 'COMPLETED' }).count();
    },
    countCancel() {
        return LazadaOrders.find({ 'internalStatus': 'CANCELED' }).count();
    },
    count3PL() {
        return LazadaOrders.find({ 'plStatus': true }).count();
    },
    newOrder: function () {
        // var sId = FlowRouter.getParam('id');
        var orders = LazadaOrders.find({ 'internalStatus': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
        // console.log(orders);
        return orders;
    },
    orderFulfill: function () {
        // var sId = FlowRouter.getParam('id');
        var orders = LazadaOrders.find({ $or: [{ internalStatus: 'PROCESSED' }, { internalStatus: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
        // console.log(orders);
        return orders;
    },
    // orderFulfill: function () {
    //     // var sId = FlowRouter.getParam('id');
    //     var orders = TokpedOrders.find({ 'fulfillStatus': true }, { sort: { 'creatadAt': -1 } }, { limit: 100 });
    //     // console.log(orders);
    //     return orders;
    // },
    userName: function (id) {
        var user = Meteor.user();
        var oId = user && user.profile && user.profile.fullName;
        return oId;
    },
    storeName: function (sid) {
        // console.log('find storeName');
        var n = String(sid);
        // console.log(n);
        var store = ShopMp.findOne({ 'shopid': n });

        // console.log(shopName);
        if (!store) {
            var shopName = '-';
            return shopName;

        } else {
            var shopName = store.shopname;
            return shopName;
        }

    },

});
