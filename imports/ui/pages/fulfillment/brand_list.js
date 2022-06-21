import './brand_list.html';
import moment from 'moment';
import Papa from 'papaparse';
import { Meteor } from 'meteor/meteor';
import { Brand } from '../../../api/brand/brand';
import toastr from 'toastr';
import { ReactiveMethod } from 'meteor/simple:reactive-method';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Marketplace } from '../../../api/marketplace/marketplace';
import { Product } from '../../../api/product/product';

Template.brand_list.onCreated(function () {
  this.isSubs = new ReactiveVar(false);
  Session.set('formSwitch', false);
  Session.set('isDownloading', false);
});
Template.brandMp.helpers({
  brandMarketplace: function (bId) {
    return ReactiveMethod.call('brand.marketplace.count', bId);
  },
  // brandMarketplace1(bId) {
  //   // console.log('bId: ' + bId);
  //   var mpCount = ReactiveMethod.call('brand.marketplace.count', bId);
  //   console.log(mpCount);
  //   return mpCount;
  //   // return Marketplace.find({ 'brandId': bId }).count();
  // },
});
Template.brandPr.helpers({
  brandProduct(bId) {
    // var mpCount = ReactiveMethod.call('brand.product.count', bId);
    // console.log(mpCount);
    // return mpCount;
  },
});
Template.brand_list.helpers({
  settings: function () {
    // Session.get('isLoading');
    return {
      collection: 'brandData',
      rowsPerPage: 10,
      showFilter: false,
      fields: [
        { key: 'brandName', label: 'Name' },
        { key: '_id', label: 'Marketplace', tmpl: Template.brandMp, sortable: false },
        { key: '_id', label: 'Product', tmpl: Template.brandPr, sortable: false },
        { key: 'brandStatus', label: 'Status', tmpl: Template.brandStatus },
        { label: 'Action', tmpl: Template.brandAction1, sortable: false }
      ],
      filters: ['myFilterBrand'],
      ready: Template.instance().isSubs,
    };
  },
  isSubscriptionR: function () {
    var subs = Template.instance().isSubs.get();
    // console.log('helper subs:' + subs);
    return subs;
  },
  my_collection_download: function () {
    return Session.get('isDownloading');
  },
  brandCount(mId) {
    // console.log('mId:' + mId);
    return ReactiveMethod.call('brand.inmp.count', mId);
  },
});

Template.brand_list.events({
  'click .btnSearch'(e, tpl) {
    if (Session.get('searchSwitch') === true) {
      $('#inputSearch').addClass('d-none');
      Session.set('searchSwitch', false);
      // console.log('formSwitch false');
    } else {
      $('#inputSearch').removeClass('d-none');
      Session.set('searchSwitch', true);
      // console.log('formSwitch true');
    }
  },
  'click .btnExportCsv'(e, tpl) {
    $(e.currentTarget).prop('disabled', true);
    Session.set('isDownloading', true);
    Meteor.call('brand.download',
      (err, res) => {
        if (err) {
          toastr.warning('Export Failed' + err);
          $(e.currentTarget).prop('disabled', false);
          Session.set('isDownloading', false);
        } else {
          var ansR = JSON.stringify(res);
          var csv = Papa.unparse(ansR);
          var csvData = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          var csvURL = null;
          if (navigator.msSaveBlob) {
            csvURL = navigator.msSaveBlob(csvData, 'download.csv');
          }
          else {
            csvURL = window.URL.createObjectURL(csvData);
          }
          var tempLink = document.createElement('a');
          tempLink.href = csvURL;
          tempLink.setAttribute('download', 'brand.csv');
          tempLink.click();
          toastr.success('Export Sucess');
          $(e.currentTarget).prop('disabled', false);
          Session.set('isDownloading', false);
        }
      });
  },
  'click .btnForm'(e, tpl) {
    if (Session.get('formSwitch') === true) {
      $('#entryData').addClass('d-none');
      Session.set('formSwitch', false);
      console.log('formSwitch false');
    } else {
      $('#entryData').removeClass('d-none');
      Session.set('formSwitch', true);
      console.log('formSwitch true');
    }
  },
  'click .btnSave'(e, tpl) {
    var brandName = $('#brandName').val();
    var brandDescription = $('#brandDescription').val();
    var brandAddress = $('#brandAddress').val();
    var brandCity = $('#brandCity').val();
    var brandProvince = $('#brandProvince').val();
    var brandCountry = $('#brandCountry').val();
    var brandZip = $('#brandZip').val();
    var brandEmail = $('#brandEmail').val();
    var brandWeb = $('#brandWeb').val();
    var brandPhone = $('#brandPhone').val();
    var brandFb = $('#brandFb').val();
    var brandIG = $('#brandIG').val();
    var brandUsers = $('#brandUsers').val();
    var brandManagers = $('#brandManagers').val();
    var brandStatus = $('#brandStatus').val();
    // if (confirm('Do you want to add aps?')) {
    Meteor.call('brand.insert',
      brandName,
      brandDescription,
      brandAddress,
      brandCity,
      brandProvince,
      brandCountry,
      brandZip,
      brandEmail,
      brandWeb,
      brandPhone,
      brandFb,
      brandIG,
      brandUsers,
      brandManagers,
      brandStatus,
      (err, res) => {
        if (err) {
          toastr.warning('Add Failed')
        } else {
          $('#entryData').addClass('d-none');
          Session.set('formSwitch', false);
          toastr.success('Add Sucess');
        }
      });
    // }
  },
});
Template.brandAction1.events({
  'click a.btnDelete': function (e, tpl) {
    // e.preventDefault();
    var sId = this._id;
    console.log(sId);
    // var sesiId = FlowRouter.getParam("_id");
    if (confirm('Do you want to remove this data?')) {
      Meteor.call('brand.remove', sId,
        (err, res) => {
          if (err) {
            toastr.warning('Delete Fail')
          } else {
            toastr.success('Delete Success');
          }
        }
      );
    }
  },
  'click .btnSaveEdit': function (e, tpl) {
    // e.preventDefault();
    var id = this._id;
    var brandName = $('#brandName1' + id).val();
    var brandDescription = $('#brandDescription1' + id).val();
    var brandAddress = $('#brandAddress1' + id).val();
    var brandCity = $('#brandCity1' + id).val();
    var brandProvince = $('#brandProvince1' + id).val();
    var brandCountry = $('#brandCountry1' + id).val();
    var brandZip = $('#brandZip1' + id).val();
    var brandEmail = $('#brandEmail1' + id).val();
    var brandWeb = $('#brandWeb1' + id).val();
    var brandPhone = $('#brandPhone1' + id).val();
    var brandFb = $('#brandFb1' + id).val();
    var brandIG = $('#brandIG1' + id).val();
    var brandUsers = $('#brandUsers1' + id).val();
    var brandManagers = $('#brandManagers1' + id).val();
    var brandStatus = $('#brandStatus1' + id).val();
    // if (confirm('Do you want to save survey?')) {
    Meteor.call('brand.update',
      id,
      brandName,
      brandDescription,
      brandAddress,
      brandCity,
      brandProvince,
      brandCountry,
      brandZip,
      brandEmail,
      brandWeb,
      brandPhone,
      brandFb,
      brandIG,
      brandUsers,
      brandManagers,
      brandStatus,
      (err, res) => {
        if (err) {
          toastr.warning('Edit Failed')
        } else {
          toastr.success('Edit Sucess');
        }
      });
    // }
  },
});