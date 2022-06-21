import './secure.html';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import toastr from "toastr";
import { Session } from 'meteor/session';

Template.secure.helpers({
    // var $ = require('jquery');
    loginInSession: function () {
        return Session.get('loginIn');
    },

});
Template.secure.events({
    //add your events here
    // 'click .saml-login'(event) {
    //     console.log('saml-login');
    //     event.preventDefault();
    //     var provider = event.target.getAttribute('data-provider');
    //     Meteor.loginWithSaml({
    //         provider
    //     }, function (error, result) {
    //         //handle errors and result
    //     });
    // },
    // 'click .saml-login1': function (event, template) {
    //     var provider = "some-provider";
    //     Meteor.loginWithSaml({ provider: provider },
    //         function (error, result) { //handle errors and result 
    //         });
    // }
    // 'click .saml-login': function (event, template) {
    //     console.log('clicked')
    //     var provider = "shibboleth-idp";
    //     Meteor.loginWithSaml({ provider: provider }, function (error, result) {
    //         console.log(result);
    //         console.log(error);

    //     });
    // },
    'click .saml-login': function (event, template) {
        const provider = 'shibboleth-idp'
        const path = 'Shibboleth.sso'
        Meteor.loginWithSaml({ provider, path }, (err, result) => {
            if (err) {
                console.log(err)
            } else if (result) {
                console.log(result)
            }
        })
    },
    'click .saml-logout': function (event, template) {
        const provider = 'shibboleth-idp'
        const path = 'Shibboleth.sso'
        Meteor.logoutWithSaml({ provider, path }, (err, result) => {
            if (err) {
                console.log(err)
            } else if (result) {
                console.log(result)
            }
            // ...
        })
    },
    "click .btnlogin": function (e, tpl) {
        // e.preventDefault();
        var email = $('#myemail').val();
        var password = $('#password').val();
        console.log(email);
        // console.log(password);
        Session.set('loginIn', true);
        Meteor.loginWithPassword(email, password, function (err) {
            console.log(email);
            // console.log(password);
            if (err) {
                // $(".alert-placeholder").html('<div></div><div class="alert"><span><i class="icon-sign"></i>' + err.message + '</span></div>')
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
        // FlowRouter.redirect('/');
        // toastr.success('Logged In!');
    },
    // Meteor.loginWithPassword(emailVar, passwordVar);
});