// All links-related publications

import { Meteor } from 'meteor/meteor';
import { ShopMp, Marketplace } from '../marketplace.js';
import { publishPagination } from 'meteor/kurounin:pagination';
import { ReactiveTable } from 'meteor/aslagle:reactive-table';

Meteor.publish('shopMp.all', function () {
  return ShopMp.find();
});

ReactiveTable.publish('marketplaceData', function () { return Marketplace; }, {});

publishPagination(Marketplace, {
  transform_filters: function (filters, options) {
    allowedKeys = ['marketplaceName', 'marketplaceStatus'];
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