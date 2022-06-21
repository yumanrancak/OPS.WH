import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// Import needed templates

import '../../ui/layouts/body/body.js';
import '../../ui/layouts/body/blank.js';
//login etc
import '../../ui/pages/login/login.js';
//dashboard
import '../../ui/pages/dashboard/dash_fulfillment';
import '../../ui/pages/dashboard/dash_fulfillment_day';
import '../../ui/pages/dashboard/dash_fulfillment_month';

//marketplace
// import '../../ui/pages/marketplace/shopMp.js';
// import '../../ui/pages/marketplace/shopExternal.js';

//pages
import '../../ui/pages/home/home.js';
import '../../ui/pages/home/shopee.js';
import '../../ui/pages/home/lazada.js';
import '../../ui/pages/home/blibli.js';
import '../../ui/pages/testing/testing.js';
import '../../ui/pages/not-found/not-found.js';

//Fulfillment
import '../../ui/pages/fulfillment/accept_orders.js';
import '../../ui/pages/fulfillment/handover_3pl.js';
import '../../ui/pages/fulfillment/print_label.js';
import '../../ui/pages/fulfillment/product_picklist.js';
// import '../../ui/pages/fulfillment/ScanSMU/scan_smu_tokopedia';
// import '../../ui/pages/fulfillment/ScanSMU/scan_smu_bukalapak';
// import '../../ui/pages/fulfillment/ScanSMU/scan_smu_lazada';
// import '../../ui/pages/fulfillment/ScanSMU/scan_smu_blibli';
// import '../../ui/pages/fulfillment/ScanSMU/scan_smu_jdid';
// import '../../ui/pages/fulfillment/ScanSMU/scan_smu_shopee.js';
import '../../ui/pages/fulfillment/ScanSMU/scanvalidasi1';
// import '../../ui/pages/fulfillment/ScanSMU/scan_smu_zalora';
import '../../ui/pages/fulfillment/short_3pl.js';
import '../../ui/pages/fulfillment/shorting_matching.js';
import '../../ui/pages/fulfillment/ScanSMU/dash_error_log';

import '../../ui/pages/inbound/do_create.js';
import '../../ui/pages/inbound/approve_list';
import '../../ui/pages/inbound/detail_do';
import '../../ui/pages/inbound/manual_inbound';
import '../../ui/pages/fulfillment/pick_list/pick_list.js';
import '../../ui/pages/fulfillment/dash_validation';
import '../../ui/pages/fulfillment/ScanSMU2/scan_smu_kurir';
import '../../ui/pages/fulfillment/ScanSMU2/dash_error_log2';
import '../../ui/pages/fulfillment/dashboard/dashboard_cancel_list';
import '../../ui/pages/fulfillment/dashboard/review_order';

import '../../ui/pages/notificationsdash/notifications.js';
import '../../ui/pages/fulfillment/pick_list/batch_list';
import '../../ui/pages/fulfillment/pick_list/accept_list';
import '../../ui/pages/fulfillment/pick_list/batchdetail_list';
import '../../ui/pages/fulfillment/pick_list/batchdetailorder';
import '../../ui/pages/fulfillment/pick_list/complete_list';
import '../../ui/pages/fulfillment/pick_list/dashboard_list';
import '../../ui/pages/fulfillment/pick_list/dash_error_picklist';

//product
import '../../ui/pages/fulfillment/product/movement_list';

import '../../ui/pages/report/printscan2';
import '../../ui/pages/report/reportscan2';
import '../../ui/pages/fulfillment/stock_out/stock_out3';
import '../../ui/pages/fulfillment/stock_out/printsumarry';

//crm
// import '../../ui/pages/crm/return.js';

// marketplace
// import '../../ui/pages/marketplace/marketplace.js';
// import '../../ui/pages/marketplace/marketplaceSearch.js';
// import '../../ui/pages/brand/brand.js';
// import '../../ui/pages/brand/brandDetail.js';
// import '../../ui/pages/brand/brandLogin.js';
// import '../../ui/pages/product/product.js';
// import '../../ui/pages/product/productDetail.js';
// import '../../ui/pages/product/productStock.js';
// import '../../ui/pages/product/productLot.js';
// import '../../ui/pages/product/productVariant.js';
// import '../../ui/pages/warehouse/warehouse.js';
// import '../../ui/pages/warehouse/warehouseDetail.js';
// import '../../ui/pages/warehouse/movement.js';
// import '../../ui/pages/warehouse/stock.js';

// Set up all routes in the app
FlowRouter.route('*', {
  action() {
    if (!Meteor.userId()) {
      FlowRouter.go('/login');
    }
    else {
      this.render('App_body', 'App_notFound');
    }
  },
});

const exposed = FlowRouter.group();
exposed.route('/', {
  name: 'App.home',
  action() {
    if (!Meteor.userId()) {
      FlowRouter.go('/login');
    }
    else {
      FlowRouter.go('/home');
    }
    // this.render('App_body', 'App_home');
  },
});
exposed.route('/login', {
  name: 'App.App_login',
  action() {
    this.render('App_blank', 'login');
  }
});
exposed.route('/testing', {
  name: 'App.testing',
  action() {
    this.render('App_body', 'testing');
  }
});
// User Login
// exposed.route('/', {
//   action: function () {
//     if (!Meteor.userId()) {
//       redirect('/login');
//     }
//     else {
//       FlowRouter.go('/home');
//     }
//   }
// });
const userRoutes = FlowRouter.group({
  prefix: '',
  name: 'user',
  triggersEnter: [function (context, redirect) {
    if (!Meteor.userId()) {
      FlowRouter.go('/login');
      // redirect('/login');
    }
  }]
});

userRoutes.route('/home', {
  name: 'App.home',
  action() {
    this.render('App_body', 'App_home');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuDash').addClass('active');
    $('#menuDashOrders').addClass('active');
  },
});
userRoutes.route('/dashboard/fulfillment', {
  name: 'App.dashboard.fulfillment',
  action() {
    this.render('App_body', 'dash_fulfillment');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuDash').addClass('active');
    $('#menuDashFulfillment').addClass('active');
  },
});
userRoutes.route('/dashboard/fulfillmentday', {
  name: 'App.dashboard.fulfillmentday',
  action() {
    this.render('App_body', 'dash_fulfillment_day');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuDash').addClass('active');
    $('#menuDashFulfillment').addClass('active');
  },
});
userRoutes.route('/dashboard/fulfillmentmonth', {
  name: 'App.dashboard.fulfillmentmonth',
  action() {
    this.render('App_body', 'dash_fulfillment_month');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuDash').addClass('active');
    $('#menuDashFulfillment').addClass('active');
  },
});
// userRoutes.route('/dashboard/shopee', {
//   name: 'App.dashboard.shopee',
//   action() {
//     this.render('App_body', 'dash_shopee');
//     $('.nav-item .nav-link').removeClass('active');
//     $('#menuDash').addClass('active');
//     $('#menuDashShopee').addClass('active');
//   },
// });
// userRoutes.route('/dashboard/lazada', {
//   name: 'App.dashboard.lazada',
//   action() {
//     this.render('App_body', 'dash_lazada');
//     $('.nav-item .nav-link').removeClass('active');
//     $('#menuDash').addClass('active');
//     $('#menuDashLazada').addClass('active');
//   },
// });
// userRoutes.route('/dashboard/bukalapak', {
//   name: 'App.dashboard.bukalapak',
//   action() {
//     this.render('App_body', 'dash_bukalapak');
//     $('.nav-item .nav-link').removeClass('active');
//     $('#menuDash').addClass('active');
//     $('#menuDashBukalapak').addClass('active');
//   },
// });
// userRoutes.route('/dashboard/blibli', {
//   name: 'App.dashboard.blibli',
//   action() {
//     this.render('App_body', 'dash_blibli');
//     $('.nav-item .nav-link').removeClass('active');
//     $('#menuDash').addClass('active');
//     $('#menuDashBlibli').addClass('active');
//   },
// });
// userRoutes.route('/dashboard/zalora', {
//   name: 'App.dashboard.zalora',
//   action() {
//     this.render('App_body', 'dash_zalora');
//     $('.nav-item .nav-link').removeClass('active');
//     $('#menuDash').addClass('active');
//     $('#menuDashZalora').addClass('active');
//   },
// });
// userRoutes.route('/dashboard/jdid', {
//   name: 'App.dashboard.jdid',
//   action() {
//     this.render('App_body', 'dash_jdid');
//     $('.nav-item .nav-link').removeClass('active');
//     $('#menuDash').addClass('active');
//     $('#menuDashJdid').addClass('active');
//   },
// });

userRoutes.route('/dashboard/movement', {
  name: 'App.dashboard.movement',
  action() {
    this.render('App_body', 'movement_list');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuDash').addClass('active');
    $('#menuDashJdid').addClass('active');
  },
});

userRoutes.route('/shopMp', {
  name: 'App.shopMp',
  action() {
    this.render('App_body', 'shopMp');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuMp').addClass('active');
    $('#menuMpMarketplace').addClass('active');
  },
});
userRoutes.route('/shopExternal', {
  name: 'App.shopExternal',
  action() {
    this.render('App_body', 'shopExternal');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuMp').addClass('active');
    $('#menuMpExternal').addClass('active');
  },
});
//Fulfillment
userRoutes.route('/acceptOrders', {
  name: 'App.fulfillment.acceptOrders',
  action() {
    this.render('App_body', 'acceptOrders');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#menuAcceptOrders').addClass('active');
  },
});
userRoutes.route('/handover3pl', {
  name: 'App.fulfillment.handover3pl',
  action() {
    this.render('App_body', 'handover3pl');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#menuHandover3pl').addClass('active');
  },
});
userRoutes.route('/printLabel', {
  name: 'App.fulfillment.printLabel',
  action() {
    this.render('App_body', 'printLabel');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#menuPrintLabel').addClass('active');
  },
});
userRoutes.route('/productPickList', {
  name: 'App.fulfillment.productPickList',
  action() {
    this.render('App_body', 'acceptOrders');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#menuProductPickList').addClass('active');
  },
});

userRoutes.route('/ScanSMU/scanvalidasi1', {
  name: 'App.fulfillment.ScanSMU.scanvalidasi1',
  action() {
    this.render('App_body', 'scanvalidasi1');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#menuScanValidasi1').addClass('active');
  },
});

userRoutes.route('/ScanSMU/dash_error_log', {
  name: 'App.fulfillment.ScanSMU.dash_error_log',
  action() {
    this.render('App_body', 'dash_error_log');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#menuErrorlog').addClass('active');
  },
});
userRoutes.route('/ScanSMU2/dash_error_log2', {
  name: 'App.fulfillment.ScanSMU2.dash_error_log2',
  action() {
    this.render('App_body', 'dash_error_log2');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#menuErrorlog2').addClass('active');
  },
});
userRoutes.route('/ScanSMU2/scan_smu_kurir', {
  name: 'App.fulfillment.ScanSMU2.scan_smu_kurir',
  action() {
    this.render('App_body', 'scan_smu_kurir');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#menuscanSMUKurir').addClass('active');
  },
});

userRoutes.route('/dash_validation', {
  name: 'App.fulfillment.dash_validation',
  action() {
    this.render('App_body', 'dash_validation');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#menuValidationdash').addClass('active');
  },
});

userRoutes.route('/pick_list/pick_list', {
  name: 'App.fulfillment.pick_list.pick_list',
  action() {
    this.render('App_body', 'pick_list');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#MenuPickList').addClass('active');
  },
});


userRoutes.route('/pick_list/batch_list', {
  name: 'App.fulfillment.pick_list.batch_list',
  action() {
    this.render('App_body', 'batch_list');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    $('#MenuBatchPickList').addClass('active');
  },
});

userRoutes.route('/pick_list/accept_list', {
  name: 'App.fulfillment.pick_list.accept_list',
  action() {
    this.render('App_body', 'accept_list');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    $('#MenuAcceptPickList').addClass('active');
  },
});

userRoutes.route('/pick_list/complete_list', {
  name: 'App.fulfillment.pick_list.complete_list',
  action() {
    this.render('App_body', 'complete_list');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    $('#MenucompletePickList').addClass('active');
  },
});
userRoutes.route('/pick_list/dash_error_picklist', {
  name: 'App.fulfillment.pick_list.dash_error_picklist',
  action() {
    this.render('App_body', 'dash_error_picklist');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    $('#MenuErrorPickList').addClass('active');
  },
});

userRoutes.route('/pick_list/dashboard_list', {
  name: 'App.fulfillment.pick_list.dashboard_list',
  action() {
    this.render('App_body', 'dashboard_list');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    $('#MenudashboardPickList').addClass('active');
  },
});


userRoutes.route('/pick_list/batchdetail_list/:id', {
  name: 'App.fulfillment.pick_list.batchdetail_list',
  action() {
    this.render('App_body', 'batchdetail_list');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    // $('#MenuPickList').addClass('active');
  },
});
userRoutes.route('/pick_list/batchdetailorder/:id', {
  name: 'App.fulfillment.pick_list.batchdetailorder',
  action() {
    this.render('App_body', 'batchdetailorder');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    // $('#MenuPickList').addClass('active');
  },
});


userRoutes.route('/dashboard/review_order/:id', {
  name: 'App.fulfillment.dashboard.review_order',
  action() {
    this.render('App_body', 'review_order');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    // $('#MenuPickList').addClass('active');
  },
});

userRoutes.route('/dashboard/dashboard_cancel_list/', {
  name: 'App.fulfillment.dashboard.dashboard_cancel_list',
  action() {
    this.render('App_body', 'dashboard_cancel_list');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    $('#menuCancel').addClass('active');
  },
});

userRoutes.route('/report/reportscan2/', {
  name: 'App.fulfillment.report.reportscan2',
  action() {
    this.render('App_body', 'reportscan2');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    $('#menuReportScan2').addClass('active');
  },
});

userRoutes.route('/report/printscan2/:sd/:ed/:shipper/:print', {
  name: 'App.fulfillment.report.printscan2',
  action() {
    this.render('App_body', 'printscan2');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    // $('#MenuPickList').addClass('active');
  },
});

userRoutes.route('/stock_out/stock_out3/', {
  name: 'App.fulfillment.stock_out.stock_out3',
  action() {
    this.render('App_body', 'stock_out3');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    $('#Menustock_out3').addClass('active');
  },
});

userRoutes.route('/stock_out/printsumarry/:sd/:ed/:brand', {
  name: 'App.fulfillment.stock_out.printsumarry',
  action() {
    this.render('App_body', 'printsumarry');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    // $('#MenuPickList').addClass('active');
  },
});

userRoutes.route('/inbound/do_create', {
  name: 'App.fulfillment.inbound.do_create',
  action() {
    this.render('App_body', 'do_create');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#do_create').addClass('active');
  },
});

userRoutes.route('/inbound/detail_do/:id', {
  name: 'App.fulfillment.inbound.detail_do',
  action() {
    this.render('App_body', 'detail_do');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    // $('#do_create').addClass('active');
  },
});
userRoutes.route('/inbound/approve_list', {
  name: 'App.inbound.approve_list',
  action() {
    this.render('App_body', 'approve_list');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    $('#approve').addClass('active');
  },
});
userRoutes.route('/inbound/approve_list/:id', {
  name: 'App.inbound.approve_list',
  action() {
    this.render('App_body', 'approve_list');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuBrand').addClass('active');
    $('#approve').addClass('active');
  },
});

userRoutes.route('/inbound/manual_inbound', {
  name: 'App.inbound.manual_inbound',
  action() {
    this.render('App_body', 'manual_inbound');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    $('#manual_inbound').addClass('active');
  },
});


userRoutes.route('/notificationsdash/notifications', {
  name: 'App.notificationsdash.notifications',
  action() {
    this.render('App_body', 'not');
    $('.nav-item .nav-link').removeClass('active');
    // $('#menuFulfillment').addClass('active');
    $('#menunotification').addClass('active');
  },
});
userRoutes.route('/short3pl', {
  name: 'App.fulfillment.short3pl',
  action() {
    this.render('App_body', 'short3pl');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#menuShort3pl').addClass('active');
  },
});
userRoutes.route('/shortingMatching', {
  name: 'App.fulfillment.shortingMatching',
  action() {
    this.render('App_body', 'shortingMatching');
    $('.nav-item .nav-link').removeClass('active');
    $('#menuFulfillment').addClass('active');
    $('#menuShortingMatching').addClass('active');
  },
});
// userRoutes.route('/return', {
//   name: 'App.crm.return',
//   action() {
//     this.render('App_body', 'return');
//     $('.nav-item .nav-link').removeClass('active');
//     $('#menuCRM').addClass('active');
//     $('#menuReturn').addClass('active');
//   },
// });
//Marketplace
// userRoutes.route('/marketplace', {
//   name: 'App.marketplace',
//   action() {
//     this.render('App_body', 'marketplace');
//     $('.nav-item').removeClass('active');
//     $('.has-treeview').removeClass('menu-open');
//     $('.nav-link').removeClass('active');
//     $('#menuMarketplace').addClass('active');
//   },
// });
// userRoutes.route('/marketplaceSearch', {
//   name: 'App.marketplaceSearch',
//   action() {
//     this.render('App_body', 'marketplaceSearch');
//     $('.nav-item').removeClass('active');
//     $('.has-treeview').removeClass('menu-open');
//     $('.nav-link').removeClass('active');
//     $('#menuMarketplace').addClass('active');
//   },
// });
// // Brand
// userRoutes.route('/brand/list', {
//   name: 'App.brand.list',
//   action() {
//     this.render('App_body', 'brand');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuBrand').addClass('active');
//     $('#menuBrandList').addClass('active');
//   },
// });
// userRoutes.route('/brand/detail/:id', {
//   name: 'App.brand.detail',
//   action() {
//     this.render('App_body', 'brandDetail');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuBrand').addClass('active');
//     $('#menuBrandList').addClass('active');
//   },
// });

// userRoutes.route('/brand/login', {
//   name: 'App.brand.login',
//   action() {
//     this.render('App_body', 'brandLogin');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuBrand').addClass('active');
//     $('#menuBrandLogin').addClass('active');
//   },
// });
// // Product
// userRoutes.route('/product/list', {
//   name: 'App.product.list',
//   action() {
//     this.render('App_body', 'product');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuProduct').addClass('active');
//     $('#menuProductList').addClass('active');
//   },
// });
// userRoutes.route('/product/detail/:id', {
//   name: 'App.product.detail',
//   action() {
//     this.render('App_body', 'productDetail');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuProduct').addClass('active');
//     $('#menuProductList').addClass('active');
//   },
// });
// userRoutes.route('/product/stock', {
//   name: 'App.product.stock',
//   action() {
//     this.render('App_body', 'productStock');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuProduct').addClass('active');
//     $('#menuProductStock').addClass('active');
//   },
// });
// userRoutes.route('/product/lot', {
//   name: 'App.product.lot',
//   action() {
//     this.render('App_body', 'productLot');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuProduct').addClass('active');
//     $('#menuProductLot').addClass('active');
//   },
// });
// userRoutes.route('/product/variant', {
//   name: 'App.product.variant',
//   action() {
//     this.render('App_body', 'productVariant');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuProduct').addClass('active');
//     $('#menuProductVariant').addClass('active');
//   },
// });
// userRoutes.route('/product/statistics', {
//   name: 'App.product.statistics',
//   action() {
//     this.render('App_body', 'productStok');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuProduct').addClass('active');
//     $('#menuProductStatistics').addClass('active');
//   },
// });
// Warehouse
// userRoutes.route('/warehouse/list', {
//   name: 'App.warehouse.list',
//   action() {
//     this.render('App_body', 'warehouse');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuWarehouse').addClass('active');
//     $('#menuWarehouseList').addClass('active');
//   },
// });
// userRoutes.route('/warehouse/detail/:id', {
//   name: 'App.warehouse.detail',
//   action() {
//     this.render('App_body', 'warehouseDetail');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuWarehouse').addClass('active');
//     $('#menuWarehouseList').addClass('active');
//   },
// });
// userRoutes.route('/warehouse/movement', {
//   name: 'App.warehouse.movement',
//   action() {
//     this.render('App_body', 'movement');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuWarehouse').addClass('active');
//     $('#menuWarehouseMovement').addClass('active');
//   },
// });
// userRoutes.route('/warehouse/stock', {
//   name: 'App.warehouse.stock',
//   action() {
//     this.render('App_body', 'stock');
//     $('.nav-item').removeClass('active');
//     $('.nav-link').removeClass('active');
//     $('#menuWarehouse').addClass('active');
//     $('#menuWarehouseStock').addClass('active');
//   },
// });




