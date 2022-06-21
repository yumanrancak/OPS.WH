/* eslint-disable import/no-unresolved */
import { Meteor } from "meteor/meteor";
import { Movement, Stock, Warehouse } from "../warehouse.js";
import { publishPagination } from "meteor/kurounin:pagination";
import { ReactiveTable } from "meteor/aslagle:reactive-table";

ReactiveTable.publish(
  "warehouseData",
  function () {
    return Warehouse;
  },
  {}
);
ReactiveTable.publish(
  "stockData",
  function () {
    return Stock;
  },
  {}
);
ReactiveTable.publish(
  "movementData",
  function () {
    return Movement;
  },
  {}
);

Meteor.publish("warehouse.single", function (pId) {
  return Warehouse.find(pId);
});
Meteor.publish("warehouse.all", function (pId) {
  return Warehouse.find();
});
Meteor.publish("warehouse.active", function () {
  return Warehouse.find({warehouseStatus:"Active"},{})
});

publishPagination(Warehouse, {
  transform_filters: function (filters, options) {
    allowedKeys = ["_Id"];
    const modifiedFilters = [];
    // filters is an array of the provided filters (client side filters & server side filters)
    for (let i = 0; i < filters.length; i++) {
      modifiedFilters[i] = _.extend(_.pick(filters[i], allowedKeys));
    }
    return modifiedFilters;
  },
});
publishPagination(Stock, {
  transform_filters: function (filters, options) {
    allowedKeys = ["productId", "warehouseId"];
    const modifiedFilters = [];
    // filters is an array of the provided filters (client side filters & server side filters)
    for (let i = 0; i < filters.length; i++) {
      modifiedFilters[i] = _.extend(_.pick(filters[i], allowedKeys));
    }
    return modifiedFilters;
  },
});
publishPagination(Movement, {
  transform_filters: function (filters, options) {
    allowedKeys = ["productId", "warehouseId"];
    const modifiedFilters = [];
    // filters is an array of the provided filters (client side filters & server side filters)
    for (let i = 0; i < filters.length; i++) {
      modifiedFilters[i] = _.extend(_.pick(filters[i], allowedKeys));
    }
    return modifiedFilters;
  },
});
