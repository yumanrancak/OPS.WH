import './login.html';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import toastr, { success } from "toastr";
import { Session } from 'meteor/session';
import { Roles } from 'meteor/alanning:roles';

Tracker.autorun(() => {

});

Template.login.helpers({
    // var $ = require('jquery');
    loginInSession: function () {
        return Session.get('loginIn');
    },
    loginUser: function () {

    }
});
Template.login.events({
    "click .btnlogin": function (e, tpl) {
        var email = $('#myemail').val();
        var password = $('#password').val();
        console.log(email);
        // console.log(password);
        Session.set('loginIn', true);
        var user = Meteor.users.find({ 'username': email }).count();
        console.log(user);
        // User not-exist
        if (user > 0) {
            logingInUser(email, password);
            Session.set('loginIn', false);
            //go to login
        } else {
            // check Token Dolibarr
            // console.log(email, password);

            Meteor.call('checkToken', email, password, (err, res) => {
                if (res) {
                    console.log('status erp: ' + res);
                    // toastr.success('login Sucess');
                    logingInUser(email, password);
                } else {
                    toastr.warning('Login Failed, Please Try Again');
                    Session.set('loginIn', false);

                }
                if (err) {
                    toastr.warning('login Failed');
                    Session.set('loginIn', false);
                }
            });
        }

        function logingInUser(email, password) {
            console.log('logingInUser');
            // console.log(email);
            // console.log(password);
            Meteor.loginWithPassword(email, password, function (err) {
                // console.log(email);
                // console.log(password);
                if (err) {
                    console.log(err.message);
                    FlowRouter.redirect('/login');
                    toastr.success('Wrong Credential!');
                    Session.set('loginIn', false);
                } else {
                    Session.set('loginIn', false);
                    FlowRouter.redirect('/');
                    toastr.success('Logged In!');
                }
            });
        };
    },
});