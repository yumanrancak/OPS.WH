import './dash_validation.html';
import { ReactiveMethod } from 'meteor/simple:reactive-method';
import { Meteor } from 'meteor/meteor';

Template.dash_validation.helpers({
    
    validation: function () {
        return ReactiveMethod.call('validation.all');
      },
});
    