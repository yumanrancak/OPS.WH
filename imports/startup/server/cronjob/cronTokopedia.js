import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
// import { SalesOrders } from '../../api/orders/orders';
import { SoCronLog, SoCronLogTokopedia } from '../../../api/cronlog/cronlog';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { SalesOrders, TokpedOrderDetail, TokpedOrders, TokpedStatus } from '../../../api/orders/orders';
import { HTTP } from 'meteor/http';
import moment from 'moment';
import { InternalStatus } from '../../../api/internalStatus/internalStatus';

//Tokopedia
SyncedCron.add({
    name: 'Cron Get Tokopedia',
    schedule: function (parser) {
        // parser is a later.parse object
        // return parser.text('every 10 second');
        return parser.text('every 1 minute');
    },
    job: function () {
        var shop = ShopMp.find({ 'fk_channel': '12' }).fetch();
        var marketplaceId = 'tokopedia';
        // console.log(shop);

        shop.forEach((shops) => {
            //Init
            console.log('INIT START');
            var shopid = Number(shops.shopid);
            console.log('shopid: ' + shopid);
            var storeId = shopid;

            var salesOrder = TokpedOrders.findOne({ 'marketplaceId': marketplaceId, 'shopId': shopid }, { sort: { 'mpCreateTime': -1 } })
            // console.log(salesOrder);

            //check sales order
            if (salesOrder) {
                // console.log('salesOrder exist');
                var sd = salesOrder.mpCreateTime;
                console.log('sdLastOrder:' + sd);
            } else {
                // initial insert sales data
                TokpedOrders.insert({
                    marketplaceId: "tokopedia",
                    shopId: shopid,
                    mpCreateTime: new Date("2021-12-02T00:00:00.000Z"),
                    // trackingNo: respData.order_info.shipping_info.awb,
                    insertType: 'init',
                    createdAt: new Date()
                });
                console.log('sdLastOrder NULL');
            }

            var ed = new Date();
            var datenow = new Date();
            // var diff = Math.floor((datenow - sd) / (1000 * 60 * 60));
            var diff = (datenow - sd) / (1000 * 60 * 60);
            console.log('diff: ' + diff);
            if (diff >= 24) {
                // Alg 2
                console.log('ALG 2');
                if (SoCronLogTokopedia.find({ 'storeId': storeId }).count() === 0) {
                    SoCronLogTokopedia.insert({
                        startDate: "2021-12-03T00:00:00.000Z",
                        endDate: "2021-12-04T00:00:00.000Z",
                        marketplaceId: "tokopedia",
                        nTransaction: 0,
                        createdAt: new Date(),
                        isActive: 0,
                        storeId: storeId
                    });
                }
                /** GET CRON LOG status & Start Date */
                let queryCron = SoCronLogTokopedia.findOne({ 'marketplaceId': 'tokopedia', 'storeId': storeId }, { sort: { 'createdAt': -1 } })
                // console.log(queryCron);


                let sd_cron = queryCron.startDate
                let ed_cron = queryCron.endDate
                let ntrans = queryCron.nTransaction
                let getEd = new Date(sd_cron) //sd_cron + 1h
                console.log('sd_cron: ' + moment(getEd).format());


                if (sd <= sd_cron) {
                    console.log('ALG 4 ');
                    //Alg 4
                    sd = ed_cron // = ed_cron
                    ed = new Date(sd + 1) // = (sd_cron + 1)
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

            console.log('startDate:' + startDate + ' endDate:' + endDate);
            console.log('==================');



            // Request API untuk get All Order
            var endpoint = 'https://apimp.egogohub.tech/sync_tokopedia_so.php?act=getAllOrdersPerShop&shopid=' + shopid + '&sd=' + startDate + '&ed=' + endDate
            // https://apimp.egogohub.tech/sync_tokopedia_so.php?act=getAllOrdersPerShop&shopid=10202925&sd=2021-12-13&ed=2021-12-13
            // console.log(endpoint);

            HTTP.call('GET', endpoint, {
            }, (error, result) => {
                if (result) {
                    var res = result.data.response.data;
                    // console.log(result);
                    // console.log(res);

                    if (res) {
                        var nTransaction1 = 0;
                        res.forEach((respData) => {
                            var orderId = respData.order_id;
                            var shopId = respData.shop_id;
                            var mpStatus = respData.order_status;
                            var invoiceNo = respData.invoice_ref_num;
                            var mpCreateTime = new Date(moment(respData.create_time, 'X').format());
                            console.log('orderId: ' + orderId + ' shopid: ' + shopId + ' mpStatus: ' + mpStatus + ' invNo: ' + invoiceNo + ' crTime: ' + mpCreateTime);
                            var orderCount = TokpedOrders.find({ 'orderId': orderId }).count();
                            var is = InternalStatus.findOne({ 'mp': 'tokopedia', 'mpStatus': mpStatus });

                            //add nTransaction
                            nTransaction1++;

                            if (orderCount > 0) {
                                //update
                                TokpedOrders.update({ 'orderId': orderId }, {
                                    $set: {
                                        mpStatus: mpStatus,
                                        internalStatus: is.internalStatus,
                                        invoiceNo: invoiceNo,
                                        mpCreateTime: mpCreateTime,
                                        // trackingNo: respData.order_info.shipping_info.awb,
                                        insertType: 'API Detail - Update Duplicate',
                                        updateAt: new Date()
                                    }
                                });
                                Meteor.call('ShopMp.lastInsertDate', 'Tokopedia', shopId);
                                Meteor.call('agregateTokopedia.update');
                                Meteor.call('agregateAll.update');
                            } else {
                                TokpedOrders.insert({
                                    marketplaceId: "tokopedia",
                                    // brandId: brandData.brand,
                                    orderId: orderId,
                                    shopId: shopId,
                                    mpStatus: mpStatus,
                                    internalStatus: is.internalStatus,
                                    invoiceNo: invoiceNo,
                                    mpCreateTime: mpCreateTime,
                                    // trackingNo: respData.order_info.shipping_info.awb,
                                    insertType: 'API Detail - Insert New',
                                    createdAt: new Date()
                                    // }
                                });
                                //INSERT New
                                Meteor.call('ShopMp.lastInsertDate', 'Tokopedia', shopId);
                                Meteor.call('agregateTokopedia.update');
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
                    console.log(nTransaction1);
                    //insert cron log
                    var cronlog = SoCronLogTokopedia.insert({
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        marketplaceId,
                        nTransaction: nTransaction1,
                        isActive: 0,
                        storeId,
                        createdAt: new Date()
                    });
                    console.log(cronlog);
                } else {
                    console.log('api tokped err:' + error);
                    var cronlog = SoCronLogTokopedia.insert({
                        startDate: new Date(startDate),
                        endDate: new Date(endDate),
                        marketplaceId,
                        nTransaction: 0,
                        isActive: 0,
                        storeId: shopid,
                        statusLog: 'error',
                        error: error,
                        createdAt: new Date()
                    });
                }

            });
        });
    }
});
SyncedCron.add({
    name: 'Cron Update Tokopedia',
    schedule: function (parser) {
        // parser is a later.parse object
        // return parser.text('every 10 second');
        return parser.text('every 30 minute');
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

        var salesOrder = TokpedOrders.find({ $or: [{ internalStatus: 'VALIDATED' }, { internalStatus: 'PROCESSED' }, { internalStatus: 'SHIPPING' }, { internalStatus: 'DELIVERED' }] }, { sort: { 'mpCreateTime': -1 } })
        // console.log(salesOrder);
        var nTransaction1 = 0;
        salesOrder.forEach((salesData) => {
            var orderId = salesData.orderId;
            var endpoint = 'https://apimp.egogohub.tech/sync_tokopedia_so.php?act=getSingleOrderItem&orderid=' + orderId
            HTTP.call('GET', endpoint, {
            }, (error, result) => {
                var res = result.data.data;
                if (res == null) {
                    console.log('data null');
                } else {
                    var mpStatus = res.order_status;
                    var is = InternalStatus.findOne({ 'mp': 'tokopedia', 'mpStatus': mpStatus });
                    console.log('orderId:' + orderId + ' mpStatus: ' + mpStatus + ' intStatus: ' + is.internalStatus)
                    TokpedOrders.update({ 'orderId': orderId }, {
                        $set: {
                            mpStatus: mpStatus,
                            internalStatus: is.internalStatus,
                            trackingNo: res.order_info.shipping_info.awb,
                            insertType: 'API CRON - Update Data',
                            updateAt: new Date()
                        }
                    });
                    // Meteor.call('ShopMp.lastInsertDate', 'Tokopedia', shopId);
                    Meteor.call('agregateTokopedia.update');
                    Meteor.call('agregateAll.update');

                }

            });
            //add nTransaction
            nTransaction1++;
        });
        console.log('update num: ' + nTransaction1);
        // });
    }
});
SyncedCron.start();