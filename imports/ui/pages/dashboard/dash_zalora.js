import './dash_zalora.html';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ZaloraOrders } from '../../../api/orders/orders';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { AgregateOrders } from '../../../api/agregate/agregate';

// Meteor.subscribe('zaloraOrdersNew.15');
// Meteor.subscribe('zaloraOrdersFulfill.15');
// Meteor.subscribe('agregateOrders.all');
// Meteor.subscribe('shopMp.all');

Template.dash_zalora.helpers({
    countData() {
        return AgregateOrders.findOne({ 'Marketplace': 'zalora' });
    },
    newOrder: function () {
        var orders = ZaloraOrders.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
        return orders;
    },
    orderFulfill: function () {
        var orders = ZaloraOrders.find({ $or: [{ internal_status: 'PROCESSED' }, { internal_status: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
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
