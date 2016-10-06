'use strict';

gsc.dataset = (function() {
  /**
   * @exports gsc/dataset
   */
  var mod = {};

  /**
   * Delete a data source
   *
   * @param {Number} dataSetId - Id of dataset
   * @return {Promise} Response
   */
  mod.delete = function(dataSetId) {

    return gsc.doPost('deletedataset', {
      iddataset: dataSetId
    });

  };

  /**
   * List/search for data sets
   *
   * @param {Number} [dataSourceId] - Id of data source to retrieve data sets for
   * @param {Number} [dataSetId] - Id of data set to retrieve
   * @param {String} [dataSetName] - Name or part of data set name to search for
   * @param {Number} [organizationId] - Id of organization
   * @return {Promise} Data set response
   */
  mod.list = function(dataSourceId,
      dataSetId,
      dataSetName,
      organizationId) {

    var params = {};

    if (dataSourceId !== undefined) {
      params.iddatasource = dataSourceId;
    }

    if (dataSetId !== undefined) {
      params.iddataset = dataSetId;
    }

    if (dataSetName !== undefined) {
      params.datasetname = dataSetName;
    }

    if (organizationId !== undefined) {
      params.idorganization = organizationId;
    }

    return gsc.doPost('listdataset', params);

  };

  /**
   * Create a new data set
   *
   * @param {String} dataSetName - Name of data set
   * @param {String} realName - Real name, i.e. file name of data set
   * @param {Number} dataSourceId - Id of data source that data set is based on
   * @param {String} description - Description of data set
   * @param {Boolean} [toBeIngested=false] - To be ingested
   * @param {Number} [refreshInterval=-1] - Refresh interval in minutes
   * @param {String} [url=null] - URL
   * @return {Promise.<Object>} Data set response
   */
  mod.create = function(dataSetName,
      realName,
      dataSourceId,
      description,
      toBeIngested,
      refreshInterval,
      url
      ) {
    if (toBeIngested === undefined) {
      toBeIngested = false;
    }

    if (refreshInterval === undefined) {
      refreshInterval = -1;
    }

    if (url === undefined) {
      url = '';
    }

    var params = {
      datasetname: dataSetName,
      realname: realName,
      iddatasource: dataSourceId,
      description: description,
      tobeingested: toBeIngested,
      refreshinterval: refreshInterval,
      url: url
    };
    console.log('running once...');
    return gsc.doPost('createdataset', params);

  };

  /**
   * Update a data set
   *
   * @param {Number} dataSetId - Id of data set to update
   * @param {String} dataSetName - Name of data set
   * @param {String} realName - Real name of data set
   * @param {Number} dataSourceId - Data source the data set is based on
   * @param {String} description - Description of data set
   * @param {Boolean} [toBeIngested=false] - Flag indicating whether data set is to be ingested
   * @param {Number} [refreshInterval=-1] - Refresh interval in minutes
   * @param {String} [url=null] - URL
   * @return {Promise.<Object>} Update data set response
   */
  mod.update = function(
      dataSetId,
      dataSetName,
      realName,
      dataSourceId,
      description,
      toBeIngested,
      refreshInterval,
      url
      ) {

    if (toBeIngested === undefined) {
      toBeIngested = false;
    }

    if (refreshInterval === undefined) {
      refreshInterval = -1;
    }

    if (url === undefined) {
      url = '';
    }

    var params = {
      iddataset: dataSetId,
      datasetname: dataSetName,
      realname: realName,
      iddatasource: dataSourceId,
      description: description,
      tobeingested: toBeIngested,
      refreshinterval: refreshInterval,
      url: url
    };

    return gsc.doPost('updatedataset', params);

  };

  /**
   * List columns of data set
   *
   * @param {Number} dataSetId - Identifier of dataset
   * @return {Promise.<Object>} Data set response
   */
  mod.listCols = function(dataSetId) {
    return gsc.doPost('listcols', {
      iddataset: dataSetId
    });
  };

  /**
   * Update column metadata
   *
   * @param {Number} dataSetId - Identifier of data set to update column metadata for
   * @param {Object[]} columnList - List of column objects
   * @returns {Promise.<Object>}
   */
  mod.updateCols = function(dataSetId, columnList) {
    return gsc.doPost('updcolsmetadata', {
      iddataset: dataSetId,
      columns: columnList
    });
  };

  mod.createCron = function(dataSetId) {
    return gsc.doPost('createcron', {
    });
  };

  return mod;
}());
