import './do_create.html';
import { Meteor } from 'meteor/meteor';
import { $ } from 'meteor/jquery';
import Papa from 'papaparse';
import { result } from 'lodash';

toastr.options = {
    "closeButton": true,
    "debug": true,
    "newestOnTop": false,
    "progressBar": true,
    "fontSize": "20",
    "positionClass": "toast-top-full-width",
    "preventDuplicates": false,
    "onclick": null,
    "showDuration": "300",
    "hideDuration": "1000",
    "timeOut": "5000",
    "extendedTimeOut": "1000",
    "showEasing": "swing",
    "hideEasing": "linear",
    "showMethod": "fadeIn",
    "hideMethod": "fadeOut"
}
Meteor.subscribe('errorLogOrder.100');
let datas = [] 
let filesname = ""
Tracker.autorun(() => {

    // Meteor.subscribe('allorderscan.100');
    // Meteor.subscribe('movementprod.15');    
    
});
Template.do_create.events({
    'click .uploadbtn': function(event) {
        console.log('event',event)
        event.preventDefault();
        console.log('uploadFile',document.getElementById('uploadFile') )
        let dateprocessed =  document.getElementById('dateprocessed').value;
        let dorder =  document.getElementById('do').value;
        let shipper =  document.getElementById('shipper').value;
        let koli =  document.getElementById('koli').value;
        let brand =  document.getElementById('brand').value
        let uploadFile =  document.getElementById('uploadFile').value
          if(dateprocessed == "" || dateprocessed == null){
            toastr.error("Theres Field Empty, Please Input Field Date Processed! ");    
          }
          else if(dorder == "" || dorder == null){
            toastr.error("Theres Field Empty, Please Input Field Delivery Order! ");
          }
          else if(shipper == "" || shipper == null){
            toastr.error("Theres Field Empty, Please Input Field Shipper! ");
          }
          else if(brand == "" || brand == null){
            toastr.error("Theres Field Empty, Please Input Field Brand! ");
          }
          else if (uploadFile == '' || uploadFile == null) {
            toastr.error("Theres Field Empty, Please Choose The File! ");
          }
          else{
            $('#icon-save').removeClass('fa fa-save')
            $('#icon-save').addClass('fas fa-spinner fa-pulse')
            console.log('datas',datas)
            
            var dataarray = {
                dateprocessed:dateprocessed,
                deliveryorder: dorder,
                shipper: shipper,
                koli: koli,
                brand:brand,
                file:filesname,
                detailupload:datas
            }
            Meteor.call('upload.data',dataarray,
                    (err, res) => {
                        console.log('hasil',res)
                        if (res === "simpan") {
                            toastr.success("Booking DO with File "+ dataarray.file+ " Succses to Save");
                        } else if(res === "update"){
                            toastr.success("Booking DO with File "+ dataarray.file+ " Succses to Update");
                        }

                        $('#icon-save').removeClass('fas fa-spinner fa-pulse')
                        $('#icon-save').addClass('fa fa-save')
                    });   
          }

      },
      'change #uploadFile': function (e, template) {
        Session.set('isUploading', true);
        if (e.currentTarget.files && e.currentTarget.files[0]) {
          var file = e.currentTarget.files[0];
          filesname = file.name
          console.log('file',filesname)
          if (file) {
            Papa.parse(file, {
              header: true,
              complete(results, file) {
                for(let data of results.data){
                  // console.log(data)
                  if(data.itemsku !== ''){
                    datas.push(data)
                  }
                }
                console.log('ress11',datas)
              }
            });
          }
        }
      },
      'click .btnExport'(e, tpl) {
        $(e.currentTarget).prop('disabled', true);
        Session.set('isDownloading', true);
        let data = [{
            itemsku:"00001",
            productname:"Test Product",
            brand:"Test Product",
            qty:"100"
        }]
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
          tempLink.setAttribute('download', 'UploadBookingFile001.csv');
          tempLink.click();
          toastr.success('Export Sucess');
          $(e.currentTarget).prop('disabled', false);
          Session.set('isDownloading', false);  
      },
})
Template.do_create.helpers({
    // StoreErrorLog() {
    //     return OrderErrorLogs.find({'typescan':1},{ sort: { 'createdAt': -1 }, limit: 15});
    // },
});
