import './accept_orders.html';
import { Meteor } from 'meteor/meteor';
// import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import {
    TokpedOrderDetail,
    TokpedOrders,
    ShopeeOrders,
    ShopeeOrderDetail,
    LazadaOrdersDetail,
    BukalapakOrderDetail,
    BlibliOrdersDetail,
    ZaloraOrderDetail,
    JdidOrderDetail,
    LazadaOrders,
    BukalapakOrders,
    BlibliOrders,
    ZaloraOrders,
    JdidOrders,
} from '../../../api/orders/orders';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { AgregateOrders } from '../../../api/agregate/agregate';
import { ReactiveMethod } from 'meteor/simple:reactive-method';

Tracker.autorun(() => {
    Meteor.subscribe('tokpedOrdersNew.15');
    Meteor.subscribe('tokpedOrdersDetailNew.15');
    Meteor.subscribe('blibliOrdersNew.15');
    Meteor.subscribe('blibliOrdersDetailNew.15');
    Meteor.subscribe('bukalapakOrdersNew.15');
    Meteor.subscribe('bukalapakOrdersDetailNew.15');
    Meteor.subscribe('jdidOrdersNew.15');
    Meteor.subscribe('jdidOrdersDetailNew.15');
    Meteor.subscribe('lazadaOrdersNew.15');
    Meteor.subscribe('lazadaOrdersDetailNew.15');
    Meteor.subscribe('shopeeOrdersNew.15');
    Meteor.subscribe('shopeeOrdersDetailNew.15');
    Meteor.subscribe('zaloraOrdersNew.15');
    Meteor.subscribe('zaloraOrdersDetailNew.15');

    Meteor.subscribe('agregateOrders.all');
    Meteor.subscribe('shopMp.all');
});
Template.acceptOrders.created = function () {

}
Template.acceptOrders.helpers({
    detailOrder(orderId) {
        // console.log(orderId);
        var data = TokpedOrderDetail.findOne({ 'orderId': orderId });
        return data;
    },
    detailOrderShopee(orderId) {
        // console.log(orderId);
        var data = ShopeeOrderDetail.findOne({ 'orderId': orderId });
        // console.log(data);
        return data;
    },
    detailOrderLazada(orderId) {
        // console.log(orderId);
        var data = LazadaOrdersDetail.findOne({ 'orderId': orderId });
        return data;
    },
    detailOrderBukalapak(orderId) {
        // console.log(orderId);
        var data = BukalapakOrderDetail.findOne({ 'orderId': orderId });
        return data;
    },
    detailOrderBlibli(orderId) {
        // console.log(orderId);
        var data = BlibliOrdersDetail.findOne({ 'orderId': orderId });
        return data;
    },
    detailOrderZalora(orderId) {
        // console.log(orderId);
        var data = ZaloraOrderDetail.findOne({ 'orderId': orderId });
        return data;
    },
    detailOrderJdid(orderId) {
        // console.log(orderId);
        var data = JdidOrderDetail.findOne({ 'orderId': orderId });
        return data;
    },
    countDataTokopedia() {
        return AgregateOrders.findOne({ 'Marketplace': 'tokopedia' });
    },
    countDataShopee() {
        return AgregateOrders.findOne({ 'Marketplace': 'shopee' });
    },
    countDataLazada() {
        return AgregateOrders.findOne({ 'Marketplace': 'lazada' });
    },
    countDataBukalapak() {
        return AgregateOrders.findOne({ 'Marketplace': 'bukalapak' });
    },
    countDataBlibli() {
        return AgregateOrders.findOne({ 'Marketplace': 'blibli' });
    },
    countDataZalora() {
        return AgregateOrders.findOne({ 'Marketplace': 'zalora' });
    },
    countDataJdid() {
        return AgregateOrders.findOne({ 'Marketplace': 'jdid' });
    },
    newOrder: function () {
        var orders = TokpedOrders.find({ 'internalStatus': 'VALIDATED' }, { sort: { 'createdAt': 1 }, limit: 15 });
        return orders;
    },
    newOrderShopee: function () {
        var orders = ShopeeOrders.find({ 'internalStatus': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
        return orders;
    },
    newOrderLazada: function () {
        var orders = LazadaOrders.find({ 'internalStatus': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
        return orders;
    },
    newOrderBukalapak: function () {
        var orders = BukalapakOrders.find({ 'internalStatus': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
        return orders;
    },
    newOrderBlibli: function () {
        var orders = BlibliOrders.find({ 'internalStatus': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
        return orders;
    },
    newOrderZalora: function () {
        var orders = ZaloraOrders.find({ 'internalStatus': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
        return orders;
    },
    newOrderJdid: function () {
        var orders = JdidOrders.find({ 'internalStatus': 'VALIDATED' }, { sort: { 'createdAt': -1 }, limit: 15 });
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
Template.acceptOrders.events({
    'click .btnRefreshOrder': function (e, tpl) {
        // e.preventDefault();
        var sId = this.orderId;
        console.log('orderId:' + sId);
        // var sesiId = FlowRouter.getParam("_id");
        // if (confirm('Do you want to remove this data?')) {
        Meteor.call('tokopediaDetailOrder.update', sId,
            (err, res) => {
                if (err) {
                    toastr.warning('update Fail')
                } else {
                    toastr.success('update Success');
                }
            }
        );
        // }
    },
});
