import './reportscan2.html';
import { Meteor } from 'meteor/meteor';

import { $ } from 'meteor/jquery';
import moment from 'moment';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import Papa from 'papaparse';
import { TokpedOrderDetail, TokopediaOrders, shipper } from '../../../api/orders/orders';

var filterdata =[]

Tracker.autorun(() => {

  Session.set('sd',null)
  Session.set('ed',null)
  Session.set('sdexport',null)
  Session.set('edexport',null)
  Session.set('print',"")
  Session.set('shipper',"")
    // Meteor.call("reportdata",(err,res)=>{
    //     console.log('res',res)
    //     Session.set('query',res)
    // })
    Meteor.subscribe('shipperFind.all');

    Meteor.subscribe('agregateFufillment.all');
    Meteor.subscribe('agregateFufillmentDay.all');
    Meteor.subscribe('allOrders.validate1');
    Meteor.subscribe('allOrders.picklist');
    Meteor.subscribe('allOrders.validate2');
    // Meteor.subscribe('agregateOrders.all');
    // Meteor.subscribe('shopMp.all');
});

Template.reportscan2.onCreated(function () {
    
    
    Session.set('sd',null)
    Session.set('ed',null)
    Session.set('sdexport',null)
    Session.set('edexport',null)
    Session.set('print',"")
    Session.set('shipper',"")
    // $('#enddate').val(today);
    var d = new Date();
    d.setDate(d.getDate());
    console.log(d)
    this.filter1 = new ReactiveTable.Filter('startdate', ['validasi2At']);
    this.filter2 = new ReactiveTable.Filter('enddate', ['validasi2At']);
    this.filter3 = new ReactiveTable.Filter('shipper', ['shipper_internal']);
    this.filter4 = new ReactiveTable.Filter('printed', ['printedstatus']);

    // Template.instance().filter1.set({'$gt': d});
    // console.log('this',this)
    this.isSubs = new ReactiveVar(false);
  
  
  });

Template.reportscan2.events({
    'click .btnExport'(e, tpl) {
        // $(e.currentTarget).prop('disabled', true);
        var sd = new Date(Session.get('sd'))
        var ed = Session.get('ed') ? Session.get('ed').toISOString().slice(0,10) : new Date().toISOString().slice(0,10);
        var sdexport = $("#startdate").val()
        var edexport = $("#enddate").val() ? $("#enddate").val() : new Date().toISOString().slice(0,10);
        var print = Session.get('print') ? Session.get('print') : false;
        var shipper = Session.get('shipper');

        // console.log('sd',sdexport )
        // console.log('siper',shipper)
        console.log('new',moment(new Date()).format('yyyyMMD'))
        if(shipper){
            Meteor.call("exportdatascan2",sdexport,edexport,shipper,print,(err,res)=>{
                console.log('res',res)
                let data = res
                var ansR = JSON.stringify(data);
                      console.log(ansR);
                var csv = Papa.unparse(ansR);
                console.log('cs',csv);

                var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                var csvURL = null;
                if (navigator.msSaveBlob) {
            
                    csvURL = navigator.msSaveBlob(csvData, 'download.csv');
                  }
                  else {
                    csvURL = window.URL.createObjectURL(csvData);
                  }
                  // var dateNow = new Date()
                  var tempLink = document.createElement('a');
                  tempLink.href = csvURL;
                  tempLink.setAttribute('download', 'Data Scan2 '+ moment(new Date()).format('yyyyMMD')+'.csv');
                  tempLink.click();
                  toastr.success('Export Sucess');
                  $(e.currentTarget).prop('disabled', false);
                  Session.set('isDownloading', false);  
                console.log(data)
            })
          }
          else if(!shipper || !sd){
            toastr.error('Error', ' Please choose field start date or shipper! ')
          }
        Session.set('isDownloading', true);

      },
    'click .btnprint': function (e, tpl) {
      e.preventDefault();
      var sd = Session.get('sd') ? new Date(Session.get('sd')).toISOString() : new Date()
      var ed = Session.get('ed') ? Session.get('ed').toISOString().slice(0,10) : new Date().toISOString().slice(0,10);
      var print = Session.get('print') ? Session.get('print') : false;
      var shipper = Session.get('shipper');

      if(!sd){
        toastr.error('Error', ' Please choose field start date ')
      }
      else if(!shipper || !sd){
        toastr.error('Error', ' Please choose field shipper! ')
      }
      else{
        FlowRouter.go('/report/printscan2/' + sd +'/'+ ed +'/'+ shipper +'/'+ print );
      }
    },
  "change #startdate": function (event, template) {
    var input = $(event.target).val()
    Session.set('sd',null)
    var date= new Date()
    date.setDate(input.getDate());
    Session.set('sdexport',input)
    Session.set('sd',date)
    var ed =Session.get('ed')  
    // console.log('ed',ed.toISOString().slice(0,10))
    console.log('SD',input)
    if (input) {
        if(!ed || ed.toISOString().slice(0,10) === input ){
            template.filter1.set({'$gte': date,'$lte':new Date()});
            console.log('SDs',date)
            console.log('this',Template.instance())
            console.log(filterdata)
        }
        else if(ed.setDate(ed.getDate()) > date.setDate(date.getDate())){
            template.filter1.set({'$gte': date,'$lte': ed});
            console.log('SD',date)
        }
        else{
            toastr.info('Info, End Date Cannot be Smaller than Start Date!')
            console.log('lebih kexil')
            template.filter1.set("");
        }
    } else {
      template.filter1.set("");
    }
  },
  "change #enddate": function (event, template) {
    Session.set('ed',null)
    var input = $(event.target).val()

    var date= new Date(input+"T23:59:59")
    date.setDate(date.getDate());
    Session.set('ed',date)
    Session.set('edexport',input)
    var sd = Session.get('sd')  
    if (input) {
        if(!sd || sd.toISOString().slice(0,10) === input ){
            template.filter1.set({'$lte':new Date(input+"T00:00:00"),'$lte': date});
            console.log('eds',date)
        }
        else if(sd.setDate(sd.getDate()) < date.setDate(date.getDate())){
            template.filter1.set({'$gte': sd,'$lte': date});
            console.log('ed',date)
        }
        else{
            toastr.info('Info, End Date Cannot be Smaller than Start Date!')
            console.log('lebih kexil')
            template.filter2.set("");
        }
    //   template.filter1.set({'$lt': date});
    } else {
      template.filter1.set("");
    }
  },
  "change #shipper": function (event, template) {
    var input = $(event.target).val()
    Session.set('shipper',input)
    if (input) {
        template.filter3.set(input);
        console.log('type',template.filter3)
    } else {
      template.filter3.set("");
    }
  },
  "change #printed": function (event, template) {
    var input = $(event.target).val()
    if (input) {
      if(input === 'true'){
            template.filter4.set({'$eq':true});
            Session.set('print',true)
        }
        else if(input === "false"){
          template.filter4.set({'$eq':false});
            Session.set('print',false)
        }
    } else {
      template.filter4.set("");
    }
  },
}),

Template.reportscan2.onRendered(function () {
 
  })
Template.reportscan2.helpers({
  isSubscriptionsR: function () {
    var subs = Template.instance().isSubs.get()
    console.log('subs ready:' + subs);
    // $('#startdate').val(now.toISOString().slice(0,    11)+"00:00:00");

    // $('#enddate').val(now.toISOString().slice(0, 11)+"23:59:59")
    return subs;
  },
//   order:function(){
//     myCollection2 = Session.get("query")
//     console.log('col2', myCollection2)
//     return myCollection2;

//   },
  settingsvalid2: function () {

    Template.instance().isSubs
    return {
      collection:"reportdata",
      rowsPerPage: 10,
      showFilter: false,
      fields: [
        { key: 'tracking_no', label: 'Tracking No', cellClass: 'text-bold mr-1' },
        // { key: 'order_id', label: 'Order ID' },
        { key: 'invoice_no', label: 'Invoice No' },
        { key: 'store_name', label: 'Brand' },
        { key: 'marketplace', label: 'Market Place' },
        { key: 'shipper_internal', label: 'Shipper' },
        {
          key: 'printedstatus', label: 'Printed',
          fn: function (datas) {
            if (!datas || datas === false) {
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-warning' >None</span>")
            }
            else {
              return new Spacebars.SafeString("<span class='col-md-8 badge badge-success'>Done</span>")
            }
          },
        },
        {
            key: 'validasi2At', label: 'Validation Date', sortOrder: 0, sortDirection: 'descending', fn: function (date) {
                return moment(new Date(date)).format('D-MMM-YYYY, HH:mm')
            }
        },
        {
            key: 'checkboxstatus', label: 'Action', tmpl: Template.report, sortable: false,
        },
    ],
      filters: ['myFilterBrand', 'startdate','enddate','shipper','printed'],
      ready: Template.instance().isSubs,
    };
  },
  showDataKurir: function () {
    var kurir = shipper.find();
    return kurir;
  },
      
});
Template.report.onCreated(async function () {
    var check = Template.instance().data
    var d = 0
   console.log(check)
   filterdata.push(this.data)
  });

