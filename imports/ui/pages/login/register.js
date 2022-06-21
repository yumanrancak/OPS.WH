import './register.html';
import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { Organization } from '../../../api/organization/organization.js';
import toastr from "toastr";
import { Session } from 'meteor/session';

var organizationType = new ReactiveVar();

Template.register.helpers({

    // var $ = require('jquery');
    loginInSession: function () {
        return Session.get('loginIn');
    },
    surveyOrganization() {
        return Organization.find();
    },
    surveyTarget() {
        return Meteor.roles.find({ _id: { $nin: ["admin", "superadmin"] }, children: { $ne: [] } })
    },
    surveyOrganization() {
        // var orgType = [];
        var orgType = organizationType.get();
        console.log(orgType);
        // return Children.find({enrollmentId: selectedEnrollmentId.get()});
        if (orgType == 'tendik') {
            return Organization.find({ organizationType: 'fakultas' });
        } else {
            return Organization.find({ organizationType: 'program' });
        }
    },
});
Template.register.events({
    "click .btnRegister": function (e, tpl) {
        // e.preventDefault();
        var email = $('#myemail').val();
        var password = $('#password').val();
        var fullname = $('#fullname').val();
        var organization = $('#organization').val();
        var role = $('#role').val();
        console.log(email);
        // console.log(password);
        Session.set('loginIn', true);
        Meteor.call('register.user', email, password, fullname, organization, role,
            (err, res) => {
                if (err) {
                    toastr.warning('Registration Failed: ' + err)
                    Session.set('loginIn', false);
                    // FlowRouter.redirect('/register');
                } else if (res) {
                    toastr.success('Registration Sucess');
                    Session.set('loginIn', false);

                }
            });
        Session.set('loginIn', false);
        FlowRouter.redirect('/login');
    },
    'change #role': function (e, template) {
        organizationType.set($('#role').val());
        console.log(organizationType);
        // template.$('select[name=organization]').val(orgType);
    }
});