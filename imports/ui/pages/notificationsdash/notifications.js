import './notifications.html';
import { Meteor } from 'meteor/meteor';
import { Notification } from '../../../api/notification/notification';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { ReactiveMethod } from 'meteor/simple:reactive-method';


Tracker.autorun(() => {

    // Meteor.subscribe('notification');       
});

Template.not.helpers({
    Storebyid() {
        return ReactiveMethod.call('showNotif.all');
    },
});
