import { Meteor } from 'meteor/meteor';
import { SimpleRest, options } from "meteor/simple:rest";
import { ExternalStoreOrder } from '../externalStore/externalStore';
import { ShopeeOrderDetail, ShopeeOrders } from '../orders/orders';

SimpleRest.setMethodOptions('return-five', options);

Meteor.methods({
    'return-five': function () {
        return 5;
    },
    'cleanDataShopee'(shopId) {
        console.log('methode: cleanDataShopee shopId :' + shopId);
        var sid = Number(shopId);
        var shopeeorders = ShopeeOrders.find({ 'shopId': sid }).fetch();
        // console.log(shopeeorders);
        for (let i = 0; i < shopeeorders.length; i++) {
            item = shopeeorders[i]
            // console.log(item);
            console.log(item.orderId);
            var esd = ExternalStoreOrder.insert(
                item
            );
            console.log('esd:' + esd);
            if (esd) {
                var sod = ShopeeOrderDetail.findOne({ 'orderId': item.orderId });
                // console.log(sod);
                if (sod) {
                    ExternalStoreOrder.update({ _id: esd }, {
                        $set: {
                            orders: sod.orders
                        }
                    });
                    // ShopeeOrderDetail.remove({ 'orderId': item.orderId });
                }

            }
            // ShopeeOrders.remove({ 'shopId': shopId });
        }
    },
    'cleanDataShopeeOrder'(shopId) {
        console.log('methode: cleanDataShopeeOrder shopId :' + shopId);
        var sid = Number(shopId);
        ShopeeOrders.remove({ 'shopId': sid });
        ShopeeOrderDetail.remove({ 'shopId': sid });
    },
});