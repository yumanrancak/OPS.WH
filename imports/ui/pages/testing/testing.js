import './testing.html';
import { Meteor } from 'meteor/meteor';
import { ShopeeOrderDetail } from '../../../api/orders/orders';
import { ShopMp } from '../../../api/marketplace/marketplace';
import toastr from 'toastr';

Meteor.subscribe('shopeeOrderDetail.all');
Meteor.subscribe('shopMp.all');

Template.testing.helpers({
    newOrder: function () {
        // var sId = FlowRouter.getParam('id');
        var orders = ShopeeOrderDetail.find({ 'internalStatus': 'VALIDATED' }, { sort: { 'createdAt': -1 } }, { limit: 100 });
        // console.log(orders);
        return orders;
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

Template.testing.events({
    'click .btnTest': function (e, tpl) {
        e.preventDefault();
        var orderId = $('#orderId').val();
        var shopId = $('#shopId').val();
        Meteor.call("shopeeDetailOrder", orderId, shopId, function (error) {
            if (error) {
                alert(error.reason);
            } else {
                toastr.success('Register Successfully..!!', 'Congratulation..!');
            }
        });
    },
    'click .btnUpdateAgregate': function (e, tpl) {
        e.preventDefault();
        // var orderId = $('#orderId').val();
        // var shopId = $('#shopId').val();
        Meteor.call("agregateTokopedia.update", function (error) {
            if (error) {
                alert(error.reason);
            } else {
                toastr.success('Register Successfully..!!', 'Congratulation..!');
            }
        });
    },
    'click .btnUpdateOldOrder': function (e, tpl) {
        e.preventDefault();
        // var orderId = $('#orderId').val();
        // var shopId = $('#shopId').val();
        Meteor.call("tokopediaGetDetailOrder", function (error) {
            if (error) {
                alert(error.reason);
            } else {
                toastr.success('update Successfully..!!', 'Congratulation..!');
            }
        });
    },
    'click .apimptokenGet': function (e, tpl) {
        e.preventDefault();
        // var orderId = $('#orderId').val();
        // var shopId = $('#shopId').val();
        Meteor.call("apimptokenGet", function (error) {
            if (error) {
                alert(error.reason);
            } else {
                toastr.success('update Successfully..!!', 'Congratulation..!');
            }
        });
    },
    'click .agregateAll': function (e, tpl) {
        e.preventDefault();
        // var orderId = $('#orderId').val();
        // var shopId = $('#shopId').val();
        Meteor.call("agregateAll.update", function (error) {
            if (error) {
                alert(error.reason);
            } else {
                toastr.success('update Successfully..!!', 'Congratulation..!');
            }
        });
    },
    'click .cleanShopeeData': function (e, tpl) {
        e.preventDefault();
        var shopId = $('#cleanShopId').val();
        Meteor.call("cleanDataShopee", shopId, function (error) {
            if (error) {
                alert(error.reason);
            } else {
                toastr.success('Register Successfully..!!', 'Congratulation..!');
            }
        });
    },
    'click .cleanShopeeData1': function (e, tpl) {
        e.preventDefault();
        var shopId = $('#cleanShopId1').val();
        Meteor.call("cleanDataShopeeOrder", shopId, function (error) {
            if (error) {
                alert(error.reason);
            } else {
                toastr.success('Register Successfully..!!', 'Congratulation..!');
            }
        });
    },

});
