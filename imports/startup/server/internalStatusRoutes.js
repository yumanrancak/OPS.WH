import { Meteor } from 'meteor/meteor';
import { JsonRoutes } from 'meteor/simple:json-routes';
import { InternalStatus } from '../../api/internalStatus/internalStatus';

JsonRoutes.Middleware.use('/internalStatus', (req, res, next) => {
    const authUserId = req.userId;
    if (!authUserId) {
        JsonRoutes.sendResult(res, {
            code: 401,
            data: {
                result: "ERROR"
            }
        });
    }
    next();
});

JsonRoutes.add('POST', 'internalStatus/insert', function (request, response) {
    // The authenticated user's ID will be set by this middleware
    var userId = request.userId;

    var internalStatus = InternalStatus.insert({
        mp: request.body.mp,
        mpStatus: request.body.mpStatus,
        internalStatus: request.body.internalStatus,
        createdBy: userId,
        createdAt: new Date()
    });
    JsonRoutes.sendResult(response, {
        code: 200,
        data: {
            status: 'internalStatus insert',
            id: internalStatus
        }
    });
    // }

});