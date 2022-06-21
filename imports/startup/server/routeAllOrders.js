import { Meteor } from 'meteor/meteor';
import { JsonRoutes } from 'meteor/simple:json-routes';
// import { Links } from '../../api/links/links';
import { allOrder, ProductOrders} from '../../api/orders/orders';
import { InternalStatus } from '../../api/internalStatus/internalStatus';
import { ExternalStore, ExternalStoreOrder } from '../../api/externalStore/externalStore.js';

/** VCI */
// $vci = array(2929640, 8979999, 10259050, 5032597, 11110842);
// $alamat = 'http://api.gosyenretail.co.id:8085/api/apisalesegogo';
// $sent = $c -> oper($alamat, $body, "$2y$10$5fRMD8oV16UCVvNxWVXpxu4nic4y9kb2jcsNHPhZVqjQaafJeZiUC");

JsonRoutes.setResponseHeaders({
    "content-type": "application/json; charset=utf-8"
});

JsonRoutes.setResponseHeaders({
    "Cache-Control": "no-store",
    "Pragma": "no-cache",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With"
});

//insert new order
JsonRoutes.add('POST', 'orders/allorder/insert', function (request, response) {
    let result = request.body
    let order_id = result.order_id;
    let invoice_no = result.invoice_no;
    let checkOrder = allOrder.findOne({ 'order_id': order_id, 'invoice_no': invoice_no})
    if (!checkOrder) {
        let productData = result.products
        console.log('tokped result:' + result);
        allOrder.insert(result);
        productData.forEach(product => {
            ProductOrders.insert(product)
        });
        //new order
        Meteor.call('agregateAllOrders.update',result.marketplace);
        Meteor.call('agregateAll.update');
    }

});

JsonRoutes.add('POST', 'orders/allorder/UpdateOrder', function (request, response) {
    // console.log(request.body)
    let result = request.body
    let order_id = result.order_id;
    let checkOrder = allOrder.findOne({ 'order_id': order_id })
    if(checkOrder){
        allOrder.update({'order_id' : order_id},{
            $set :{
                order_id : order_id,
                salesorder_no : result.salesorder_no,
                channel_name : result.channel_name,
                payment_date : result.payment_date,
                delivery_date : result.delivery_date,
                completion_date : result.completion_date,
                cancel_reason_detail : result.cancel_reason_detail,
                payment_method : result.payment_method,
                payment_ref : result.payment_ref,
                customer_name : result.customer_name,
                customer_phone : result.customer_phone,
                customer_email : result.customer_email,
                recipient_name : result.recipient_name,
                recipient_phone : result.recipient_phone,
                internal_status : result.internal_status,
                shipping_address : result.shipping_address,
                tracking_no : result.tracking_no,
                channel_status : result.channel_status,
            }
        })
        //new order
        Meteor.call('agregateAllOrders.update',result.marketplace);
        Meteor.call('agregateAll.update');
    }
});
