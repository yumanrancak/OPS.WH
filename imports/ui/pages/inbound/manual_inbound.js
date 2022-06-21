import './manual_inbound.html';
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

Template.manual_inbound.events({
    'click .scanhere' : function(e,tpl){
        e.preventDefault();
        $('#scanhere').hide();
        $('#scaning').show()
    },
    'click .qty-area' : function(e,tpl){
        $("#inputqty").show();
    },
    'change #scaning' : function(e,tpl){
        console.log("OK")
    }
})

Template.manual_inbound.helpers({
    // StoreErrorLog() {
    //     return OrderErrorLogs.find({'typescan':1},{ sort: { 'createdAt': -1 }, limit: 15});
    // },
});
