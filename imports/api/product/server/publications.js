/* eslint-disable import/no-unresolved */
import { Meteor } from 'meteor/meteor';
import { ProductLot, Product, ProductStock, ProductVariant, ProductCategories, manualstock } from '../product.js';
import { publishPagination } from 'meteor/kurounin:pagination';
import { ReactiveTable } from 'meteor/aslagle:reactive-table';
import { MovementProduct } from '../../orders/orders.js';



ReactiveTable.publish('productData', function () { return Product; }, {});
ReactiveTable.publish('productLotData', function () { return ProductLot; }, {});
ReactiveTable.publish('productVariantData', function () { return ProductVariant; }, {});
ReactiveTable.publish('productCategoriesData', function () { return ProductCategories; }, {});

ReactiveTable.publish('stockin', manualstock, function () {

    return { $or: [{ category: 'innew' }, { category: 'inreturn' }], finalstatus: { $ne: true } }
  }, {})
ReactiveTable.publish('stockout', manualstock, function () {

    return { $or: [{ category: 'outkol' }, { category: 'outwithdrawal' }, { category: 'outincomplete' },{ category: 'outclaim' }, { category: 'outsample' }], finalstatus: { $ne: true } }
  }, {})
ReactiveTable.publish('stockbroken', manualstock, function () {
  
    return { $or: [{ category: 'outbroken' }, { category: 'outbrokenpackage' }], finalstatus: { $ne: true } }
  }, {})
  
  ReactiveTable.publish('stocktransfer', manualstock, function () {
  
    return { category: 'transfer', finalstatus: { $ne: true } }
  }, {})
  
Meteor.publish('all.manualstock', function () {
    var data = manualstock.find({ finalstatus: { $eq: true } },{})
    return data
  });
Meteor.publish('product.single', function (pId) {
    // console.log(pId);
    return Product.find(pId);
});
  
publishPagination(Product, {
    transform_filters: function (filters, options) {
        allowedKeys = ['brandId'];
        const modifiedFilters = [];
        // filters is an array of the provided filters (client side filters & server side filters)
        for (let i = 0; i < filters.length; i++) {
            modifiedFilters[i] = _.extend(
                _.pick(filters[i], allowedKeys),
            );
        }
        return modifiedFilters;
    },
});
publishPagination(ProductLot, {
    transform_filters: function (filters, options) {
        allowedKeys = ['productId'];
        const modifiedFilters = [];
        // filters is an array of the provided filters (client side filters & server side filters)
        for (let i = 0; i < filters.length; i++) {
            modifiedFilters[i] = _.extend(
                _.pick(filters[i], allowedKeys),
            );
        }
        return modifiedFilters;
    },
});
publishPagination(ProductVariant, {
    transform_filters: function (filters, options) {
        allowedKeys = ['productId'];
        const modifiedFilters = [];
        // filters is an array of the provided filters (client side filters & server side filters)
        for (let i = 0; i < filters.length; i++) {
            modifiedFilters[i] = _.extend(
                _.pick(filters[i], allowedKeys),
            );
        }
        return modifiedFilters;
    },
});
publishPagination(ProductCategories, {
    transform_filters: function (filters, options) {
        allowedKeys = ['productId'];
        const modifiedFilters = [];
        // filters is an array of the provided filters (client side filters & server side filters)
        for (let i = 0; i < filters.length; i++) {
            modifiedFilters[i] = _.extend(
                _.pick(filters[i], allowedKeys),
            );
        }
        return modifiedFilters;
    },
});