// Client entry point, imports all client code

import '/imports/startup/client';
import '/imports/startup/both';

// Additional Import
import '@fortawesome/fontawesome-free/js/all.js'
import { $ } from 'meteor/jquery';
import 'toastr/build/toastr.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './registerHelper.js';

// import dataTablesBootstrap from 'datatables.net-bs4';
// import 'datatables.net-bs4/css/dataTables.bootstrap4.css';
// dataTablesBootstrap(window, $);

Meteor.startup(function () {
    $('body').addClass('hold-transition sidebar-mini text-sm');
});

