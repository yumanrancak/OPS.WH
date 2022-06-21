import './printsumarry.html';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

var sd = new Date()
var ed = new Date()
var print = ""
var shipper = ""
var data= []

Template.printsumarry.onCreated(async function () {
    this.isSubs = new ReactiveVar(false);
    // sd = FlowRouter.getParam('sd').slice(0,10)
    // ed = FlowRouter.getParam('ed').slice(0,10)
    // shipper = FlowRouter.getParam('shipper')
    // print = FlowRouter.getParam('print')? FlowRouter.getParam('print') : false 
    // console.log('sd',sd)
    // console.log('sd',FlowRouter.getParam('shipper'))
    // Meteor.call("printscan2",sd,ed,shipper,print,(err,res)=>{
    //     console.log('res',res)
    //     data= res
    // })
  });
  
  Template.printsumarry.events({
    'click .btnback': function (e, tpl) {
      e.preventDefault();
      var id = this._id;
      history.back();
      // FlowRouter.go('/pick_list/batch_list/');
    },
    'click .btnPrint': function (e, tpl) {
      e.preventDefault();
    //   var printContents = document.getElementById(print1).innerHTML;
    //   console.log('',document.getElementsByName(print1))
    //   document.body.innerHTML = printContents;
  
      window.print();
      // document.body.innerHTML = originalContents;
    },
  
  })
  
Template.printsumarry.helpers({
    Date() {
        return moment(new Date()).format('D-MMM-YYYY, HH:mm')
    },
    shipper(){
        return FlowRouter.getParam('shipper')
    },
    scan2data: function () {
        // var datas = data
        // console.log(datas)
        sd = FlowRouter.getParam('sd').slice(0,10)
        ed = FlowRouter.getParam('ed').slice(0,10)
        shipper = FlowRouter.getParam('shipper')
        print = FlowRouter.getParam('print')? FlowRouter.getParam('print') : false 
        console.log('sd',sd)
        console.log('sd',FlowRouter.getParam('shipper'))
        var datas = ReactiveMethod.call('printscan2', sd,ed,shipper,print);
        console.log(datas)
        return datas;
    },
    orderFulfill: function () {
        var orders = BlibliOrders.find({ $or: [{ internal_status: 'PROCESSED' }, { internal_status: 'SHIPPING' }] }, { sort: { 'createdAt': -1 }, limit: 15 });
        return orders;
    },
    userName: function (id) {
        var user = Meteor.user();
        var oId = user && user.profile && user.profile.fullName;
        return oId;
    },
    storeName: function (sid) {
        var n = String(sid);
        console.log('storeCode:' + n);
        var store = ShopMp.findOne({ 'shopid': n });
        if (store) {
            var shopName = store.shopname;
            return shopName;
        } else {
            var shopName = n;
            return shopName;
        }
    },

});
