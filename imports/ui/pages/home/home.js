import './home.html';
import { Meteor } from 'meteor/meteor';
// import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { AgregateOrders, AgregateSumOrders } from '../../../api/agregate/agregate';

Meteor.subscribe('agregateSumOrders.all');
Meteor.subscribe('agregateOrders.all');
Meteor.subscribe('shopMp.all');

Tracker.autorun(() => {
});

Template.App_home.created = function () {

}
Template.App_home.helpers({
    countData() {
        return AgregateSumOrders.findOne();
    },
    tokpedOrders() {
        return AgregateOrders.findOne({ 'Marketplace': 'tokopedia' });
    },
    shopeeOrders() {
        return AgregateOrders.findOne({ 'Marketplace': 'shopee' });
    },
    bukalapakOrders() {
        return AgregateOrders.findOne({ 'Marketplace': 'bukalapak' });
    },
    lazadaOrders() {
        return AgregateOrders.findOne({ 'Marketplace': 'lazada' });
    },
    blibliOrders() {
        return AgregateOrders.findOne({ 'Marketplace': 'blibli' });
    },
    zaloraOrders() {
        return AgregateOrders.findOne({ 'Marketplace': 'zalora' });
    },
    jdidOrders() {
        return AgregateOrders.findOne({ 'Marketplace': 'jdid' });
    },
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
