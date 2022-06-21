import './printscan2.html';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BlibliOrders } from '../../../api/orders/orders';
import { ShopMp } from '../../../api/marketplace/marketplace';
import { AgregateOrders } from '../../../api/agregate/agregate';
import { ExternalStore } from '../../../api/externalStore/externalStore';

var sd = new Date()
var ed = new Date()
var print = ""
var shipper = ""
var data= []

Template.printscan2.onCreated(async function () {
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
  
  Template.printscan2.events({
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
      console.log('this',Session.get('data'))
      var datas = Session.get('data')
      Meteor.call("print.change",datas,(err,res)=>{
        console.log(' print',res)
      })
      window.print();
      // document.body.innerHTML = originalContents;
    },
  
  })
  
Template.printscan2.helpers({
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
        // console.log('sd',sd)
        // console.log('sd',ed)
        var datas = ReactiveMethod.call('printscan2', sd,ed,shipper,print);
        // console.log('DATAS',datas)
        Session.set('data',datas)
        return datas;
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
