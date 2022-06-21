// Methods related to counseling

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
// import { Answer } from './answer.js';
// import { Questioner } from '../questioner/questioner.js';
import { Brand, BrandLogin, brands } from '../brand.js';
import { Marketplace, ShopMp } from '../../marketplace/marketplace.js';
import { Product } from '../../product/product.js';

Meteor.methods({


    'getbrand'(){
        var brands = Brand.find({},{sort:{brand_name:1}}).fetch()
      //   console.log('test',products)
      return brands
      },
    'brands.list.all'(id) {
        // console.log('id',id)
        return Brand.findOne({'_id':id});
    },
    'brand.all.drop'() {
        return Brand.find({}, { '_id': 1, 'brandName': 1 }).fetch();
    },
    'brand.detail'(bId) {
        return Brand.findOne(bId);
    },
    'brand.insert'(
        brandName,
        brandDescription,
        brandAddress,
        brandCity,
        brandProvince,
        brandCountry,
        brandZip,
        brandEmail,
        brandWeb,
        brandPhone,
        brandFb,
        brandIG,
        brandUsers,
        brandManagers,
        brandStatus
    ) {
        var uId = Meteor.userId();
        return Brand.insert({
            brandName,
            brandDescription,
            brandDescription,
            brandAddress,
            brandCity,
            brandProvince,
            brandCountry,
            brandZip,
            brandEmail,
            brandWeb,
            brandPhone,
            brandFb,
            brandIG,
            brandUsers,
            brandManagers,
            brandStatus,
            createdBy: uId,
            createdAt: new Date(),
        });
    },
    'brand.remove'(id) {
        if (!this.userId) {
            throw new Meteor.Error(401, 'Unauthorized');
        }
        Brand.remove(id);
    },
    'brand.update'(
        id,
        brandName,
        brandDescription,
        brandAddress,
        brandCity,
        brandProvince,
        brandCountry,
        brandZip,
        brandEmail,
        brandWeb,
        brandPhone,
        brandFb,
        brandIG,
        brandUsers,
        brandManagers,
        brandStatus
    ) {
        var uId = Meteor.userId();
        return Brand.update({ '_id': id }, {
            $set: {
                brandName,
                brandDescription,
                brandAddress,
                brandCity,
                brandProvince,
                brandCountry,
                brandZip,
                brandEmail,
                brandWeb,
                brandPhone,
                brandFb,
                brandIG,
                brandUsers,
                brandManagers,
                brandStatus,
                updatedBy: uId,
                updatedAt: new Date(),
            }
        });
    },
    'brand.download'() {
        if (!this.userId) {
            throw new Meteor.Error(401, 'Unauthorized');
        }
        return Brand.find().fetch();
    },

    'brand.inmp.count'(mId) {
        // console.log('mId:' + mId);
        if (!this.userId) {
            throw new Meteor.Error(401, 'Unauthorized');
        }
        var mpCount = BrandLogin.find({ 'marketplaceId': mId }).count();
        // console.log('mpC:' + mpCount);
        return mpCount;
    },
    'brand.marketplace.count'(bId) {
        // console.log('bId:' + bId);
        if (!this.userId) {
            throw new Meteor.Error(401, 'Unauthorized');
        }
        var mpCount = BrandLogin.find({ 'brandId': bId }).count();
        // console.log('mpC:' + mpCount);
        return mpCount;
    },
    'brand.product.count'(bId) {
        // console.log('bId:' + bId);
        if (!this.userId) {
            throw new Meteor.Error(401, 'Unauthorized');
        }
        var mpCount = Product.find({ 'brandId': bId }).count();
        // console.log('mpC:' + mpCount);
        return mpCount;
    },

    //BRAND LOGIN
    'brandLogin.all'() {
        return BrandLogin.find({}).fetch();
    },
    'brandLogin.insert'(
        brandId,
        marketplaceId,
        picId,
        brandLoginDescription,
        brandLoginEmail,
        brandLoginPassword,
        brandLoginPhone,
        brandLoginStatus
    ) {
        var uId = Meteor.userId();
        return BrandLogin.insert({
            brandId,
            marketplaceId,
            picId,
            brandLoginDescription,
            brandLoginEmail,
            brandLoginPassword,
            brandLoginPhone,
            brandLoginStatus,
            createdBy: uId,
            createdAt: new Date(),
        });
    },
    'brandLogin.remove'(id) {
        if (!this.userId) {
            throw new Meteor.Error(401, 'Unauthorized');
        }
        BrandLogin.remove(id);
    },
    'brandLogin.update'(id,
        brandId,
        marketplaceId,
        picId,
        brandLoginDescription,
        brandLoginEmail,
        brandLoginPassword,
        brandLoginPhone,
        brandLoginStatus,
    ) {
        var uId = Meteor.userId();
        return BrandLogin.update({ '_id': id }, {
            $set: {
                brandId: brandId,
                marketplaceId: marketplaceId,
                picId: picId,
                brandLoginDescription: brandLoginDescription,
                brandLoginEmail: brandLoginEmail,
                brandLoginPassword: brandLoginPassword,
                brandLoginPhone: brandLoginPhone,
                brandLoginStatus: brandLoginStatus,
                updatedBy: uId,
                updatedAt: new Date(),
            }
        });
    },
    'brandLogin.downloadAll'() {
        // var ownerId = Meteor.userId();
        var answerResult = BrandLogin.aggregate([
            //Define filter
            // {
            //     $match:
            //     {
            //         'surveyId': sId,
            //     }
            // },
            // Join with brand table
            {
                $lookup: {
                    from: "brand",
                    localField: "brandId",
                    foreignField: "_id",
                    as: "brand_info"
                }
            },
            { $unwind: "$brand_info" },
            // Join with marketplace table
            {
                $lookup: {
                    from: "marketplace",
                    localField: "marketplaceId",
                    foreignField: "_id",
                    as: "marketplace_info"
                }
            },
            { $unwind: "$marketplace_info" },
            // Join with User table
            {
                $lookup: {
                    from: "users",
                    localField: "picId",
                    foreignField: "_id",
                    as: "user_info"
                }
            },
            { $unwind: "$user_info" },
            // define fields 
            {
                $project: {
                    _id: 1,
                    brandId: 1,
                    brandName: "$brand_info.brandName",
                    marketplaceId: 1,
                    marketplaceName: "$marketplace_info.marketplaceName",
                    picId: 1,
                    picName: "$user_info.profile.fullName",
                    brandLoginDescription: 1,
                    brandLoginEmail: 1,
                    brandLoginPassword: 1,
                    brandLoginPhone: 1,
                    brandLoginStatus: 1
                }
            }
        ]);
        // console.log(answerResult);
        return answerResult;
    },
    'brandLoginMp'(brandLoginId) {
        var mp = Marketplace.aggregate([
            {
                $lookup: {
                    from: "brandLogin",
                    pipeline: [{
                        $match:
                        {
                            '_id': brandLoginId
                        },
                    }],
                    as: "brandLoginNew"
                }
            },
            {
                $project: {
                    _id: 1,
                    marketplaceName: 1,
                    brandLoginMp: "$brandLoginNew.marketplaceId"
                }
            }
        ]);
        // console.log(mp);
        return mp;
    },
    'brandLoginPic'(brandLoginId) {
        var pic = Meteor.users.aggregate([
            {
                $lookup: {
                    from: "brandLogin",
                    pipeline: [{
                        $match:
                        {
                            '_id': brandLoginId
                        },
                    }],
                    as: "brandLoginNew"
                }
            },
            {
                $project: {
                    _id: 1,
                    'profile.fullName': 1,
                    picId: "$brandLoginNew.picId"
                }
            }
        ]);
        // console.log(mp);
        return pic;
    },
    'brandManagers'(brandId) {
        var pic = Meteor.users.aggregate([
            {
                $lookup: {
                    from: "brand",
                    pipeline: [{
                        $match:
                        {
                            '_id': brandId
                        },
                    }],
                    as: "brandNew"
                }
            },
            {
                $project: {
                    _id: 1,
                    'profile.fullName': 1,
                    picId: "$brandNew.brandManagers"
                }
            }
        ]);
        // console.log(mp);
        return pic;
    },
    'brandProduct'(pId) {
        // console.log('pId:' + pId);
        var pic = Brand.aggregate([
            {
                $lookup: {
                    from: "product",
                    pipeline: [{
                        $match:
                        {
                            '_id': pId
                        },
                    }],
                    as: "pNew"
                }
            },
            {
                $project: {
                    _id: 1,
                    'brandName': 1,
                    pId: "$pNew.brandId"
                }
            }
        ]);
        // console.log(pic);
        return pic;
    },
    'brandOrder'(oId) {
        // console.log('pId:' + pId);
        var pic = Brand.aggregate([
            {
                $lookup: {
                    from: "order",
                    pipeline: [{
                        $match:
                        {
                            '_id': oId
                        },
                    }],
                    as: "oNew"
                }
            },
            {
                $project: {
                    _id: 1,
                    'brandName': 1,
                    oId: "$oNew.brandId"
                }
            }
        ]);
        // console.log(pic);
        return pic;
    },

});
