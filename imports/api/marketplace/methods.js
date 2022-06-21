// Methods related to links

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ShopMp, Marketplace } from './marketplace';


Meteor.methods({
  'marketplace.all'() {
    return Marketplace.find({}).fetch();
  },
  'marketplace.detail'(mId) {
    return Marketplace.findOne(mId);
  },
  'marketplace.all.drop'() {
    return Marketplace.find({}, { '_id': 1, 'marketplaceName': 1 }).fetch();
  },
  'marketplace.insert'(marketplaceName, marketplaceDescription, marketplaceStatus) {
    var uId = Meteor.userId();
    return Marketplace.insert({
      marketplaceName, marketplaceDescription, marketplaceStatus, createdBy: uId, createdAt: new Date(),
    });
  },
  'marketplace.remove'(id) {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    Marketplace.remove(id);
  },
  'marketplace.update'(id, marketplaceName, marketplaceDescription, marketplaceStatus,) {
    var uId = Meteor.userId();
    return Marketplace.update({ '_id': id }, {
      $set: {
        marketplaceName: marketplaceName,
        marketplaceDescription: marketplaceDescription,
        marketplaceStatus: marketplaceStatus,
        updatedBy: uId,
        updatedAt: new Date(),
      }
    });
  },
  'ShopMp.insert'(shop) {
    // check(url, String);
    // check(title, String);
    // var order = orders
    return ShopMp.insert({
      shop,
      createdAt: new Date(),
    });
  },
  'ShopMp.lastInsertDate'(mp, shopId) {
    var mp1 = String(mp);
    var shopId1 = String(shopId);
    // console.log('ShopMp.lastInsertDate mp:' + mp1 + ' shopid:' + shopId1);
    var ids = ShopMp.findOne({ 'channel': mp1, 'shopid': shopId1 });
    if (ids) {
      return ShopMp.update({ 'channel': mp1, 'shopid': shopId1 }, {
        $set: {
          lastInsertDate: new Date()
        }
      });
    } else {
      ShopMp.insert({
        channel: mp1,
        shopid: shopId1,
        lastInsertDate: new Date(),
        sts: '1',
        statusShop: 'external',
        createdAt: new Date()
      })
    }
  },
  'apimptokenGet'() {
    console.log('api mp token');
    // try {
    HTTP.call('GET', 'https://erp.egogohub.com/cron/apimptoken.php', {
    }, (error, result) => {
      if (!error) {
        // console.log(result);
        for (let i = 0; i < result.data.length; i++) {
          var item = result.data[i];
          var rowid = item.rowid;
          var rowCount = ShopMp.find({ 'rowid': rowid }).count();
          if (rowCount > 0) {
            ShopMp.update({ 'rowid': rowid }, {
              $set: {
                brand: item.brand,
                channel: item.channel,
                rowid: item.rowid,
                fk_user_create: item.fk_user_create,
                tms: item.tms,
                fk_channel: item.fk_channel,
                fk_brand: item.fk_brand,
                uid: item.uid,
                pwd: item.pwd,
                shopid: item.shopid,
                shopname: item.shopname,
                acc_token: item.acc_token,
                ref_token: item.ref_token,
                fsid: item.fsid,
                apiuid: item.apiuid,
                apipwd: item.apipwd,
                apikey: item.apikey,
                sts: item.sts,
                rank: item.rank,
                api_date: item.api_date,
                quit_date: item.quit_date,
                note: item.note,
                updateAt: new Date()
              }
            });
          } else {
            ShopMp.insert({
              brand: item.brand,
              channel: item.channel,
              rowid: item.rowid,
              fk_user_create: item.fk_user_create,
              tms: item.tms,
              fk_channel: item.fk_channel,
              fk_brand: item.fk_brand,
              uid: item.uid,
              pwd: item.pwd,
              shopid: item.shopid,
              shopname: item.shopname,
              acc_token: item.acc_token,
              ref_token: item.ref_token,
              fsid: item.fsid,
              apiuid: item.apiuid,
              apipwd: item.apipwd,
              apikey: item.apikey,
              sts: item.sts,
              rank: item.rank,
              api_date: item.api_date,
              quit_date: item.quit_date,
              note: item.note,
              createdAt: new Date()
            });
          }
        }
        return result;
      }
    });
  },
});
