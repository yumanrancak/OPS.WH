// All links-related publications
import { ReactiveTable } from 'meteor/aslagle:reactive-table';
import { Meteor } from 'meteor/meteor';
import { Brand } from '../../brand/brand';
import { batchList, batchListDetail } from '../picklist';


Meteor.publish('brand.all', function () {
  return Brand.find({}, { sort: { 'brandName': 1 } });
});


ReactiveTable.publish('batchdashboard', batchList, function () {
  return {  }
}, {})
ReactiveTable.publish('batchlist1', batchList, function () {
  return { completedStatus: null, }
}, {})

ReactiveTable.publish('batchaccepted', batchList, function () {
  return { handover: {$ne:true}, }
}, {})

ReactiveTable.publish('batchlistcomplete', batchList, function () {
  return { handover: { $eq: true } }
}, {})
Meteor.publish('showhandover1', function () {
  var batch = batchList.find({ acceptStatus: true }, {})
  // console.log('batch',batch)
  return batch
});