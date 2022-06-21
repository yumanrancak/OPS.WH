// All messages-related publications

import { Meteor } from 'meteor/meteor';
import { Organization } from '../organization.js';
import { publishPagination } from 'meteor/kurounin:pagination';

publishPagination(Organization);
publishPagination(Meteor.users);

Meteor.publish('organization.all', function () {
    if (this.userId) {
        return Organization.find({});
    }
    return [];
});