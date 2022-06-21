// All links-related publications

import { Meteor } from 'meteor/meteor';
import { loginbound } from '../inbound';
import { ReactiveTable } from 'meteor/aslagle:reactive-table';

Meteor.publish('allLoguploadInbound.all', function () {
  return loginbound.find({ 'approve': 'none' }, { sort: { 'createdAt': -1 } });
});


ReactiveTable.publish('loginbound',loginbound, function () { 
  // const log = new Mongo.Collection(loginbound.find({ 'approve': 'none' }, { sort: { 'createdAt': -1 } }));

  return {approve:'none'}
}, {})

// Meteor.publish("counts-notif", function () {
//   var self = this;
//   var count = 0;
//   var initializing = true;

//   var handle = loginbound.find({approve: 'true'},{}).observeChanges({
//     added: function (doc, id) {
//       count++;
//       if (!initializing)
//       self.changed("counts",this._id, {count: count});
//         // self.changed("counts", roomId, {count: count});  // "counts" is the published collection name
//     },
//     removed: function (doc, id) {
//       count--;
//       self.changed("counts",this._id, {count: count});
//       // self.changed("counts", roomId, {count: count});  // same published collection, "counts"
//     }
//     // don't care about moved or changed
//   });
  
//   initializing = false;

//   // publish the initial count. `observeChanges` guaranteed not to return
//   // until the initial set of `added` callbacks have run, so the `count`
//   // variable is up to date.
//   self.added("counts", this._id,{count: count});

//   // and signal that the initial document set is now available on the client
//   self.ready();

//   // turn off observe when client unsubscribes
//   self.onStop(function () {
//     handle.stop();
//   });
// });