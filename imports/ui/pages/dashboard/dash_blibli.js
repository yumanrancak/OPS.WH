import './dash_blibli.html';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlibliOrders } from '../../../api/orders/orders';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { AgregateOrders } from '../../../api/agregate/agregate';
import { ExternalStore } from '../../../api/externalStore/externalStore';

// Meteor.subscribe('blibliOrdersNew.15');
// Meteor.subscribe('blibliOrdersFulfill.15');
// Meteor.subscribe('shopMp.all');
// Meteor.subscribe('agregateOrders.all');

Template.dash_blibli.helpers({
    countData() {
        return AgregateOrders.findOne({ 'Marketplace': 'blibli' });
    },
    newOrder: function () {
        var orders = BlibliOrders.find({ 'internal_status': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
        return orders;
    },
    orderFulfill: function () {
        var orders = BlibliOrders.find({ $or: [{ internal_status: 'PROCESSED' }, { internal_status: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
        return orders;
    },
    userName: function (id) {
        var user = Meteor.user();
        var oId = user && user.profile && user.profile.fullName;
        return oId;
    },
    storeName: function (sid) {
        var n = String(sid);
        console.log('storeCode:' + n);
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
