import './shopee.html';
import { Meteor } from 'meteor/meteor';
// import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ShopeeOrders } from '../../../api/orders/orders';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { AgregateShopee } from '../../../api/agregate/agregate';

// Tracker.autorun(() => {
// Meteor.subscribe('shopeeOrders.limit20');
// Meteor.subscribe('shopMp.all');
Meteor.subscribe('agregateShopee.all');
// });

Template.App_shopee.helpers({
    countData() {
        return AgregateShopee.findOne();
    },
    countNewOrder() {
        return ShopeeOrders.find({ 'internalStatus': 'VALIDATED' }).count();
    },
    countProcess() {
        return ShopeeOrders.find({ 'internalStatus': 'PROCESSED' }).count();
    },
    countShipping() {
        return ShopeeOrders.find({ 'internalStatus': 'SHIPPING' }).count();
    },
    countDevivered() {
        return ShopeeOrders.find({ 'internalStatus': 'DELIVERED' }).count();
    },
    countCompleted() {
        return ShopeeOrders.find({ 'internalStatus': 'COMPLETED' }).count();
    },
    countCancel() {
        return ShopeeOrders.find({ 'internalStatus': 'CANCELED' }).count();
    },
    count3PL() {
        return ShopeeOrders.find({ 'plStatus': true }).count();
    },
    newOrder: function () {
        // var sId = FlowRouter.getParam('id');
        var orders = ShopeeOrders.find({ 'internalStatus': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
        // console.log(orders);
        return orders;
    },
    orderFulfill: function () {
        // var sId = FlowRouter.getParam('id');
        var orders = ShopeeOrders.find({ $or: [{ internalStatus: 'PROCESSED' }, { internalStatus: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
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
