// Methods related to links

import { Meteor } from 'meteor/meteor';
import { HTTP } from 'meteor/http';
import { check } from 'meteor/check';
import { ExternalStore } from './externalStore.js';


Meteor.methods({
  'externalStore.insert'(mp, storeId, clientId) {
    // check(url, String);
    // check(title, String);
    // var order = orders
    return ExternalStore.insert({
      mp,
      mpid,
      storeId,
      shopName,
      clientId,
      createdAt: new Date(),
    });
  },
  'ShopExternal.lastInsertDate'(mp, shopId) {
    var mp1 = String(mp);
    var shopId1 = String(shopId);
    // console.log('ShopExternal.lastInsertDate mp:' + mp1 + ' shopid:' + shopId1);
    var ids = ExternalStore.findOne({ 'mp': mp1, 'shopId': shopId1 });
    if (ids) {
      return ExternalStore.update({ 'mp': mp1, 'shopId': shopId1 }, {
        $set: {
          lastInsertDate: new Date()
        }
      });
    } else {
      ExternalStore.insert({
        mp: mp1,
        shopId: shopId1,
        lastInsertDate: new Date(),
        sts: '1',
        statusShop: 'external',
        createdAt: new Date()
      })
    }
  },
  'external.tokped.newOrder'(orders, exStore) {
    // console.log('tokped post order');
    // try {
    HTTP.call('POST', 'http://api.gosyenretail.co.id:8085/api/apisalesegogo', {
      headers: {
        Authorization: '$2y$10$5fRMD8oV16UCVvNxWVXpxu4nic4y9kb2jcsNHPhZVqjQaafJeZiUC',
      },
      data: {
        name: 'order',
        shopid: exStore,
        marketplace: 'tokopedia',
        timestamp: new Date(),
        result: orders
      }
    }, (error, result) => {
      console.log(result);
    });
  },
  'external.shopee.newOrder'(orders, extStore) {
    // console.log('shopee post order');
    // try {
    HTTP.call('POST', 'http://api.gosyenretail.co.id:8085/api/apisalesegogo', {
      headers: {
        Authorization: '$2y$10$5fRMD8oV16UCVvNxWVXpxu4nic4y9kb2jcsNHPhZVqjQaafJeZiUC',
      },
      data: {
        name: 'order',
        shopid: extStore,
        marketplace: 'shopee',
        timestamp: new Date(),
        result: orders
      }
    }, (error, result) => {
      console.log(result);
    });
  },
});
