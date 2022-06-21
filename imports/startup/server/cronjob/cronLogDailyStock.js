import { Meteor } from 'meteor/meteor';
import { SyncedCron } from 'meteor/littledata:synced-cron';
// import { SalesOrders } from '../../api/orders/orders';
import { SoCronLogBlibli } from '../../../api/cronlog/cronlog';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { BlibliOrderDetail, BlibliOrders } from '../../../api/orders/orders';
import { HTTP } from 'meteor/http';
import moment from 'moment';
import { InternalStatus } from '../../../api/internalStatus/internalStatus';

SyncedCron.add({
    name: 'Cron Update Daily Stock',
    schedule: function (parser) {
        // parser is a later.parse object
        // return parser.text('every 10 second');
        return parser.text('every 12 hour');
    },
    job: function () {
        console.log('INIT START UPDATE');
        var salesOrder = BlibliOrders.find({ $or: [{ internalStatus: 'VALIDATED' }, { internalStatus: 'PROCESSED' }, { internalStatus: 'SHIPPING' }, { internalStatus: 'DELIVERED' }] }, { sort: { 'mpCreateTime': -1 } })
        // console.log(salesOrder);
        var nTransaction1 = 0;
        salesOrder.forEach((salesData) => {
            var orderId = salesData.orderId;
            var endpoint = 'https://apimp.egogohub.tech/sync_blibli_so.php?act=getSingleOrderItem&orderid=' + orderId
            HTTP.call('GET', endpoint, {
            }, (error, result) => {
                var res = result.data.data;
                if (res == null) {
                    console.log('data null');
                } else {
                    var mpStatus = res.order_status;
                    var is = InternalStatus.findOne({ 'mp': 'blibli', 'mpStatus': mpStatus });
                    console.log('orderId:' + orderId + ' mpStatus: ' + mpStatus + ' intStatus: ' + is.internalStatus)
                    BlibliOrders.update({ 'orderId': orderId }, {
                        $set: {
                            mpStatus: mpStatus,
                            internalStatus: is.internalStatus,
                            invoiceNo: invoiceNo,
                            mpCreateTime: mpCreateTime,
                            trackingNo: respData.awbNumber,
                            insertType: 'API Detail - Update ',
                            updateAt: new Date()
                        }
                    });
                    BlibliOrderDetail.update({ 'orderId': orderId }, {
                        $set: {
                            mpStatus: mpStatus,
                            internalStatus: is.internalStatus,
                            invoiceNo: invoiceNo,
                            mpCreateTime: mpCreateTime,
                            orders: respData,
                            trackingNo: respData.awbNumber,
                            insertType: 'API Detail - Update ',
                            updateAt: new Date()
                        }
                    });
                    // Meteor.call('ShopMp.lastInsertDate', 'Tokopedia', shopId);
                    Meteor.call('agregateBlibli.update');
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