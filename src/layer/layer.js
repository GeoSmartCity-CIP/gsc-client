'use strict';

gsc.layer = (function() {

  /**
   * @exports gsc/layer
   */
  var mod = {};

  /**
   * Create a new layer
   *
   * @param {String} layerName - The name of the layer
   * @param {Number} dataSetId - The identifier of the data set the layer is based on
   * @param {String} description - A description of the layer
   * @param {String} metadataFile - Metadata XML
   * @param {String} sld - SLD XML
   * @returns {Promise.<Object>}
   */
  mod.create = function(layerName,
      dataSetId,
      description,
      metadataFile,
      sld) {

    return gsc.doPost('createlyr', {
      layername: layerName,
      iddataset: dataSetId,
      description: description,
      metadatafile: metadataFile,
      sld: sld
    });

  };

  /**
   * Update a layer new layer
   *
   * @param {type} layerId - The identifier of the layer to update
   * @param {String} layerName - The name of the layer
   * @param {Number} dataSetId - The identifier of the data set the layer is based on
   * @param {String} description - A description of the layer
   * @param {String} metadataFile - Metadata XML
   * @param {String} sld - SLD XML
   * @returns {Promise.<Object>}
   */
  mod.update = function(layerId,
      layerName,
      dataSetId,
      description,
      metadataFile,
      sld) {

    return gsc.doPost('updatelyr', {
      idlayer: layerId,
      layername: layerName,
      iddataset: dataSetId,
      description: description,
      metadatafile: metadataFile,
      sld: sld
    });

  };

  /**
   * Delete a layer
   *
   * @param {Number} layerId - The identifier of the layer to delete
   * @returns {Promise.<Object>}
   */
  mod.delete = function(layerId) {
    return gsc.doPost('deletelyr', {
      idlayer: layerId
    });
  };

  /**
   * Search for layers
   *
   * @param {Number} [dataSetId=null] - The identifier of the data set for which layers should be retrieved
   * @param {Number} [layerId=null] - The identifier of the layer that should be retrieved
   * @param {String} [layerName=null] - The name or partial name of layers to be retrieved
   * @param {Number} [organizationId=null] - The numeric identifier of an organization
   * @returns {Promise.<Object>}
   */
  mod.list = function(dataSetId,
      layerId,
      layerName,
      organizationId) {

    var param = {};

    if (!gsc.util.isNull(dataSetId)) {
      param.iddataset = dataSetId;
    }

    if (!gsc.util.isNull(layerId)) {
      param.idlayer = layerId;
    }

    if (!gsc.util.isNull(layerName)) {
      param.layername = layerName;
    }

    if (!gsc.util.isNull(organizationId)) {
      param.idorganization = organizationId;
    }

    return gsc.doPost('listlyr', param);

  };

  return mod;

}());
