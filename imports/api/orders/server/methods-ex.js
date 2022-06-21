// // Methods related to links

// import { Meteor } from 'meteor/meteor';
// import { HTTP } from 'meteor/http';
// // import { check } from 'meteor/check';
// import { TokopediaOrders, ShopeeOrderDetail, TokpedOrderDetail, ShopeeOrders, BukalapakOrders, LazadaOrders, JdidOrders, ZaloraOrders, BlibliOrders, ProductOrders, MovementProduct, OrderErrorLogs, allOrder, batchList, batchListDetail } from '../orders';
// import { InternalStatus } from '../../internalStatus/internalStatus';
// import { ShopMp } from '../../marketplace/marketplace';
// import moment from 'moment';
// import { Roles } from 'meteor/alanning:roles';
// // import { ExternalStore } from '../../externalStore/externalStore';
// // import { result } from 'lodash';


// Meteor.methods({
//   'checkToken'(email, password) {
//     console.log('check api login');
//     var result = HTTP.call('GET', 'https://erp.egogohub.com/api/index.php/login?login=' + email + '&password=' + password + '&reset=0');
//     console.log(result.data);

//     // var role = result.data.success
//     // var roledata = role.nom
//     // var roleexist = Roles.findOne({ '_id': roledata }).count();
//     // var roleexist = Meteor.roleAssignment.find({ 'role._id': roledata }).count()
//     // var roleexist = Meteor.role.find({ '_id': roledata }).count()
//     // console.log('roleexist:' + roleexist);
//     // if (roleexist == 0) {
//     //   Roles.createRole(roledata);
//     // }
//     return result;
//   },
//   'createRole'(email, password, role) {
//     console.log('Create Role', email, password);
//     console.log('user', Meteor.users.find({ 'username': email }).count());
//     if (Meteor.users.find({ 'username': email }).count() === 0) {
//       // var uid = Meteor.userId();
//       let ownerId = Accounts.createUser({
//         username: email,
//         password: password
//       });
//       // console.log('uid',ownerId + '-' + role)
//       Roles.addUsersToRoles(ownerId, role);
//     }
//   },
  
//   'Scan.Manual'(id){
//     var tokped = TokopediaOrders.findOne({ '_id': id });
//     var shopee = ShopeeOrders.findOne({ '_id': id });
//     var blibli = BlibliOrders.findOne({ '_id': id });
//     var bukalapak = BukalapakOrders.findOne({ '_id': id });
//     var zalora = ZaloraOrders.findOne({ '_id': id });
//     var jdid = JdidOrders.findOne({ '_id': id });
//     var lazada = LazadaOrders.findOne({ '_id': id });
//     if (tokped) {
//       return TokopediaOrders.update({ '_id': id }, {
//         $set: {
//           validasi1status: true,
//           validasi1At: new Date(),
//           validasi1By: Meteor.userId()
//         }
//       });
//     }
//     else if (shopee) {
//       return ShopeeOrders.update({ '_id': id }, {
//         $set: {
//           validasi1status: true,
//           validasi1At: new Date(),
//           validasi1By: Meteor.userId()
//         }
//       });
//     }
//     else if (zalora) {
//       return ZaloraOrders.update({ '_id': id }, {
//         $set: {
//           validasi1status: true,
//           validasi1At: new Date(),
//           validasi1By: Meteor.userId()
//         }
//       });
//     }
//     else if (jdid) {
//       return JdidOrders.update({ '_id': id }, {
//         $set: {
//           validasi1status: true,
//           validasi1At: new Date(),
//           validasi1By: Meteor.userId()
//         }
//       });
//     }
//     else if (lazada) {
//       return LazadaOrders.update({ '_id': id }, {
//         $set: {
//           validasi1status: true,
//           validasi1At: new Date(),
//           validasi1By: Meteor.userId()
//         }
//       });
//     }
//     else if (blibli) {
//       return BlibliOrders.update({ '_id': id }, {
//         $set: {
//           validasi1status: true,
//           validasi1At: new Date(),
//           validasi1By: Meteor.userId()
//         }
//       });
//     }
//     else if (bukalapak) {
//       return BukalapakOrders.update({ '_id': id }, {
//         $set: {
//           validasi1status: true,
//           validasi1At: new Date(),
//           validasi1By: Meteor.userId()
//         }
//       });
//     }
//   },

//   'All.tracking'(tracking) {
//     console.log('All tracking', tracking);

//     var tokped = TokopediaOrders.findOne({ 'tracking_no': tracking });
//     var shopee = ShopeeOrders.findOne({ 'tracking_no': tracking });
//     var blibli = BlibliOrders.findOne({ 'tracking_no': tracking });
//     var bukalapak = BukalapakOrders.findOne({ 'tracking_no': tracking });
//     var zalora = ZaloraOrders.findOne({ 'tracking_no': tracking });
//     var jdid = JdidOrders.findOne({ 'tracking_no': tracking });
//     var lazada = LazadaOrders.findOne({ 'tracking_no': tracking });
//     var check = OrderErrorLogs.findOne({ 'trackingNo': tracking });
//     if (tokped) {
//       if (check) {
//         OrderErrorLogs.remove(check)
//       }
//       return tokped
//     }
//     else if (shopee) {
//       if (check) {
//         OrderErrorLogs.remove(check)
//       }
//       return shopee
//     }
//     else if (zalora) {
//       if (check) {
//         OrderErrorLogs.remove(check)
//       }
//       return zalora
//     }
//     else if (jdid) {
//       if (check) {
//         OrderErrorLogs.remove(check)
//       }
//       return jdid
//     }
//     else if (lazada) {
//       if (check) {
//         OrderErrorLogs.remove(check)
//       }
//       return lazada
//     }
//     else if (blibli) {
//       if (check) {
//         OrderErrorLogs.remove(check)
//       }
//       return blibli
//     }
//     else if (bukalapak) {
//       if (check) {
//         OrderErrorLogs.remove(check)
//       }
//       return bukalapak
//     }
//     else {
//       OrderErrorLogs.insert({
//         trackingNo: tracking,
//         orderid: "",
//         marketplace: "",
//         errorLog: 'Data not Found',
//         typescan: 1,
//         shiperchoose: "",
//         createdAt: new Date(),
//         usedBy: Meteor.userId()
//       });
//       return tokped
//     }
//   },
//   'tokopedia.updatetracking'(track, data) {
//     console.log('mp', data.marketplace)
//     var finderror = OrderErrorLogs.findOne({ 'trackingNo': track })
//     if (!finderror) {
//       console.log('error found', finderror)
//       return finderror
//     }
//     else {
//       OrderErrorLogs.remove(finderror)
//       if (data.marketplace === "tokopedia") {
//         return TokopediaOrders.update({ 'tracking_no': track }, {
//           $set: {
//             validasi1status: true,
//             validasi1At: new Date(),
//             validasi1By: Meteor.userId()
//           }
//         });
//       }
//       else if (data.marketplace === "tokopedia") {
//         return BukalapakOrders.update({ 'tracking_no': track }, {
//           $set: {
//             validasi1status: true,
//             validasi1At: new Date(),
//             validasi1By: Meteor.userId()
//           }
//         });
//       }
//       else if (data.marketplace === "shopee") {
//         return ShopeeOrders.update({ 'tracking_no': track }, {
//           $set: {
//             validasi1status: true,
//             validasi1At: new Date(),
//             validasi1By: Meteor.userId()
//           }
//         });
//       }
//       else if (data.marketplace === "lazada") {
//         return LazadaOrders.update({ 'tracking_no': track }, {
//           $set: {
//             validasi1status: true,
//             validasi1At: new Date(),
//             validasi1By: Meteor.userId()
//           }
//         });
//       }
//       else if (data.marketplace === "blibli") {
//         return BlibliOrders.update({ 'tracking_no': track }, {
//           $set: {
//             validasi1status: true,
//             validasi1At: new Date(),
//             validasi1By: Meteor.userId()
//           }
//         });
//       }
//       else if (data.marketplace === "zalora") {
//         return ZaloraOrders.update({ 'tracking_no': track }, {
//           $set: {
//             validasi1status: true,
//             validasi1At: new Date(),
//             validasi1By: Meteor.userId()
//           }
//         });
//       }
//       else if (data.marketplace === "jdid") {
//         return JdidOrders.update({ 'tracking_no': track }, {
//           $set: {
//             validasi1status: true,
//             validasi1At: new Date(),
//             validasi1By: Meteor.userId()
//           }
//         });
//       }
//     }
//   },
//   // 'tokpedOrders.insert'(orders) {
//   //   return TokopediaOrders.insert({
//   //     orders,
//   //     createdAt: new Date(),
//   //   });
//   // },
//   // 'tokopedia.tracking'(tracking) {
//   //   console.log('tokped tracking', tracking);
//   //   var track = TokopediaOrders.findOne({ 'tracking_no': tracking });
//   //   console.log('track', track);
//   //   if (!track) {
//   //     var check = OrderErrorLogs.findOne({ 'trackingNo': tracking });
//   //     if (!check) {
//   //       OrderErrorLogs.insert({
//   //         trackingNo: tracking,
//   //         orderid: "",
//   //         marketplace: "tokopedia",
//   //         errorLog: 'Data not Found',
//   //         typescan: 1,
//   //         shiperchoose: "",
//   //         createdAt: new Date(),
//   //         usedBy: Meteor.userId()
//   //       });
//   //     }
//   //     else {
//   //       OrderErrorLogs.remove(check)
//   //     }
//   //   }
//   //   return track;
//   // },
//   // 'tokped.countNewOrder'() {
//   //   console.log('tokped count new order');
//   //   var tpCount = TokopediaOrders.find({}).count();
//   //   console.log(tpCount);
//   //   return tpCount;
//   // },
//   // 'tokped.detailOrder'(orderId) {
//   //   console.log('tokped detail order');
//   //   console.log(orderId);
//   //   var orderDetail = TokpedOrderDetail.findOne({ '_id': orderId });
//   //   console.log(orderDetail);
//   //   return orderDetail;
//   // },
//   // 'tokopedia.updatetracking'(track) {
//   //   var finderror = OrderErrorLogs.findOne({ 'trackingNo': track })
//   //   if (finderror) {
//   //     OrderErrorLogs.remove(finderror)
//   //     console.log('error found', finderror)
//   //   }
//   //   return TokopediaOrders.update({ 'tracking_no': track }, {
//   //     $set: {
//   //       validasi1status: true,
//   //       validasi1At: new Date(),
//   //       validasi1By: Meteor.userId()
//   //     }
//   //   });
//   // },


//   // //Bukalapak
//   // 'bukalapak.tracking'(tracking) {
//   //   console.log('bukalapak tracking', tracking);
//   //   var track = BukalapakOrders.findOne({ 'tracking_no': tracking });
//   //   console.log('track', track);
//   //   if (!track) {
//   //     var check = OrderErrorLogs.findOne({ 'trackingNo': tracking });
//   //     if (!check) {
//   //       OrderErrorLogs.insert({
//   //         trackingNo: tracking,
//   //         orderid: "",
//   //         marketplace: "bukalapak",
//   //         errorLog: 'Data not Found',
//   //         typescan: 1,
//   //         shiperchoose: "",
//   //         createdAt: new Date(),
//   //         usedBy: Meteor.userId()
//   //       });
//   //     }
//   //     else {
//   //       OrderErrorLogs.remove(check)
//   //     }
//   //   }
//   //   return track;
//   // },
//   // 'bukalapak.updatetracking'(track) {
//   //   var finderror = OrderErrorLogs.findOne({ 'trackingNo': track })
//   //   if (finderror) {
//   //     OrderErrorLogs.remove(finderror)
//   //     console.log('error found', finderror)
//   //   }
//   //   return BukalapakOrders.update({ 'tracking_no': track }, {
//   //     $set: {
//   //       validasi1status: true,
//   //       validasi1At: new Date(),
//   //       validasi1By: Meteor.userId()
//   //     }
//   //   });
//   // },

//   // //Shopee
//   // 'shopee.tracking'(tracking) {
//   //   console.log('shopee tracking', tracking);
//   //   var track = ShopeeOrders.findOne({ 'tracking_no': tracking });
//   //   console.log('track', track);
//   //   if (!track) {
//   //     var check = OrderErrorLogs.findOne({ 'trackingNo': tracking });
//   //     if (!check) {
//   //       OrderErrorLogs.insert({
//   //         trackingNo: tracking,
//   //         orderid: "",
//   //         marketplace: "shopee",
//   //         errorLog: 'Data not Found',
//   //         typescan: 1,
//   //         shiperchoose: "",
//   //         createdAt: new Date(),
//   //         usedBy: Meteor.userId()
//   //       });
//   //     }
//   //     else {
//   //       OrderErrorLogs.remove(check)
//   //     }
//   //   }
//   //   return track;
//   // },
//   // 'shopee.updatetracking'(track) {
//   //   var finderror = OrderErrorLogs.findOne({ 'trackingNo': track })
//   //   if (finderror) {
//   //     OrderErrorLogs.remove(finderror)
//   //     console.log('error found', finderror)
//   //   }
//   //   return ShopeeOrders.update({ 'tracking_no': track }, {
//   //     $set: {
//   //       validasi1status: true,
//   //       validasi1At: new Date(),
//   //       validasi1By: Meteor.userId()
//   //     }
//   //   });
//   // },

//   // //Blibli
//   // 'Blibli.tracking'(tracking) {
//   //   console.log('Blibli tracking', tracking);
//   //   var track = BlibliOrders.findOne({ 'tracking_no': tracking });
//   //   console.log('track', track);
//   //   if (!track) {
//   //     var check = OrderErrorLogs.findOne({ 'trackingNo': tracking });
//   //     if (!check) {
//   //       OrderErrorLogs.insert({
//   //         trackingNo: tracking,
//   //         orderid: "",
//   //         marketplace: "blibli",
//   //         errorLog: 'Data not Found',
//   //         typescan: 1,
//   //         shiperchoose: "",
//   //         createdAt: new Date(),
//   //         usedBy: Meteor.userId()
//   //       });
//   //     }
//   //     else {
//   //       OrderErrorLogs.remove(check)
//   //     }
//   //   }
//   //   return track;
//   // },
//   // 'Blibli.updatetracking'(track) {
//   //   var finderror = OrderErrorLogs.findOne({ 'trackingNo': track })
//   //   if (finderror) {
//   //     OrderErrorLogs.remove(finderror)
//   //     console.log('error found', finderror)
//   //   }
//   //   return BlibliOrders.update({ 'tracking_no': track }, {
//   //     $set: {
//   //       validasi1status: true,
//   //       validasi1At: new Date(),
//   //       validasi1By: Meteor.userId()
//   //     }
//   //   });
//   // },
//   // //lazada
//   // 'lazada.tracking'(tracking) {
//   //   console.log('lazada tracking', tracking);
//   //   var track = LazadaOrders.findOne({ 'tracking_no': tracking });
//   //   console.log('track', track);
//   //   if (!track) {
//   //     var check = OrderErrorLogs.findOne({ 'trackingNo': tracking });
//   //     if (!check) {
//   //       OrderErrorLogs.insert({
//   //         trackingNo: tracking,
//   //         orderid: "",
//   //         marketplace: "lazada",
//   //         errorLog: 'Data not Found',
//   //         typescan: 1,
//   //         shiperchoose: "",
//   //         createdAt: new Date(),
//   //         usedBy: Meteor.userId()
//   //       });
//   //     }
//   //     else {
//   //       OrderErrorLogs.remove(check)
//   //     }
//   //   }
//   //   return track;
//   // },
//   // 'lazada.updatetracking'(track) {
//   //   var finderror = OrderErrorLogs.findOne({ 'trackingNo': track })
//   //   if (finderror) {
//   //     OrderErrorLogs.remove(finderror)
//   //     console.log('error found', finderror)
//   //   }
//   //   return LazadaOrders.update({ 'tracking_no': track }, {
//   //     $set: {
//   //       validasi1status: true,
//   //       validasi1At: new Date(),
//   //       validasi1By: Meteor.userId()
//   //     }
//   //   });
//   // },
//   // //Jdid
//   // 'Jdid.tracking'(tracking) {
//   //   console.log('Jdid tracking', tracking);
//   //   var track = JdidOrders.findOne({ 'tracking_no': tracking });
//   //   console.log('track', track);
//   //   if (!track) {
//   //     var check = OrderErrorLogs.findOne({ 'trackingNo': tracking });
//   //     if (!check) {
//   //       OrderErrorLogs.insert({
//   //         trackingNo: tracking,
//   //         orderid: "",
//   //         marketplace: "jdid",
//   //         errorLog: 'Data not Found',
//   //         typescan: 1,
//   //         shiperchoose: "",
//   //         createdAt: new Date(),
//   //         usedBy: Meteor.userId()
//   //       });
//   //     }
//   //     else {
//   //       OrderErrorLogs.remove(check)
//   //     }
//   //   }
//   //   return track;
//   // },
//   // 'Jdid.updatetracking'(track) {
//   //   var finderror = OrderErrorLogs.findOne({ 'trackingNo': track })
//   //   if (finderror) {
//   //     OrderErrorLogs.remove(finderror)
//   //     console.log('error found', finderror)
//   //   }
//   //   return JdidOrders.update({ 'tracking_no': track }, {
//   //     $set: {
//   //       validasi1status: true,
//   //       validasi1At: new Date(),
//   //       validasi1By: Meteor.userId()
//   //     }
//   //   });
//   // },


//   // //Jdid
//   // 'Zalora.tracking'(tracking) {
//   //   console.log('Zalora tracking', tracking);
//   //   var track = ZaloraOrders.findOne({ 'tracking_no': tracking });
//   //   console.log('track', track);
//   //   if (!track) {
//   //     var check = OrderErrorLogs.findOne({ 'trackingNo': tracking });
//   //     if (!check) {
//   //       OrderErrorLogs.insert({
//   //         trackingNo: tracking,
//   //         orderid: "",
//   //         marketplace: "zalora",
//   //         errorLog: 'Data not Found',
//   //         typescan: 1,
//   //         shiperchoose: "",
//   //         createdAt: new Date(),
//   //         usedBy: Meteor.userId()
//   //       });
//   //     }
//   //     else {
//   //       OrderErrorLogs.remove(check)
//   //     }
//   //   }
//   //   return track;
//   // },
//   // 'Zalora.updatetracking'(track) {
//   //   var finderror = OrderErrorLogs.findOne({ 'trackingNo': track })

//   //   if (finderror) {
//   //     OrderErrorLogs.remove(finderror)
//   //     console.log('error found', finderror)
//   //   }
//   //   return ZaloraOrders.update({ 'tracking_no': track }, {
//   //     $set: {
//   //       validasi1status: true,
//   //       validasi1At: new Date(),
//   //       validasi1By: Meteor.userId()
//   //     }
//   //   });
//   // },


//   // 'tracking.inserterror'(track) {
//   //       OrderErrorLogs.insert({
//   //         trackingNo: track,
//   //         errorLog: 'Data not Found',
//   //         typescan:1,
//   //         createdAt: new Date(),
//   //         usedBy: Meteor.user()
//   //       });
//   //   },

//   // start all tracking
//   'all_tracking.tracking2'(tracking, shp) {
//     console.log('tracking', tracking, shp);
//     var tokped = TokopediaOrders.findOne({ 'tracking_no': tracking, 'shipper_internal': shp, 'validasi1status': true });
//     var shopee = ShopeeOrders.findOne({ 'tracking_no': tracking, 'shipper_internal': shp, 'validasi1status': true });
//     var blibli = BlibliOrders.findOne({ 'tracking_no': tracking, 'shipper_internal': shp, 'validasi1status': true });
//     var bukalapak = BukalapakOrders.findOne({ 'tracking_no': tracking, 'shipper_internal': shp, 'validasi1status': true });
//     var zalora = ZaloraOrders.findOne({ 'tracking_no': tracking, 'shipper_internal': shp, 'validasi1status': true });
//     var jdid = JdidOrders.findOne({ 'tracking_no': tracking, 'shipper_internal': shp, 'validasi1status': true });
//     var lazada = LazadaOrders.findOne({ 'tracking_no': tracking, 'shipper_internal': shp, 'validasi1status': true });

//     if (tokped) {
//       allOrder.insert({
//         marketplace: tokped.marketplace,
//         brand_id: tokped.brand_id,
//         order_id: tokped.order_id,
//         shipper_internal: tokped.shipper_internal,
//         tracking_no: tokped.tracking_no,
//         validasi1status: tokped.validasi1status,
//         validasi1At: tokped.validasi1At,
//         validasi1By: tokped.validasi1By,
//         products: tokped.products
//       })
//       var prodscount = ProductOrders.find({ 'order_id': tokped.order_id }).count()
//       var prods = ProductOrders.find({ 'order_id': tokped.order_id }).fetch()
//       let array = []
//       // console.log('prod',prods);
//       if (!prodscount) {
//         // var track = tokped
//         OrderErrorLogs.insert({
//           trackingNo: tracking,
//           orderid: tokped.order_id,
//           marketplace: "tokopedia",
//           errorLog: 'Product not Found',
//           shiperchoose: shp,
//           typescan: 2,
//           createdAt: new Date(),
//           usedBy: Meteor.userId()
//         });
//       }
//       else {
//         OrderErrorLogs.remove({ 'trackingNo': tracking })
//         for (let prod of prods) {
//           MovementProduct.insert({
//             marketplaceId: tokped.marketplace,
//             brandId: tokped.brand_name,
//             orderId: tokped.order_id,
//             trackingNo: tokped.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           });
//           var moveprod = {
//             marketplaceId: tokped.marketplace,
//             brandId: tokped.brand_name,
//             orderId: tokped.order_id,
//             trackingNo: tokped.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           }
//           array.push(moveprod)
//         }

//         TokopediaOrders.update({ '_id': tokped._id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         allOrder.update({ 'order_id': tokped.order_id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         let datas = {
//           "data": array
//         }
//         HTTP.post('https://apimp.egogohub.tech/api-stock/stock_movement.php',
//           { data: datas },
//           function (err, res) {
//             console.log(res); // 4
//           });
//         console.log('array', array)

//         console.log('TokopediaOrders INSERT ' + tokped.order_id);
//         array = []
//       }
//       return prods
//     }
//     else if (shopee) {
//       allOrder.insert({
//         marketplace: shopee.marketplace,
//         brand_id: shopee.brand_id,
//         order_id: shopee.order_id,
//         shipper_internal: shopee.shipper_internal,
//         tracking_no: shopee.tracking_no,
//         validasi1status: shopee.validasi1status,
//         validasi1At: shopee.validasi1At,
//         validasi1By: shopee.validasi1By,
//         products: shopee.products
//       })
//       var prodscount = ProductOrders.find({ 'order_id': shopee.order_id }).count()
//       var prods = ProductOrders.find({ 'order_id': shopee.order_id }).fetch()
//       let array = []
//       if (!prodscount) {
//         var track = !shopee
//         OrderErrorLogs.insert({
//           trackingNo: tracking,
//           orderid: shopee.order_id,
//           marketplace: "shopee",
//           errorLog: 'Product not Found',
//           shiperchoose: shp,
//           typescan: 2,
//           createdAt: new Date(),
//           usedBy: Meteor.userId()
//         });
//       }
//       else {
//         // console.log('prod',prods);
//         OrderErrorLogs.remove({ 'trackingNo': tracking })
//         for (let prod of prods) {
//           MovementProduct.insert({
//             marketplaceId: shopee.marketplace,
//             brandId: shopee.brand_name,
//             orderId: shopee.order_id,
//             trackingNo: shopee.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           });

//           var moveprod = {
//             marketplaceId: shopee.marketplace,
//             brandId: shopee.brand_name,
//             orderId: shopee.order_id,
//             trackingNo: shopee.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           }
//           array.push(moveprod)
//         }
//         ShopeeOrders.update({ '_id': shopee._id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         allOrder.update({ 'order_id': shopee.order_id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         let datas = {
//           "data": array
//         }
//         HTTP.post('https://apimp.egogohub.tech/api-stock/stock_movement.php',
//           { data: datas },
//           function (err, res) {
//             console.log(res); // 4
//           });
//         console.log('array', array)

//         console.log('shopee INSERT ' + shopee.order_id);
//         array = []
//       }
//       return prods;
//     }
//     else if (blibli) {
//       allOrder.insert({
//         marketplace: blibli.marketplace,
//         brand_id: blibli.brand_id,
//         order_id: blibli.order_id,
//         shipper_internal: blibli.shipper_internal,
//         tracking_no: blibli.tracking_no,
//         validasi1status: blibli.validasi1status,
//         validasi1At: blibli.validasi1At,
//         validasi1By: blibli.validasi1By,
//         products: blibli.products
//       })
//       var prodscount = ProductOrders.find({ 'order_id': blibli.order_id }).count()
//       var prods = ProductOrders.find({ 'order_id': blibli.order_id }).fetch()
//       let array = []
//       // // console.log('prod',prods);
//       if (!prodscount) {
//         OrderErrorLogs.insert({
//           trackingNo: tracking,
//           orderid: blibli.order_id,
//           marketplace: "blibli",
//           errorLog: 'Product not Found',
//           shiperchoose: shp,
//           typescan: 2,
//           createdAt: new Date(),
//           usedBy: Meteor.userId()
//         });
//       }
//       else {
//         OrderErrorLogs.remove({ 'trackingNo': tracking })
//         for (let prod of prods) {
//           MovementProduct.insert({
//             marketplaceId: blibli.marketplace,
//             brandId: blibli.brand_name,
//             orderId: blibli.order_id,
//             trackingNo: blibli.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           });

//           var moveprod = {
//             marketplaceId: blibli.marketplace,
//             brandId: blibli.brand_name,
//             orderId: blibli.order_id,
//             trackingNo: blibli.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           }

//           array.push(moveprod)
//         }
//         BlibliOrders.update({ '_id': blibli._id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         allOrder.update({ 'order_id': blibli.order_id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         let datas = {
//           "data": array
//         }
//         HTTP.post('https://apimp.egogohub.tech/api-stock/stock_movement.php',
//           { data: datas },
//           function (err, res) {
//             console.log(res); // 4
//           });
//         console.log('array', array)

//         console.log('blibli INSERT ' + blibli.order_id);

//         array = []
//       }
//       return prods
//     }
//     else if (bukalapak) {
//       allOrder.insert({
//         marketplace: bukalapak.marketplace,
//         brand_id: bukalapak.brand_id,
//         order_id: bukalapak.order_id,
//         shipper_internal: bukalapak.shipper_internal,
//         tracking_no: bukalapak.tracking_no,
//         validasi1status: bukalapak.validasi1status,
//         validasi1At: bukalapak.validasi1At,
//         validasi1By: bukalapak.validasi1By,
//         products: bukalapak.products
//       })
//       console.log('bukalapak', bukalapak.tracking_no)
//       var prodscount = ProductOrders.find({ 'order_id': bukalapak.order_id }).count()
//       var prods = ProductOrders.find({ 'order_id': bukalapak.order_id }).fetch()
//       let array = []
//       console.log('prod', prodscount);
//       if (!prodscount) {
//         console.log('prod', prods);
//         OrderErrorLogs.insert({
//           trackingNo: tracking,
//           orderid: bukalapak.order_id,
//           marketplace: "bukalapak",
//           errorLog: 'Product not Found',
//           shiperchoose: shp,
//           typescan: 2,
//           createdAt: new Date(),
//           usedBy: Meteor.userId()
//         });
//       }
//       else {
//         OrderErrorLogs.remove({ 'trackingNo': tracking })
//         for (let prod of prods) {
//           MovementProduct.insert({
//             marketplaceId: bukalapak.marketplace,
//             brandId: bukalapak.brand_name,
//             trackingNo: bukalapak.tracking_no,
//             orderId: bukalapak.order_id,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           });
//           var moveprod = {
//             marketplaceId: bukalapak.marketplace,
//             brandId: bukalapak.brand_name,
//             orderId: bukalapak.order_id,
//             trackingNo: bukalapak.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           }

//           array.push(moveprod)
//         }
//         console.log('bukalapak INSERT ' + bukalapak.order_id);

//         BukalapakOrders.update({ '_id': bukalapak._id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         allOrder.update({ 'order_id': bukalapak.order_id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         let datas = {
//           "data": array
//         }
//         HTTP.post('https://apimp.egogohub.tech/api-stock/stock_movement.php',
//           { data: datas },
//           function (err, res) {
//             console.log(res); // 4
//           });
//         console.log('array', array)

//         array = []
//       }
//       return prods
//     }
//     else if (zalora) {
//       allOrder.insert({
//         marketplace: zalora.marketplace,
//         brand_id: zalora.brand_id,
//         order_id: zalora.order_id,
//         shipper_internal: zalora.shipper_internal,
//         tracking_no: zalora.tracking_no,
//         validasi1status: zalora.validasi1status,
//         validasi1At: zalora.validasi1At,
//         validasi1By: zalora.validasi1By,
//         products: zalora.products
//       })
//       var prodscount = ProductOrders.find({ 'order_id': zalora.order_id }).count()
//       var prods = ProductOrders.find({ 'order_id': zalora.order_id }).fetch()
//       let array = []
//       // console.log('prod',prods);
//       if (!prodscount) {
//         OrderErrorLogs.insert({
//           trackingNo: tracking,
//           orderid: zalora.order_id,
//           errorLog: 'Product not Found',
//           marketplace: "zalora",
//           shiperchoose: shp,
//           typescan: 2,
//           createdAt: new Date(),
//           usedBy: Meteor.userId()
//         });
//       }
//       else {
//         OrderErrorLogs.remove({ 'trackingNo': tracking })
//         for (let prod of prods) {
//           MovementProduct.insert({
//             marketplaceId: zalora.marketplace,
//             brandId: zalora.brand_name,
//             orderId: zalora.order_id,
//             trackingNo: zalora.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           });
//           var moveprod = {
//             marketplaceId: zalora.marketplace,
//             brandId: zalora.brand_name,
//             orderId: zalora.order_id,
//             trackingNo: zalora.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           }

//           array.push(moveprod)
//         }

//         ZaloraOrders.update({ '_id': zalora._id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         allOrder.update({ 'order_id': zalora.order_id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         let datas = {
//           "data": array
//         }
//         HTTP.post('https://apimp.egogohub.tech/api-stock/stock_movement.php',
//           { data: datas },
//           function (err, res) {
//             console.log(res); // 4
//           });
//         console.log('array', array)

//         console.log('zalora INSERT ' + zalora.order_id);

//         array = []

//       }
//       return prods
//     }
//     else if (jdid) {
//       allOrder.insert({
//         marketplace: jdid.marketplace,
//         brand_id: jdid.brand_id,
//         order_id: jdid.order_id,
//         shipper_internal: jdid.shipper_internal,
//         tracking_no: jdid.tracking_no,
//         validasi1status: jdid.validasi1status,
//         validasi1At: jdid.validasi1At,
//         validasi1By: jdid.validasi1By,
//         products: jdid.products
//       })
//       var prodscount = ProductOrders.find({ 'order_id': jdid.order_id }).count()
//       var prods = ProductOrders.find({ 'order_id': jdid.order_id }).fetch()
//       let array = []
//       // console.log('prod',prods);
//       if (!prodscount) {
//         var track = !jdid
//         OrderErrorLogs.insert({
//           trackingNo: tracking,
//           orderid: jdid.order_id,
//           errorLog: 'Product not Found',
//           marketplace: "jdid",
//           shiperchoose: shp,
//           typescan: 2,
//           createdAt: new Date(),
//           usedBy: Meteor.userId()
//         });
//       }
//       else {
//         OrderErrorLogs.remove({ 'trackingNo': tracking })
//         for (let prod of prods) {
//           MovementProduct.insert({
//             marketplaceId: jdid.marketplace,
//             brandId: jdid.brand_name,
//             orderId: jdid.order_id,
//             trackingNo: jdid.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date()
//           });
//           var moveprod = {
//             marketplaceId: jdid.marketplace,
//             brandId: jdid.brand_name,
//             orderId: jdid.order_id,
//             trackingNo: jdid.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           }
//           array.push(moveprod)
//         }

//         JdidOrders.update({ '_id': jdid._id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         allOrder.update({ 'order_id': jdid.order_id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         let datas = {
//           "data": array
//         }
//         HTTP.post('https://apimp.egogohub.tech/api-stock/stock_movement.php',
//           { data: datas },
//           function (err, res) {
//             console.log(res); // 4
//           });
//         console.log('array', array)

//         console.log('zalora INSERT ' + zalora.order_id);

//         array = []
//         console.log('jdid INSERT ' + jdid.order_id);

//       }
//       return prods
//     }
//     else if (lazada) {
//       allOrder.insert({
//         marketplace: lazada.marketplace,
//         brand_id: lazada.brand_id,
//         order_id: lazada.order_id,
//         shipper_internal: lazada.shipper_internal,
//         tracking_no: lazada.tracking_no,
//         validasi1status: lazada.validasi1status,
//         validasi1At: lazada.validasi1At,
//         validasi1By: lazada.validasi1By,
//         products: lazada.products
//       })
//       var prodscount = ProductOrders.find({ 'order_id': lazada.order_id }).count()
//       var prods = ProductOrders.find({ 'order_id': lazada.order_id }).fetch()

//       let array = []
//       console.log('track', track);
//       // console.log('prod count',prodcount);
//       if (!prodscount) {
//         OrderErrorLogs.insert({
//           trackingNo: tracking,
//           orderid: lazada.order_id,
//           marketplace: "lazada",
//           errorLog: 'Product not Found',
//           shiperchoose: shp,
//           typescan: 2,
//           createdAt: new Date(),
//           usedBy: Meteor.userId()
//         });
//       }
//       else {
//         OrderErrorLogs.remove({ 'trackingNo': tracking })
//         var track = lazada
//         for (let prod of prods) {

//           console.log('prod', prod.qty);
//           MovementProduct.insert({
//             marketplaceId: lazada.marketplace,
//             brandId: lazada.brand_name,
//             orderId: lazada.order_id,
//             trackingNo: lazada.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           });
//           var moveprod = {
//             marketplaceId: lazada.marketplace,
//             brandId: lazada.brand_name,
//             orderId: lazada.order_id,
//             trackingNo: lazada.tracking_no,
//             itemSku: prod.item_sku,
//             qty: prod.qty,
//             insertType: 'Out - Market Place',
//             createdAt: new Date(),
//             usedBy: Meteor.userId()
//           }
//           array.push(moveprod)
//         }
//         LazadaOrders.update({ '_id': lazada._id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });
//         allOrder.update({ 'order_id': lazada.order_id }, {
//           $set: {
//             validasi2status: true,
//             validasi2At: new Date(),
//             validasi2By: Meteor.userId()
//           }
//         });

//         let datas = {
//           "data": array
//         }
//         HTTP.post('https://apimp.egogohub.tech/api-stock/stock_movement.php',
//           { data: datas },
//           function (err, res) {
//             console.log(res); // 4
//           });
//         array = []
//         console.log('array', array)

//         console.log('Lazada INSERT ' + lazada.order_id);
//       }
//       return prods
//     }
//     else {
//       OrderErrorLogs.insert({
//         trackingNo: tracking,
//         marketplace: "",
//         orderd: "",
//         errorLog: 'Data Tracking Number is not Found',
//         shiperchoose: shp,
//         typescan: 2,
//         createdAt: new Date(),
//         usedBy: Meteor.user()
//       });
//     }
//   },
//   //End all tracking

//   // show scan2
//   'scan2show.all'(track, shp) {
//     console.log('scan2');
//     var scan =
//       TokopediaOrders.aggregate([
//         { $unionWith: { coll: "bukalapakOrders", } },
//         { $unionWith: { coll: "lazadaOrders", } },
//         { $unionWith: { coll: "shopeeOrders", } },
//         { $unionWith: { coll: "blibliOrders", } },
//         { $unionWith: { coll: "jdidOrders", } },
//         { $unionWith: { coll: "zaloraOrders", } },
//         {
//           $project: {
//             order_id: 1, tracking_no: 1, shipper_internal: 1, marketplace: 1, brand_id: 1, validstatus: 1, validstatus2: {
//               $cond: [
//                 { $ifNull: ['$validstatus2', false] }, // if
//                 true, // then
//                 false // else
//               ]
//             }, item_sku: {
//               $reduce: {
//                 input: "$products.item_sku", initialValue: "", in: {
//                   "$cond": {
//                     if: { "$eq": [{ "$indexOfArray": ["$products.item_sku", "$$this"] }, 0] },
//                     then: { "$concat": ["$$value", "$$this"] },
//                     else: { "$concat": ["$$value", ",  ", "$$this"] }
//                   }
//                 }
//               }
//             },
//           }
//         },
//         {
//           $match: {
//             $and: [
//               { tracking_no: track },
//               { shipper_internal: shp },
//               { validstatus: true },
//               { validstatus2: true }
//             ]
//           }
//         },
//         {
//           $sort: { 'updateAt': -1 }
//         }
//         , { $limit: 15 }
//       ])
//     console.log('result', scan)
//     return scan
//   },
//   // end show scan2

//   // Validation
//   'NewOrder.all'() {
//     console.log('NewOrder');
//     var validmp =
//       TokopediaOrders.aggregate([
//         { $unionWith: { coll: "bukalapakOrders", } },
//         { $unionWith: { coll: "lazadaOrders", } },
//         { $unionWith: { coll: "shopeeOrders", } },
//         { $unionWith: { coll: "blibliOrders", } },
//         { $unionWith: { coll: "jdidOrders", } },
//         { $unionWith: { coll: "zaloraOrders", } },
//         {
//           $match: {
//             $and: [
//               { validasi1status: { $exists: false } }
//             ]
//           }
//         },
//         {
//           $project: {
//             order_id: 1, tracking_no: 1, invoice_no: 1, shipper_internal: 1, marketplace: 1, create_date: 1,
//           }
//         },
//         {
//           $addFields: {
//             validasi1status: "none"
//           }
//         },

//         {
//           $sort: { 'create_date': -1 }
//         }
//       ])
//     return validmp
//   },
//   'validation.all'() {
//     console.log('validation1');
//     var validmp =
//       TokopediaOrders.aggregate([
//         { $unionWith: { coll: "bukalapakOrders", } },
//         { $unionWith: { coll: "lazadaOrders", } },
//         { $unionWith: { coll: "shopeeOrders", } },
//         { $unionWith: { coll: "blibliOrders", } },
//         { $unionWith: { coll: "jdidOrders", } },
//         { $unionWith: { coll: "zaloraOrders", } },

//         {
//           $project: {
//             invoice_no: 1,
//             order_id: 1, tracking_no: 1, shipper_internal: 1, marketplace: 1, validasi1At: 1, validasi1By: 1, validasi1status: 1, validasi2status: {
//               $cond: [
//                 { $ifNull: ['$validasi2status', false] }, // if
//                 true, // then
//                 false // else
//               ]
//             },pickliststatus:{
//               $cond: [
//                   { $ifNull: ['$pickliststatus', false] }, // if
//                   true, // then
//                   false // else
//                 ]
//           },checkboxstatus:{
//             $cond: [
//                 { $ifNull: ['$checkboxstatus', false] }, // if
//                 true, // then
//                 false // else
//               ]
//         }
//         }
//       },
//       {
//         $match: {
//           $and: [
//             { validasi1status: true },
//             { validasi2status: false },
//             { pickliststatus: false }
//           ]
//         }
//       },
//         {
//           $sort: { 'validasi1At': 1 }
//         }
//         // , { $limit: 15 }
//       ])
//     return validmp
//   },
//   // end Validation
//   // https://erp.egogohub.com/cron/sync_tokopedia3.php?act=getSingleOrderItem&orderid=[orderid]
//   'tokopediaDetailOrder.update'(orderId) {
//     console.log('TOKOPEDIA UPDATE START ' + orderId);
//     // try {
//     HTTP.call('GET', 'https://erp.egogohub.com/cron/sync_tokopedia3.php?act=getSingleOrderItem&orderid=' + orderId, {
//     }, (error, result) => {
//       if (!error) {
//         // console.log(result.data.data);
//         respData = result.data.data;
//         var shopId = respData.seller_id;
//         var mpStatus = respData.order_status;
//         var invoiceNo = respData.invoice_number;
//         var is = InternalStatus.findOne({ 'mp': 'tokopedia', 'mpStatus': mpStatus });
//         TokopediaOrders.update({ 'orderId': orderId }, {
//           $set: {
//             mpStatus: mpStatus,
//             internalStatus: is.internalStatus,
//             invoiceNo: invoiceNo,
//             mpCreateTime: respData.create_time,
//             trackingNo: respData.order_info.shipping_info.awb,
//             insertType: 'API Detail - Update Duplicate',
//             updateAt: new Date()
//           }
//         });
//         TokpedOrderDetail.update({ 'orderId': orderId }, {
//           $set: {
//             mpStatus: mpStatus,
//             internalStatus: is.internalStatus,
//             invoiceNo: invoiceNo,
//             mpCreateTime: respData.create_time,
//             orders: respData,
//             trackingNo: respData.order_info.shipping_info.awb,
//             insertType: 'API Detail - Update',
//             updateAt: new Date()
//           }
//         });
//         console.log('TOKOPEDIA UPDATE FINISH ' + orderId);
//         return true;
//       } else {
//         console.log('TOKOPEDIA UPDATE FAILED ' + orderId);
//       }
//     });
//   },
//   'tokopediaDetailOrder.insert'(orderId) {
//     console.log('TOKOPEDIA INSERT START ' + orderId);
//     // try {
//     HTTP.call('GET', 'https://erp.egogohub.com/cron/sync_tokopedia3.php?act=getSingleOrderItem&orderid=' + orderId, {
//     }, (error, result) => {
//       if (!error) {
//         // console.log(result.data.data);
//         respData = result.data.data;
//         var shopId = respData.seller_id;
//         var mpStatus = respData.order_status;
//         var invoiceNo = respData.invoice_number;
//         // var brandData = ShopMp.findOne({ 'shopid': shopId });
//         var is = InternalStatus.findOne({ 'mp': 'tokopedia', 'mpStatus': mpStatus });
//         // console.log(mpStatus);
//         // console.log(is.internalStatus);
//         // if (orderCount > 0) {
//         // } else {
//         TokopediaOrders.insert({
//           // { 'orderId': orderId }, {
//           // $set: {
//           marketplaceId: "tokopedia",
//           // brandId: brandData.brand,
//           orderId: orderId,
//           shopId: shopId,
//           mpStatus: mpStatus,
//           internalStatus: is.internalStatus,
//           invoiceNo: invoiceNo,
//           mpCreateTime: respData.create_time,
//           trackingNo: respData.order_info.shipping_info.awb,
//           insertType: 'API Detail - Insert New',
//           createdAt: new Date()
//           // }
//         });
//         TokpedOrderDetail.insert({
//           marketplaceId: "tokopedia",
//           // brandId: brandData.brand,
//           shopId: shopId,
//           orderId: orderId,
//           invoiceNo: invoiceNo,
//           internalStatus: is.internalStatus,
//           mpStatus: mpStatus,
//           orders: respData,
//           mpCreateTime: respData.create_time,
//           trackingNo: respData.order_info.shipping_info.awb,
//           insertType: 'API Detail - Insert New',
//           createdAt: new Date()
//         });
//         console.log('TOKOPEDIA UPDATE FINISH ' + orderId);
//         return true;
//         // }
//       } else {
//         console.log('TOKOPEDIA UPDATE FAILED ' + orderId);
//       }
//     });
//   },
//   'shopeeDetailOrder'(orderId, shopId) {
//     // console.log('SHOPEE DETAIL START ' + orderId);
//     // try {
//     HTTP.call('GET', 'https://erp.egogohub.com/cron/sync_shopee3.php?act=getSingleOrderItem&shopid=' + shopId + '&orderid=' + orderId, {
//     }, (error, result) => {
//       if (!error) {
//         // console.log(result.data);

//         respData = result.data;
//         // var brandData = ShopMp.findOne({ 'shopid': shopId });
//         var mpStatus = respData.orders[0].order_status;
//         var orderCount = ShopeeOrderDetail.find({ 'orderId': orderId }).count();
//         var is = InternalStatus.findOne({ 'mp': 'shopee', 'mpStatus': mpStatus });
//         // console.log('shopee detail order, oid:' + orderId + ' sid: ' + shopId + ' mpStat: ' + mpStatus + ' iStat: ' + is.internalStatus);
//         // console.log(mpStatus)
//         // console.log(is.internalStatus);
//         if (orderCount > 0) {

//           ShopeeOrders.update({ 'orderId': orderId }, {
//             $set: {
//               invoiceNo: orderId,
//               // brandId: brandData.brand,
//               mpStatus: mpStatus,
//               internalStatus: is.internalStatus,
//               mpCreateTime: new Date(moment(respData.orders[0].create_time, 'X').format()),
//               trackingNo: respData.orders[0].tracking_no,
//               insertType: 'API Detail - Update Duplicate',
//               updateAt: new Date()
//             }
//           });
//           ShopeeOrderDetail.update({ 'orderId': orderId }, {
//             $set: {
//               invoiceNo: orderId,
//               // brandId: brandData.brand,
//               mpStatus: mpStatus,
//               internalStatus: is.internalStatus,
//               orders: respData.orders[0],
//               mpCreateTime: new Date(moment(respData.orders[0].create_time, 'X').format()),
//               trackingNo: respData.orders[0].tracking_no,
//               insertType: 'API Detail - Update',
//               updateAt: new Date()
//             }
//           });
//           console.log('SHOPEE UPDATE FINISH ' + orderId);
//         } else {

//           ShopeeOrders.update({ 'orderId': orderId }, {
//             $set: {
//               invoiceNo: orderId,
//               // brandId: brandData.brand,
//               mpStatus: mpStatus,
//               internalStatus: is.internalStatus,
//               mpCreateTime: new Date(moment(respData.orders[0].create_time, 'X').format()),
//               trackingNo: respData.orders[0].tracking_no,
//               insertType: 'API Detail - Update',
//               updateAt: new Date()
//             }
//           });
//           ShopeeOrderDetail.insert({
//             orderId: orderId,
//             // brandId: brandData.brand,
//             shopId: shopId,
//             marketplaceId: "shopee",
//             invoiceNo: orderId,
//             internalStatus: is.internalStatus,
//             mpStatus: mpStatus,
//             orders: respData.orders[0],
//             mpCreateTime: new Date(moment(respData.orders[0].create_time, 'X').format()),
//             trackingNo: respData.orders[0].tracking_no,
//             insertType: 'API Detail - Insert New',
//             createdAt: new Date()
//           });
//           console.log('SHOPEE INSERT FINISH ' + orderId);
//         }

//         // return result;
//       } else {
//         console.log('SHOPEE UPDATE FAILED ' + orderId);
//       }
//     });
//   },
// });
