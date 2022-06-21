import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
// import { SalesOrders } from '../../api/orders/orders';
import { SoCronLog, SoCronLogShopee } from '../../../api/cronlog/cronlog';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { SalesOrders, ShopeeOrders, TokpedOrderDetail, TokpedOrders, TokpedStatus } from '../../../api/orders/orders';
import { HTTP } from 'meteor/http';
import moment from 'moment';
import { InternalStatus } from '../../../api/internalStatus/internalStatus';

//Tokopedia
SyncedCron.add({
    name: 'Cron Get Shopee',
    schedule: function (parser) {
        // parser is a later.parse object
        // return parser.text('every 10 second');
        return parser.text('every 1 minute');
    },
    job: function () {
        /** INITIAL Variable */
        //Shopee = 14
        var shop = ShopMp.find({ 'fk_channel': '14' }).fetch();
        var marketplaceId = 'shopee';
        // var initCreatedTime = new Date("2021-12-01T00:00:00.000Z");

        // console.log(shop);

        shop.forEach((shops) => {
            //Init
            console.log('INIT START');
            var shopid = Number(shops.shopid);
            // var shopid = Number(140593831);
            console.log('shopid: ' + shopid + ' brand:' + shops.shopname);
            var storeId = shopid;

            if (SoCronLogShopee.find({ 'storeId': storeId }).count() === 0) {
                SoCronLogShopee.insert({
                    startDate: "2021-12-01T00:00:00.000Z",
                    endDate: "2021-12-01T01:00:00.000Z",
                    marketplaceId: marketplaceId,
                    nTransaction: 0,
                    createdAt: new Date(),
                    isActive: 0,
                    insertType: 'init',
                    storeId: storeId
                });
            }

            var salesOrder = ShopeeOrders.findOne({ 'marketplaceId': marketplaceId, 'shopId': shopid }, { sort: { 'mpCreateTime': -1 } })
            // console.log(salesOrder);

            //check sales order
            if (salesOrder) {
                // console.log('salesOrder exist');

                var sd = salesOrder.mpCreateTime;
                // console.log('sdLastOrder:' + sd);
            } else {
                // initial insert sales data
                ShopeeOrders.insert({
                    marketplaceId: marketplaceId,
                    shopId: shopid,
                    mpCreateTime: new Date("2021-12-01T00:00:00.000Z"),
                    // trackingNo: respData.order_info.shipping_info.awb,
                    insertType: 'init',
                    createdAt: new Date()
                });
                // console.log('sdLastOrder NULL');
                var sd = new Date("2021-12-01T00:00:00.000Z");
            }

            var ed = new Date();
            var datenow = new Date();
            // var diff = Math.floor((datenow - sd) / (1000 * 60 * 60));
            var diff = (datenow - sd) / (1000 * 60 * 60);
            // console.log('diff: ' + diff);
            if (diff >= 24) {
                // Alg 2
                // var initStartDate = "2021-12-01T00:00:00.000Z";
                // var initEndDate = "2021-12-01T00:00:01.000Z";
                console.log('ALG 2');

                /** GET CRON LOG status & Start Date */
                let queryCron = SoCronLogShopee.findOne({ 'marketplaceId': marketplaceId, 'storeId': storeId }, { sort: { 'createdAt': -1 } })
                // console.log(queryCron);


                let sd_cron = queryCron.startDate
                let ed_cron = queryCron.endDate
                let ntrans = queryCron.nTransaction
                // let getEd = new Date(sd_cron) //sd_cron + 1h
                // console.log('sd_cron: ' + moment(getEd).format());


                if (sd <= sd_cron) {
                    console.log('ALG 4 ');
                    //Alg 4
                    sd = ed_cron // = ed_cron
                    ed = new Date(sd + 1) // = (sd_cron + 1)
                    console.log('ed 4:');
                    console.log(ed);
                    if (ed > datenow) {
                        console.log('ALG 6 ');
                        // Alg 6
                        ed = datenow
                    }
                } else {
                    console.log('ALG 5');
                    // Alg 5
                    if (ntrans <= 1) {
                        sd = ed_cron;
                    }
                    let getSd = new Date(sd)
                    ed = new Date(getSd.setDate(getSd.getDate() + 1)) //get Date from lastrow + 1d
                    if (ed > datenow) {
                        console.log('ALG 6 ');
                        // Alg 6
                        ed = datenow
                    }
                }
            } else {
                console.log('ALG 3 ');
                //Alg 3
                ed = new Date()
            }


            let startDate = moment(sd).toISOString();
            let endDate = moment(ed).toISOString();

            // console.log('startDate:' + startDate + ' endDate:' + endDate);
            console.log('==================');



            // Request API untuk get All Order
            var endpoint = 'https://apimp.egogohub.tech/sync_shopee_so.php?act=getAllOrdersPerShop&shopid=' + shopid + '&sd=' + startDate + '&ed=' + endDate
            // console.log(endpoint);

            HTTP.call('GET', endpoint, {
            }, (error, result) => {
                var res = result.data.orders;
                // console.log(result);
                // console.log(res);

                if (res) {
                    var nTransaction1 = 0;
                    res.forEach((respData) => {
                        var orderId = respData.ordersn;
                        var shopId = shopid;
                        var mpStatus = respData.order_status;
                        // var invoiceNo = respData.invoice_ref_num;
                        var mpCreateTime = new Date(moment(respData.update_time, 'X').format());
                        console.log('mp:' + marketplaceId + 'orderId: ' + orderId + ' shopid: ' + shopId + ' brand:' + shops.shopname + ' mpStatus: ' + mpStatus + ' intStatus: ' + is.internalStatus + ' crTime: ' + mpCreateTime);
                        var orderCount = ShopeeOrders.find({ 'orderId': orderId }).count();
                        var is = InternalStatus.findOne({ 'mp': marketplaceId, 'mpStatus': mpStatus });

                        //add nTransaction
                        nTransaction1++;

                        if (orderCount > 0) {
                            //update
                            ShopeeOrders.update({ 'orderId': orderId }, {
                                $set: {
                                    mpStatus: mpStatus,
                                    internalStatus: is.internalStatus,
                                    // invoiceNo: invoiceNo,
                                    // mpCreateTime: mpCreateTime,
                                    // trackingNo: respData.order_info.shipping_info.awb,
                                    insertType: 'API Detail - Update Old',
                                    updateAt: new Date()
                                }
                            });
                            // Meteor.call('ShopMp.lastInsertDate', 'Tokopedia', shopId);
                            Meteor.call('shopeeDetailOrder', orderId, shopId);
                            Meteor.call('agregateShopee.update');
                            Meteor.call('agregateAll.update');
                        } else {
                            ShopeeOrders.insert({
                                marketplaceId: marketplaceId,
                                // brandId: brandData.brand,
                                orderId: orderId,
                                shopId: shopId,
                                mpStatus: mpStatus,
                                internalStatus: is.internalStatus,
                                // invoiceNo: invoiceNo,
                                // mpCreateTime: mpCreateTime,
                                // trackingNo: respData.order_info.shipping_info.awb,
                                insertType: 'API Detail - Insert New',
                                createdAt: new Date()
                                // }
                            });
                            //INSERT New
                            // Meteor.call('ShopMp.lastInsertDate', 'Tokopedia', shopId);
                            Meteor.call('shopeeDetailOrder', orderId, shopId);
                            Meteor.call('agregateShopee.update');
                            Meteor.call('agregateAll.update');
                        }
                    });
                } else {
                    console.log('no data');
                }
                //escape nTransaction Null or undefined to 0
                if (nTransaction1) {
                    nTransaction1 = nTransaction1
                } else {
                    nTransaction1 = 0
                }
                // console.log(nTransaction1);
                //insert cron log
                var lso = ShopeeOrders.findOne({ 'marketplaceId': marketplaceId, 'shopId': shopid }, { sort: { 'mpCreateTime': -1 } })
                var lso1 = lso.mpCreateTime;
                var cronlog = SoCronLogShopee.insert({
                    startDate,
                    endDate,
                    marketplaceId,
                    nTransaction: nTransaction1,
                    isActive: 0,
                    storeId,
                    soLastCreatedTime: lso1,
                    createdAt: new Date()
                });
                // console.log(cronlog);
            });
        });
    }
});
SyncedCron.add({
    name: 'Cron Update Shopee',
    schedule: function (parser) {
        // parser is a later.parse object
        // return parser.text('every 10 second');
        return parser.text('every 5 minute');
    },
    job: function () {
        // var shop = ShopMp.find({ 'fk_channel': '12' }).fetch();
        // var marketplaceId = 'tokopedia';
        // // console.log(shop);

        // shop.forEach((shops) => {
        //Init
        console.log('INIT START UPDATE');
        // var shopid = Number(shops.shopid);
        // console.log('shopid: ' + shopid);
        // var storeId = shopid;

        var salesOrder = ShopeeOrders.find({ $or: [{ internalStatus: 'VALIDATED' }, { internalStatus: 'PROCESSED' }, { internalStatus: 'SHIPPING' }, { internalStatus: 'DELIVERED' }] }, { sort: { 'mpCreateTime': -1 } })
        // console.log(salesOrder);
        var nTransaction1 = 0;
        salesOrder.forEach((salesData) => {
            var orderId = salesData.orderId;
            var shopId = salesData.shopId;
            Meteor.call('shopeeDetailOrder', orderId, shopId);
            Meteor.call('agregateShopee.update');
            Meteor.call('agregateAll.update');
            // var endpoint = 'https://apimp.egogohub.tech/sync_shopee_so.php?act=getSingleOrderItem&orderid=' + orderId
            // HTTP.call('GET', endpoint, {
            // }, (error, result) => {
            //     var res = result.data.data;
            //     if (res == null) {
            //         console.log('data null');
            //     } else {
            //         var mpStatus = res.order_status;
            //         var is = InternalStatus.findOne({ 'mp': marketplaceId, 'mpStatus': mpStatus });
            //         console.log('orderId:' + orderId + ' mpStatus: ' + mpStatus + ' intStatus: ' + is.internalStatus)
            //         TokpedOrders.update({ 'orderId': orderId }, {
            //             $set: {
            //                 mpStatus: mpStatus,
            //                 internalStatus: is.internalStatus,
            //                 trackingNo: res.order_info.shipping_info.awb,
            //                 insertType: 'API CRON - Update Data',
            //                 updateAt: new Date()
            //             }
            //         });
            //         // Meteor.call('ShopMp.lastInsertDate', 'Tokopedia', shopId);
            //         Meteor.call('agregateShopee.update');
            //         Meteor.call('agregateAll.update');

            //     }

            // });
            // //add nTransaction
            nTransaction1++;
        });
        console.log('update num: ' + nTransaction1);
        // });
    }
});

SyncedCron.start();