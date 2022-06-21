import { Meteor } from 'meteor/meteor';
import { JsonRoutes } from 'meteor/simple:json-routes';

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
JsonRoutes.Middleware.use('/auth', JsonRoutes.Middleware.parseBearerToken);
JsonRoutes.Middleware.use('/auth', JsonRoutes.Middleware.authenticateMeteorUserByToken);

JsonRoutes.add('POST', 'mp/update', function (request, response) {
    Meteor.call('apimptokenGet');
    JsonRoutes.sendResult(response, {
        code: 200
    });
});