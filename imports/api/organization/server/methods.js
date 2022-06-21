// Methods related to counseling

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Organization } from '../organization.js';


Meteor.methods({
  'organization.insert'(organizationCode, organizationName, organizationAddress, provinceKode, kabupatenKode, organizationStatus, organizationRemarks, organizationParent) {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    var oId = Organization.insert({
      organizationCode: organizationCode,
      organizationName: organizationName,
      organizationAddress: organizationAddress,
      provinceKode: provinceKode,
      kabupatenKode: kabupatenKode,
      organizationStatus: organizationStatus,
      organizationRemarks: organizationRemarks,
      organizationParent: organizationParent,
      createdAt: new Date(),
    });
    Organization.update({ '_id': organizationParent }, {
      $addToSet: {
        organizationChild: oId
      },
    });
  },
  'organization.delete'(id) {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    Organization.remove(id);
  },
  'organization.changeParent'(oId, org, pId) {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    Organization.update({ '_id': oId }, {
      $set: {
        organizationParent: org
      },
    });
    Organization.update({ '_id': pId }, {
      $pull: {
        organizationChild: oId
      },
    });
    Organization.update({ '_id': org }, {
      $addToSet: {
        organizationChild: oId
      },
    });
  },
  'organization.addUser'(newOId, uIdAdd, oldOId) {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    //Insert userId into Org
    Organization.update({ '_id': newOId }, {
      $addToSet: {
        userId: uIdAdd
      },
    });
    //Remove userId from old Org
    Organization.update({ '_id': oldOId }, {
      $pull: {
        userId: uIdAdd
      },
    });
    //Add organization Id to User Profile
    Meteor.users.update({ _id: uIdAdd }, {
      $set: {
        'profile.organizationId': newOId
      }
    });
  },
  'organization.edit'(oId, organizationCode, organizationName, organizationAddress, provinceKode, kabupatenKode, organizationStatus, organizationRemarks) {
    if (!this.userId) {
      throw new Meteor.Error(401, 'Unauthorized');
    }
    //Update Org
    Organization.update({ '_id': oId }, {
      $set: {
        organizationCode: organizationCode,
        organizationName: organizationName,
        organizationAddress: organizationAddress,
        provinceKode: provinceKode,
        kabupatenKode: kabupatenKode,
        organizationStatus: organizationStatus,
        organizationRemarks: organizationRemarks
      },
    });
  },
  'organization.parseUpload'(data) {
    var ownerId = Meteor.userId();
    check(data, Array);
    for (let i = 0; i < data.length; i++) {
      let item = data[i],
        exists = Organization.findOne({ _id: item._id });
      if (!exists) {
        var organizationCode = data[i].organizationCode;
        var organizationName = data[i].organizationName;
        var organizationType = data[i].organizationType;
        var organizationJenjang = data[i].organizationJenjang;
        var organizationStatus = 'active';
        var organizationRemarks = '';
        var organizationParentCode = data[i].organizationParent;
        var organizationSqm = data[i].organizationSqm;
        var organizationProvince = data[i].organizationProvince;
        var organizationCity = data[i].organizationCity;
        var organizationChild = [];
        var userId = [];


        var oId = Organization.insert({
          organizationCode, organizationName, organizationType, organizationJenjang, organizationStatus, organizationRemarks, organizationProvince, organizationCity, organizationSqm, organizationChild, userId,
          insertBy: ownerId, createdAt: new Date(),
        });
        //Create User
        var uId = Accounts.createUser({
          email: organizationCode + '@uii.ac.id',
          password: organizationCode + '~!a',
          profile: {
            'position': 'admin',
            'fullName': organizationName,
            "organizationId": oId,
            'status': 'active'
          }
        });
        Roles.addUsersToRoles(uId, 'admin');
        //Update Parent
        Organization.update({ '_id': oId }, {
          $addToSet: {
            userId: uId
          },
        });
        //Update Parent
        var parentId = Organization.findOne({ 'organizationCode': organizationParentCode });
        if (!parentId) {
          Organization.update({ _id: oId },
            {
              $set: {
                organizationParent: ''
              }
            })
        } else {
          var pId = parentId._id;
          Organization.update({ _id: oId },
            {
              $set: {
                organizationParent: pId
              }
            });
          Organization.update({ _id: pId },
            {
              $addToSet: {
                organizationChild: oId
              }
            });
        };
      } else {
        console.warn('Rejected. This item already exists.');
      }
    }
    //update child


  },
});
