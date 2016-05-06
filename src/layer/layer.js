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
   * @param {type} [layerId=null] - The identifier of the layer that should be retrieved
   * @param {type} [layerName=null] - The name or partial name of layers to be retrieved
   * @returns {jqXHR|!jQuery.jqXHR|Promise.<Object>}
   */
  mod.list = function(dataSetId,
      layerId,
      layerName) {

    var param = {};

    if (dataSetId !== undefined && dataSetId !== null) {
      param.iddataset = dataSetId;
    }

    if (layerId !== undefined && layerId !== null) {
      param.idlayer = layerId;
    }

    if (layerName !== undefined && layerName !== null) {
      param.layername = layerName;
    }

    return gsc.doPost('listlyr', param);

  };

  return mod;

}());
