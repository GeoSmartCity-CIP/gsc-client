/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global gsc */

'use strict';

gsc.grouplayer = (function() {

  /**
   *
   * @exports gsc/grouplayer
   */
  var mod = {};

  /**
   * Create a new instance of a gsc.grouplayer.Layer specification object
   *
   * @property {Number} idlayer - Numeric identifier of layer
   * @class Layer
   * @constructor
   * @param {Number} layerId - Numeric identifier of layer
   */
  mod.Layer = function(layerId) {
    var self = this;
    self.idlayer = layerId;
  };

  /**
   * Delete a group layer
   *
   * @param {Number} groupId - Numeric identifier of a group
   * @returns {Promise.<Object>}
   */
  mod.delete = function(groupId) {
    return gsc.doPost('deletegrp', {
      idgroup: groupId
    });
  };

  /**
   * Create a new group layer
   *
   * @param {String} groupName
   * @param {Number} organizationId
   * @param {String} description
   * @returns {Promise.<Object>}
   */
  mod.create = function(groupName,
      organizationId,
      description) {

    return gsc.doPost('creategrp', {
      groupname: groupName,
      organization: organizationId,
      description: description
    });
  };

  /**
   * Assign layers to a group
   *
   * @param {Number} groupId - Numeric identifier of group
   * @param {gsc.grouplayer.Layer[]} layers - An array of gsc.grouplayer.Layer objects
   * @returns {Promise.<Object>}
   */
  mod.assignLayers = function(groupId,
      layers) {
    return gsc.doPost('assignlyr', {
      idgroup: groupId,
      layers: layers
    });
  };

  /**
   * Retrieve a list of group layers based on a set of criteria.
   * At least one of the parameters are required although each individually is optional
   *
   * @param {Number} [organizationId=null] - Numeric identifier of organization
   * @param {String} [groupName=null] - Name or part of name of group
   * @param {Number} [groupId=null] - Numeric identifier of group
   * @returns {Promise.<Object>}
   */
  mod.list = function(organizationId,
      groupName,
      groupId) {

    var params = {};

    if (!gsc.util.isNull(organizationId)) {
      params.organization = organizationId;
    }

    if (!gsc.util.isNull(groupName)) {
      params.groupname = groupName;
    }

    if (!gsc.util.isNull(groupId)) {
      params.idgroup = groupId;
    }

    return gsc.doPost('listgrp', params);

  };

  return mod;
}());
