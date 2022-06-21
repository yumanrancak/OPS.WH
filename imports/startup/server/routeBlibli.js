import { Meteor } from 'meteor/meteor';
import { JsonRoutes } from 'meteor/simple:json-routes';
import { BlibliOrders, BlibliOrdersDetail, BlibliStatus, BlibliTracking, BlibliOrdersItems, ProductOrders, allOrder } from '../../api/orders/orders';
import { InternalStatus } from '../../api/internalStatus/internalStatus';

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
// JsonRoutes.Middleware.use('/orders', (req, res, next) => {
//     next();
// });
JsonRoutes.add('POST', 'orders/blibli/insert', function (request, response) {
    let result = request.body
    let order_id = result.order_id;
    let invoice_no = result.invoice_no;
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
        console.log('Blibli insertId: ' + insertId);
        // console.log('blibli result:' + result);
        productData.forEach(product => {
            var productId = ProductOrders.insert(product)
            console.log('Blibli productId: ' + productId);
        });
        // Meteor.call('agregateAllOrders.update', 'blibli');
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
        console.log('Blibli duplicate: ' + order_id);
        JsonRoutes.sendResult(response, {
            code: 200,
            data: {
                status: 'Duplicate Data',
                order_id: order_id
            }
        });
    }


});

JsonRoutes.add('POST', 'orders/blibli/UpdateOrder', function (request, response) {
    // console.log(request.body)
    let result = request.body
    let order_id = result.order_id;
    let checkOrder = allOrder.find({ 'order_id': order_id }).count();
    if (checkOrder > 0) {
        var updateId = allOrder.update({ 'order_id': order_id }, {
            $set: {
                order_id: order_id,
                payment_date: result.payment_date,
                delivery_date: result.delivery_date,
                completion_date: result.completion_date,
                cancel_reason_detail: result.cancel_reason_detail,
                cancel_reason: result.cancel_reason,
                channel_status: result.channel_status,
                tracking_no: result.tracking_no,
                internal_status: result.internal_status,
                shipper_mp: result.shipper_mp,
                shipper_internal: result.shipper_internal,
            }
        })
        //new order
        // Meteor.call('agregateAllOrders.update', 'blibli');
        // Meteor.call('agregateAll.update');
        JsonRoutes.sendResult(response, {
            code: 200,
            data: {
                status: 'Data Update',
                id: updateId,
                order_id: order_id
            }
        });
        console.log('Blibli Update Data: ' + order_id);
    } else {
        // console.log('Null')
        JsonRoutes.sendResult(response, {
            code: 200,
            data: {
                status: 'Data Notfound',
                order_id: order_id
            }
        });
        console.log('Blibli Data Not Found, fetch new order: ' + order_id);
        Meteor.call('getNewOrder', order_id, 'blibli');
    }
});

// JsonRoutes.add('POST', 'orders/blibli/product_items', function (request, response) {
//     var orderId = request.body.orderItem.orderId;
//     var mpStatus = request.body.orderItem.orderStatus;
//     var orderCount = BlibliOrdersItems.find({ 'orders.orderItem.orderId': orderId }).count();
//     var is = InternalStatus.findOne({ 'mp': 'blibli', 'mpStatus': mpStatus });
//     if (orderCount > 0) {
//         //new or update order
//         BlibliOrdersItems.update({ 'orders.orderItem.orderId': orderId }, {
//             $set: {
//                 ordersItems: request.body,
//                 internalStatus: is.internalStatus,
//                 updatedAt: new Date()
//             }
//         });

//     } else {
//         //new order
//         BlibliOrders.insert({
//             ordersItems: request.body,
//             marketplaceId: "blibli",
//             internalStatus: is.internalStatus,
//             createdAt: new Date()
//         });
//     }
//     JsonRoutes.sendResult(response, {
//         code: 200
//     });
// });