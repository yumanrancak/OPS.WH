import './blibli.html';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlibliOrders } from '../../../api/orders/orders';
import { ShopMp } from '../../../api/marketplace/marketplace';

// Meteor.subscribe('blibliOrders.all');
Meteor.subscribe('shopMp.all');

Template.App_blibli.helpers({
    countNewOrder() {
        return BlibliOrders.find({ 'internalStatus': 'VALIDATED' }).count();
    },
    countProcess() {
        return BlibliOrders.find({ 'internalStatus': 'PROCESSED' }).count();
    },
    countShipping() {
        return BlibliOrders.find({ 'internalStatus': 'SHIPPING' }).count();
    },
    countDevivered() {
        return BlibliOrders.find({ 'internalStatus': 'DELIVERED' }).count();
    },
    countCompleted() {
        return BlibliOrders.find({ 'internalStatus': 'COMPLETED' }).count();
    },
    countCancel() {
        return BlibliOrders.find({ 'internalStatus': 'CANCELED' }).count();
    },
    count3PL() {
        return BlibliOrders.find({ 'plStatus': true }).count();
    },
    newOrder: function () {
        // var sId = FlowRouter.getParam('id');
        var orders = BlibliOrders.find({ 'internalStatus': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
        // console.log(orders);
        return orders;
    },
    orderFulfill: function () {
        // var sId = FlowRouter.getParam('id');
        var orders = BlibliOrders.find({ $or: [{ internalStatus: 'PROCESSED' }, { internalStatus: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
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
