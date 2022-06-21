import { Meteor } from 'meteor/meteor';
import { JsonRoutes } from 'meteor/simple:json-routes';
import { LazadaOrders, LazadaOrdersDetail, LazadaStatus, LazadaTracking, ProductOrders, allOrder } from '../../api/orders/orders';
import { InternalStatus } from '../../api/internalStatus/internalStatus';
import { ExternalStore, ExternalStoreOrder } from '../../api/externalStore/externalStore.js';

JsonRoutes.setResponseHeaders({
    "content-type": "application/json; charset=utf-8"
});

JsonRoutes.setResponseHeaders({
    "Cache-Control": "no-store",
    "Pragma": "no-cache",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
    // "Authorization":
});
// JsonRoutes.Middleware.use('/auth', JsonRoutes.Middleware.parseBearerToken);
// JsonRoutes.Middleware.use('/auth', JsonRoutes.Middleware.authenticateMeteorUserByToken);

JsonRoutes.add('POST', 'orders/lazada/insert', function (request, response) {
    let result = request.body
    let order_id = result.order_id;
    let invoice_no = result.invoice_no;
    let tracking_no = result.tracking_no;
    let checkOrder = allOrder.find({ 'order_id': order_id, 'invoice_no': invoice_no }).count();
    if (checkOrder == 0) {
        let productData = result.products
        // allOrder.insert(result);
        var insertId = allOrder.insert({
            store_id: result.store_id,
            // brand_id: result.brand_id,
            // brand_name: result.brand_name,
            marketplace: result.marketplace,
            order_id: result.order_id,
            insurance_cost: result.insurance_cost,
            invoice_no: result.invoice_no,
            payment_date: result.payment_date != null ? new Date(result.payment_date) : null,
            payment_method: result.payment_method,
            delivery_date: result.delivery_date != null ? new Date(result.delivery_date) : null,
            completion_date: result.completion_date != null ? new Date(result.completion_date) : null,
            customer_name: result.customer_name,
            customer_phone: result.customer_phone,
            customer_email: result.customer_email,
            sub_total: result.sub_total,
            shipping_cost: result.shipping_cost,
            grand_total: result.grand_total,
            marketplace_status: result.marketplace_status,
            fk_user_create: result.fk_user_create,
            recipient_name: result.recipient_name,
            recipient_phone: result.recipient_phone,
            shipping_address: result.shipping_address,
            shipping_area: result.shipping_area,
            shipping_city: result.shipping_city,
            shipping_province: result.shipping_province,
            shipping_post_code: result.shipping_post_code,
            shipping_country: result.shipping_country,
            shipper_mp: result.shipper_mp,
            shipper_internal: result.shipper_internal,
            tracking_no: result.tracking_no,
            channel_status: result.channel_status,
            internal_status: result.internal_status,
            cancel_reason: result.cancel_reason,
            cancel_reason_detail: result.cancel_reason_detail,
            products: result.products,
            validasi1status: false,
            create_date: new Date(result.create_date)
        });
        console.log('Lazada insertId: ' + insertId);
        // console.log('lazada result:' + result);
        productData.forEach(product => {
            var productId = ProductOrders.insert(product);
            console.log('Lazada productId: ' + productId);
        });
        //new order
        // Meteor.call('agregateAllOrders.update', 'lazada');
        // Meteor.call('agregateAll.update');
        JsonRoutes.sendResult(response, {
            code: 200,
            data: {
                status: 'Data insert',
                id: insertId,
                order_id: order_id
            }
        });
    } else {
        console.log('Lazada duplicate: ' + order_id);
        JsonRoutes.sendResult(response, {
            code: 200,
            data: {
                status: 'Duplicate Data',
                order_id: order_id
            }
        });
    }
});

JsonRoutes.add('POST', 'orders/lazada/UpdateOrder', function (request, response) {
    // console.log(request.body)
    let result = request.body
    let order_id = result.order_id;
    let checkOrder = allOrder.find({ 'order_id': order_id }).count();
    if (checkOrder > 0) {
        var updateId = allOrder.update({ 'order_id': order_id }, {
            $set: {
                order_id: order_id,
                shipper_internal: result.shipper_internal,
                shipper_mp: result.shipper_mp,
                tracking_no: result.tracking_no,
                channel_status: result.channel_status,
                cancel_reason_detail: result.cancel_reason_detail,
                cancel_reason: result.cancel_reason,
                internal_status: result.internal_status,
            }
        })
        //new order
        // Meteor.call('agregateAllOrders.update', 'lazada');
        // Meteor.call('agregateAll.update');
        JsonRoutes.sendResult(response, {
            code: 200,
            data: {
                status: 'Data Update',
                id: updateId,
                order_id: order_id
            }
        });
        console.log('Lazada Update Data: ' + order_id);
    } else {
        // console.log('Null')
        JsonRoutes.sendResult(response, {
            code: 200,
            data: {
                status: 'Data Notfound',
                order_id: order_id
            }
        });
        console.log('Lazada Data Not Found, fetch new order: ' + order_id);
        Meteor.call('getNewOrder', order_id, 'lazada');
    }
});