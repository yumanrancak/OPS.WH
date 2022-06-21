/* eslint-disable import/no-unresolved */
import { Meteor } from "meteor/meteor";
import {
  Logistics,
  Shipment,
  ShipmentProduct,
  ShipmentRate,
} from "../logistics.js";
import { publishPagination } from "meteor/kurounin:pagination";
import { ReactiveTable } from "meteor/aslagle:reactive-table";

ReactiveTable.publish(
  "logisticsData",
  function () {
    return Logistics;
  },
  {}
);
ReactiveTable.publish(
  "shipmentData",
  function () {
    return Shipment;
  },
  {}
);
ReactiveTable.publish(
  "shipmentRateData",
  function () {
    return ShipmentRate;
  },
  {}
);
ReactiveTable.publish(
  "shipmentProductData",
  function () {
    return ShipmentProduct;
  },
  {}
);

Meteor.publish("logistics.all", function () {
  return Logistics.find();
});
Meteor.publish("logistics.single", function (pId) {
  // console.log(pId);
  return Logistics.find(pId);
});

Meteor.publish("shipment.all", function () {
  return Shipment.find();
});
Meteor.publish("shipment.single", function (pId) {
  // console.log(pId);
  return Shipment.find(pId);
});
Meteor.publish("shipmentRate.single", function (pId) {
  // console.log(pId);
  return ShipmentRate.find(pId);
});
Meteor.publish("shipmentProduct.single", function (pId) {
  // console.log(pId);
  return ShipmentProduct.find(pId);
});

/**
 * Publishing for sub page
 */
publishPagination(Logistics, {
  transform_filters: function (filters, options) {
    allowedKeys = ["logisticId", "logisticStatus"];
    const modifiedFilters = [];
    for (let i = 0; i < filters.length; i++) {
      modifiedFilters[i] = _.extend(_.pick(filters[i], allowedKeys));
    }
    return modifiedFilters;
  },
});
publishPagination(Shipment, {
  transform_filters: function (filters, options) {
    allowedKeys = [
      "logisticsId",
      "customerId",
      "shipmentType",
      "shipmentStatus",
    ];
    const modifiedFilters = [];
    for (let i = 0; i < filters.length; i++) {
      modifiedFilters[i] = _.extend(_.pick(filters[i], allowedKeys));
    }
    return modifiedFilters;
  },
});
publishPagination(ShipmentRate, {
  transform_filters: function (filters, options) {
    allowedKeys = ["logisticId", "shipmentId"];
    const modifiedFilters = [];
    for (let i = 0; i < filters.length; i++) {
      modifiedFilters[i] = _.extend(_.pick(filters[i], allowedKeys));
    }
    return modifiedFilters;
  },
});
publishPagination(ShipmentProduct, {
  transform_filters: function (filters, options) {
    allowedKeys = ["logisticId", "shipmentId", "productId"];
    const modifiedFilters = [];
    for (let i = 0; i < filters.length; i++) {
      modifiedFilters[i] = _.extend(_.pick(filters[i], allowedKeys));
    }
    return modifiedFilters;
  },
});
