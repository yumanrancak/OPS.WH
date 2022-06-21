import { Meteor } from 'meteor/meteor';
import { JsonRoutes } from 'meteor/simple:json-routes';
// import { Links } from '../../api/links/links';
import { TokpedOrderDetail, TokpedOrders, TokpedStatus, TokopediaOrders, ProductOrders, allOrder } from '../../api/orders/orders';
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
JsonRoutes.add('POST', 'orders/tokped/insert', function (request, response) {
    // console.log('orders tokped')
    let result = request.body
    // console.log(result);
    let order_id = result.order_id;
    let invoice_no = result.invoice_no;
    var checkOrder = allOrder.find({ 'order_id': order_id, 'invoice_no': invoice_no }).count();
    // console.log(checkOrder);
    if (checkOrder == 0) {
        let productData = result.products
        // console.log('tokped result:' + result.create_date);
        // const insertId = allOrder.insert(result);
        const insertId = allOrder.insert({
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
        console.log('Tokopedia insertId: ' + insertId);
        productData.forEach(product => {
            const productId = ProductOrders.insert(product)
            console.log('Tokopedia productId: ' + productId);
        });

        //new order
        // Meteor.call('agregateAllOrders.update', 'tokopedia');
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
        console.log('Tokopedia duplicate: ' + order_id)
        JsonRoutes.sendResult(response, {
            code: 200,
            data: {
                status: 'Duplicate Data',
                order_id: order_id
            }
        });
    }

});
// JsonRoutes.add('POST', 'orders/tokped/statusupdate', function (request, response) {
//     var orderId = request.body.order_id;
//     var mpStatus = request.body.order_status;
//     var shopId = request.body.shop_id;
//     var extStore = ExternalStore.find({ 'mp': 'tokopedia', 'shopId': shopId }).count();
//     if (extStore > 0) {
//         if (orderCount > 0) {
//             ExternalStoreOrder.update({ 'orderId': orderId }, {
//                 $set: {
//                     mpStatus: mpStatus,
//                     // internalStatus: is.internalStatus,
//                     updateAt: new Date(),
//                 }
//             });
//             JsonRoutes.sendResult(response, {
//                 code: 200,
//                 data: {
//                     status: 'order status change & insert'
//                 }
//             });
//         } else {
//             ExternalStoreOrder.insert({
//                 storeId: shopId,
//                 orderId: orderId,
//                 marketplaceId: "tokopedia",
//                 mpStatus: mpStatus,
//                 // internalStatus: is.internalStatus,
//                 orders: request.body,
//                 createdAt: new Date()
//             });
//             JsonRoutes.sendResult(response, {
//                 code: 200,
//                 data: {
//                     status: 'order status insert'
//                 }
//             });
//         }
//     } else {
//         var orderCount = TokopediaOrders.find({ 'orderId': orderId }).count();
//         if (orderCount > 0) {
//             Meteor.call('tokopediaDetailOrder.update', orderId, function (error, result) {
//                 // 'result' is the method return value
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     Meteor.call('ShopMp.lastInsertDate', 'Tokopedia', shopId);
//                     Meteor.call('agregateTokopedia.update');
//                     Meteor.call('agregateAll.update');
//                 }
//             });
//         } else {
//             JsonRoutes.sendResult(response, {
//                 code: 200
//             });
//             // if (id4) {
//             Meteor.call('tokopediaDetailOrder.insert', orderId, function (error, result) {
//                 // 'result' is the method return value
//                 if (error) {
//                     console.log(error);
//                 } else {
//                     Meteor.call('ShopMp.lastInsertDate', 'Tokopedia', shopId);
//                     Meteor.call('agregateTokopedia.update');
//                     Meteor.call('agregateAll.update');
//                 }
//             });
//         }
//     }
// });

JsonRoutes.add('POST', 'orders/tokped/UpdateOrder', function (request, response) {
    let result = request.body
    // console.log(result)
    let order_id = result.order_id;
    let checkOrder = allOrder.find({ 'order_id': order_id }).count();
    // console.log(checkOrder);
    if (checkOrder > 0) {
        var updateId = allOrder.update({ 'order_id': order_id }, {
            $set: {
                order_id: order_id,
                salesorder_no: result.salesorder_no,
                channel_name: result.channel_name,
                payment_date: result.payment_date,
                delivery_date: result.delivery_date,
                completion_date: result.completion_date,
                cancel_reason_detail: result.cancel_reason_detail,
                payment_method: result.payment_method,
                payment_ref: result.payment_ref,
                customer_name: result.customer_name,
                customer_phone: result.customer_phone,
                customer_email: result.customer_email,
                recipient_name: result.recipient_name,
                recipient_phone: result.recipient_phone,
                internal_status: result.internal_status,
                shipping_address: result.shipping_address,
                tracking_no: result.tracking_no,
                channel_status: result.channel_status,
                shipper_mp: result.shipper_mp,
                shipper_internal: result.shipper_internal,
            }
        })
        //new order
        // Meteor.call('agregateAllOrders.update', 'tokopedia');
        // Meteor.call('agregateAll.update');
        JsonRoutes.sendResult(response, {
            code: 200,
            data: {
                status: 'Data Update',
                id: updateId,
                order_id: order_id
            }
        });
        console.log('Tokopedia Update Data: ' + order_id);
    } else {
        console.log('Null')
        JsonRoutes.sendResult(response, {
            code: 200,
            data: {
                status: 'Data Notfound',
                order_id: order_id
            }
        });
        console.log('Tokopedia Data Not Found, fetch new order: ' + order_id);
        Meteor.call('getNewOrder', order_id, 'tokopedia');
    }
});
