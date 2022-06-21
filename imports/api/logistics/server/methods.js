// Methods related to counseling

import { Meteor } from "meteor/meteor";
import { check } from "meteor/check";
// import { Answer } from './answer.js';
// import { Questioner } from '../questioner/questioner.js';
import {
  Logistics,
  Shipment,
  ShipmentProduct,
  ShipmentRate,
} from "../logistics.js";

Meteor.methods({
  //WAREHOUSE
  "logistics.all"() {
    return Logistics.find({}).fetch();
  },
  "logistics.single"(lId) {
    return Logistics.find(lId);
  },
  "logistics.insert"(
    logisticsName,
    logisticsDescription,
    logisticsAddress,
    logisticsCity,
    logisticsCountry,
    logisticsZip,
    logisticsType,
    logisticsStatus
  ) {
    var uId = Meteor.userId();
    return Logistics.insert({
      logisticsName,
      logisticsDescription,
      logisticsAddress,
      logisticsCity,
      logisticsCountry,
      logisticsZip,
      logisticsType,
      logisticsStatus,
      createdBy: uId,
      createdAt: new Date(),
    });
  },
  "logistics.remove"(id) {
    if (!this.userId) {
      throw new Meteor.Error(401, "Unauthorized");
    }
    Logistics.remove(id);
  },
  "logistics.update"(
    id,
    logisticsName,
    logisticsDescription,
    logisticsAddress,
    logisticsCity,
    logisticsCountry,
    logisticsZip,
    logisticsType,
    logisticsStatus
  ) {
    var uId = Meteor.userId();
    return Logistics.update(
      { _id: id },
      {
        $set: {
          logisticsName: logisticsName,
          logisticsDescription: logisticsDescription,
          logisticsAddress: logisticsAddress,
          logisticsCity: logisticsCity,
          logisticsCountry: logisticsCountry,
          logisticsZip: logisticsZip,
          logisticsType: logisticsType,
          logisticsStatus: logisticsStatus,
          updatedBy: uId,
          updatedAt: new Date(),
        },
      }
    );
  },

  // Shipment
  "shipment.all"() {
    return Shipment.find({}).fetch();
  },
  "shipment.detail"(id) {
    return Shipment.findOne(id);
  },
  "shipment.insert"(
    shipmentRef,
    shipmentCustomer,
    shipmentAddress,
    shipmentCity,
    shipmentProvince,
    shipmentCountry,
    shipmentDeliveryDate,
    shipmentType,
    logisticsId,
    shipmentStatus
  ) {
    var uId = Meteor.userId();
    var shipmentId = Shipment.insert({
      shipmentRef,
      shipmentCustomer,
      shipmentAddress,
      shipmentCity,
      shipmentProvince,
      shipmentCountry,
      shipmentDeliveryDate,
      shipmentType,
      logisticsId,
      shipmentStatus,
      createdBy: uId,
      createdAt: new Date(),
    });
    var shipmentCode = "SHIP-" + shipmentId;
    return Shipment.update(
      { _id: shipmentId },
      {
        $set: {
          shipmentCode: shipmentCode,
          shipmentProduct: [],
        },
      }
    );
  },
  "shipment.remove"(id) {
    if (!this.userId) {
      throw new Meteor.Error(401, "Unauthorized");
    }
    Shipment.remove(id);
  },
  "shipment.update"(
    id,
    shipmentRef,
    shipmentCustomer,
    shipmentAddress,
    shipmentCity,
    shipmentProvince,
    shipmentCountry,
    shipmentDeliveryDate,
    shipmentType,
    logisticsId,
    shipmentStatus
  ) {
    var uId = Meteor.userId();
    return Shipment.update(
      { _id: id },
      {
        $set: {
          shipmentRef,
          shipmentCustomer,
          shipmentAddress,
          shipmentCity,
          shipmentProvince,
          shipmentCountry,
          shipmentDeliveryDate,
          shipmentType,
          logisticsId,
          shipmentStatus,
          updatedBy: uId,
          updatedAt: new Date(),
        },
      }
    );
  },
  // ShipmentProduct
  "shipmentProduct.all"() {
    return ShipmentProduct.find({}).fetch();
  },
  "shipmentProduct.exportByShipment"(ids) {
    return ShipmentProduct.find({ shipmentId: ids }).fetch();
  },
  "shipmentProduct.insert"(
    shipmentId,
    productId,
    shipmentProductQtyOrder,
    shipmentProductQtyShip,
    warehouseId
  ) {
    var uId = Meteor.userId();
    var shipmentProductId = ShipmentProduct.insert({
      shipmentId,
      productId,
      shipmentProductQtyOrder,
      shipmentProductQtyShip,
      warehouseId,
      createdBy: uId,
      createdAt: new Date(),
    });
    return Shipment.update(
      { _id: shipmentId },
      {
        $push: {
          shipmentProduct: shipmentProductId,
        },
      }
    );
  },
  "shipmentProduct.remove"(shipmentId, id) {
    if (!this.userId) {
      throw new Meteor.Error(401, "Unauthorized");
    }
    ShipmentProduct.remove(id);
    return Shipment.update(
      { _id: shipmentId },
      {
        $pull: {
          shipmentProduct: id,
        },
      }
    );
  },
  "shipmentProduct.update"(
    id,
    shipmentDate,
    productId,
    logisticsId,
    shipmentType,
    shipmentQty
  ) {
    var uId = Meteor.userId();
    return Shipment.update(
      { _id: id },
      {
        $set: {
          shipmentDate: shipmentDate,
          productId: productId,
          logisticsId: logisticsId,
          shipmentType: shipmentType,
          shipmentQty: shipmentQty,
          updatedBy: uId,
          updatedAt: new Date(),
        },
      }
    );
  },
});
