/* eslint-disable import/no-unresolved */
// import { each } from 'jquery';
import { Meteor } from 'meteor/meteor';
import { Brand, BrandLogin } from '../brand';
// import { ReactiveAggregate } from 'meteor/tunguska:reactive-aggregate';
import { publishPagination } from 'meteor/kurounin:pagination';
import { ReactiveTable } from 'meteor/aslagle:reactive-table';

ReactiveTable.publish('brandData', function () { return Brand; }, {});
ReactiveTable.publish('brandLoginData', function () { return BrandLogin; }, {});
// Publish only the current user's items
ReactiveTable.publish("brandLoginMarketplaceData", BrandLogin, function (bId) {
    return { "brandId": bId };
});
// ReactiveTable.publish('brandLoginMarketplaceData', function () { return BrandLogin; }, {});
Meteor.publish('brand.single', function (pId) {
    // console.log(pId);
    return Brand.find(pId);
});
publishPagination(Brand, {
    transform_filters: function (filters, options) {
        allowedKeys = ['brandName'];
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
publishPagination(BrandLogin, {
    transform_filters: function (filters, options) {
        allowedKeys = ['brandId', 'marketplaceId'];
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