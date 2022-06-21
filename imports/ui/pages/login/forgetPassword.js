import './forgetPassword.html';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import toastr from "toastr";
import { Session } from 'meteor/session';
import { Accounts } from 'meteor/accounts-base'

Tracker.autorun(() => {

});

Template.forgetPassword.helpers({
    // var $ = require('jquery');
    loginInSession: function () {
        return Session.get('loginIn');
    },
    loginUser: function () {

    }
});
Template.forgetPassword.events({

    "click .btnlogin": function (e, tpl) {
        // e.preventDefault();
        var email = $('#myemail').val();
        var password = $('#password').val();
        console.log(email);
        // console.log(password);
        Session.set('loginIn', true);
        // var email = template.find('#recover-email').value.trim();
        Accounts.forgotPassword({ email: email }, function (err) {
            if (err) {
                if (err.message === 'User not found [403]') {
                    toastr.warning("There is no account registered with this email!");
                    Session.set('loginIn', false);
                } else {
                    console.log(err.message);
                    toastr.warning("We are sorry but something went wrong.");
                    Session.set('loginIn', false);
                }
            } else {
                toastr.success("An email has been sent");
                Session.set('loginIn', false);
                FlowRouter.redirect('/');
            }
        });
        // Meteor.loginWithPassword(email, password, function (err) {
        //     console.log(email);
        //     // console.log(password);
        //     if (err) {
        //         // $(".alert-placeholder").html('<div></div><div class="alert"><span><i class="icon-sign"></i>' + err.message + '</span></div>')
        //         console.log(err.message);
        //         FlowRouter.redirect('/login');
        //         toastr.success('Wrong Credential!');
        //         Session.set('loginIn', false);
        //     } else {
        //         // console.log(res);
        //         var uId = Meteor.userId();
        //         console.log(uId);
        //         var user = Meteor.users.findOne(uId);
        //         var oId = user.profile.organizationId;
        //         console.log('oId:' + oId);
        //         var role = Meteor.roleAssignment.find({ 'user._id': uId }).fetch();
        //         var userRole = role[0].role._id;
        //         console.log('role:' + userRole);
        //         Session.set('userOrgId', oId)
        //         Session.set('userRole', userRole);
        //         Session.set('loginIn', false);
        //         FlowRouter.redirect('/');
        //         toastr.success('Logged In!');
        //     }
        // });
        // FlowRouter.redirect('/');
        // toastr.success('Logged In!');
    },
    // Meteor.loginWithPassword(emailVar, passwordVar);
});