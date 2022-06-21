// Methods related to links

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
// import { check } from 'meteor/check';
import { SoCronLog } from '../cronlog';
// import { TokpedOrders, ShopeeOrderDetail, TokpedOrderDetail, ShopeeOrders } from '../orders';
// import { InternalStatus } from '../../internalStatus/internalStatus';
// import { ShopMp } from '../../marketplace/marketplace';
// import { ExternalStore } from '../../externalStore/externalStore';
// import { result } from 'lodash';


Meteor.methods({
  'soCronLog.insert'(
    startDate,
    endDate,
    marketplaceId,
    brandId,
    storeId,
    nTransaction,
    isActive
  ) {
    // check(url, String);
    // check(title, String);
    // var order = orders
    return SoCronLog.insert({
      startDate,
      endDate,
      marketplaceId,
      brandId,
      storeId,
      nTransaction,
      isActive,
      createdAt: new Date(),
    });
  },
  'soCronLog.update'(
    startDate,
    endDate,
    marketplaceId,
    brandId,
    storeId,
    nTransaction,
    isActive
  ) {
    return SoCronLog.update({ '_id': id }, {
      $set: {
        startDate,
        endDate,
        marketplaceId,
        brandId,
        storeId,
        nTransaction,
        isActive,
        updatedAt: new Date(),
      }
    });
  },
});
