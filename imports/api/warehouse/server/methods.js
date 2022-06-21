// Methods related to counseling

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
// import { Answer } from './answer.js';
// import { Questioner } from '../questioner/questioner.js';
import { Movement, Stock, Warehouse } from '../warehouse.js';

Meteor.methods({
    //WAREHOUSE
    'warehouse.all'() {
        return Warehouse.find({}).fetch();
    },
    'warehouse.detail'(wId) {
        return Warehouse.findOne(wId);
    },
    'warehouse.all.drop'() {
        return Warehouse.find({}, { '_id': 1, 'warehouseName': 1 }).fetch();
    },
    'warehouse.insert'(
        warehouseName,
        warehouseDescription,
        warehouseAddress,
        warehouseCity,
        warehouseProvince,
        warehouseCountry,
        warehouseZip,
        warehouseStatus
    ) {
        var uId = Meteor.userId();
        return Warehouse.insert({
            warehouseName,
            warehouseDescription,
            warehouseAddress,
            warehouseCity,
            warehouseProvince,
            warehouseCountry,
            warehouseZip,
            warehouseStatus,
            createdBy: uId,
            createdAt: new Date(),
        });
    },
    'warehouse.remove'(id) {
        if (!this.userId) {
            throw new Meteor.Error(401, 'Unauthorized');
        }
        Warehouse.remove(id);
    },
    'warehouse.update'(
        id,
        warehouseName,
        warehouseDescription,
        warehouseAddress,
        warehouseCity,
        warehouseProvince,
        warehouseCountry,
        warehouseZip,
        warehouseStatus
    ) {
        var uId = Meteor.userId();
        return Warehouse.update({ '_id': id }, {
            $set: {
                warehouseName: warehouseName,
                warehouseDescription: warehouseDescription,
                warehouseAddress: warehouseAddress,
                warehouseCity: warehouseCity,
                warehouseProvince: warehouseProvince,
                warehouseCountry: warehouseCountry,
                warehouseZip: warehouseZip,
                warehouseStatus: warehouseStatus,
                updatedBy: uId,
                updatedAt: new Date(),
            }
        });
    },
    'warehouse.download'() {
        if (!this.userId) {
            throw new Meteor.Error(401, 'Unauthorized');
        }
        return Warehouse.find({}).fetch();
    },

    // MOVEMENT
    'movement.all'() {
        return Movement.find({}).fetch();
    },
    'movement.insert'(
        movementDate,
        productId,
        warehouseId,
        movementType,
        movementQty,
    ) {
        var uId = Meteor.userId();
        var countStock = Stock.findOne({ 'productId': productId, 'warehouseId': warehouseId });
        if (countStock) {
            console.log('stok exist');
            var stockQty = Number(countStock.stockQty);
            var moveQty = Number(movementQty);
            if (movementType == 'in') {
                var stockUpdate = stockQty + moveQty;
            } else {
                var stockUpdate = stockQty - moveQty;
            }
            Stock.update({ 'productId': productId, 'warehouseId': warehouseId }, {
                $set: {
                    stockQty: stockUpdate,
                    updatedBy: uId,
                    updateAt: new Date(),
                }
            });
        } else {
            console.log('stok null');
            Stock.insert({
                productId: productId,
                warehouseId: warehouseId,
                stockQty: movementQty,
                createdBy: uId,
                createdAt: new Date(),
            })
        }

        return Movement.insert({
            movementDate,
            productId,
            warehouseId,
            movementType,
            movementQty,
            createdBy: uId,
            createdAt: new Date(),
        });
    },
    'movement.remove'(id) {
        if (!this.userId) {
            throw new Meteor.Error(401, 'Unauthorized');
        }
        Movement.remove(id);
    },
    'movement.update'(
        id,
        movementDate,
        productId,
        warehouseId,
        movementType,
        movementQty,
    ) {
        var uId = Meteor.userId();
        return Movement.update({ '_id': id }, {
            $set: {
                movementDate: movementDate,
                productId: productId,
                warehouseId: warehouseId,
                movementType: movementType,
                movementQty: movementQty,
                updatedBy: uId,
                updatedAt: new Date(),
            }
        });
    },
    'movement.download'() {
        var dataResult = Movement.aggregate([
            {
                $lookup: {
                    from: "product",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product_info"
                }
            },
            { $unwind: "$product_info" },

            {
                $lookup: {
                    from: "warehouse",
                    localField: "warehouseId",
                    foreignField: "_id",
                    as: "warehouse_info"
                }
            },
            { $unwind: "$warehouse_info" },
            {
                $project: {
                    _id: 1,
                    productId: 1,
                    productName: "$product_info.productName",
                    warehouseId: 1,
                    warehouseName: "$warehouse_info.warehouseName",
                    movementDate: 1,
                    movementType: 1,
                    movementQty: 1,
                }
            }
        ]);
        // console.log(answerResult);
        return dataResult;
    },
    'stock.product'(pId) {
        console.log('pId:' + pId);
        var stockD = Stock.find({ 'productId': pId }).fetch();
        console.log('stockD: ' + stockD);
        return stockD;
    },
    'stock.warehouse'(wId) {
        return Stock.find({ 'warehouseId': wId });
    },
    'stock.warehouse.count'(wId) {
        return Stock.find({ 'warehouseId': wId }).count();
    },
    'stock.download'() {
        var dataResult = Stock.aggregate([
            {
                $lookup: {
                    from: "product",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product_info"
                }
            },
            { $unwind: "$product_info" },

            {
                $lookup: {
                    from: "warehouse",
                    localField: "warehouseId",
                    foreignField: "_id",
                    as: "warehouse_info"
                }
            },
            { $unwind: "$warehouse_info" },
            {
                $project: {
                    _id: 1,
                    productId: 1,
                    productName: "$product_info.productName",
                    warehouseId: 1,
                    warehouseName: "$warehouse_info.warehouseName",
                    stockQty: 1,
                    updateAt: 1
                }
            }
        ]);
        // console.log(answerResult);
        return dataResult;
    },
});
