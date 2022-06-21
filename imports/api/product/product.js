
import { Mongo } from 'meteor/mongo';

export const ProductCategories = new Mongo.Collection('productCategories');
export const Product = new Mongo.Collection('product');
export const logdailystock = new Mongo.Collection('logDailyStock');
export const ProductVariant = new Mongo.Collection('productVariant');
export const ProductStock = new Mongo.Collection('product_stock');
// export const Product = new Mongo.Collection('productproduct');
export const ProductLot = new Mongo.Collection('productLot');
export const product_bundle = new Mongo.Collection('product_bundle');
export const manualstock = new Mongo.Collection('manualstock');