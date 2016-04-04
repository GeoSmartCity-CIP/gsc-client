'use strict';

gsc.datasource = (function() {

  /**
   * @exports gsc/datasource
   */
  var mod = {};

  /**
   * Datasource type enumeration
   * @readonly
   * @enum {string}
   */
  mod.DatasourceType = {
    /**
     * Oracle database
     * @type {String}
     */
    ORACLE: 'Oracle',
    /**
     * ESRI Shapefile
     * @type {String}
     */
    SHAPE: 'ESRI Shapefile',
    /**
     * PostgreSQL+PostGIS database
     * @type {String}
     */
    POSTGIS: 'PostGIS'
  };

  /**
   * Datasource object
   *
   * @property {string} datasourcename - Indicates whether the Courage component is present.
   * @property {number} organization - Indicates whether the Power component is present.
   * @property {gsc.datasource.DatasourceType} type - Indicates whether the Wisdom component is present.
   * @property {string} description - A description of the data source
   * @property {string} updated - Time and date when the source was updated
   * @property {string} [url] - URL of remote datasource
   * @property {string} [username] - Username for database
   * @property {string} [password] - Password for database
   * @property {string} [ipaddress] - IP address of local database connection
   * @property {number} [port] - Port number of database connection
   * @property {string} [path] - Path to local datasource directory, name of database
   * @class
   */
  mod.Datasource = function() {

  };

  /**
   * Create datasource
   *
   * @param {String} datasourcename [description]
   * @param {String} organization [description]
   * @param {gsc.datasource.DatasourceType} type [description]
   * @param {String} description [description]
   * @param {String} updated [description]
   * @param {String} url [description]
   * @param {String} username [description]
   * @param {String} password [description]
   * @param {String} ipaddress [description]
   * @param {String} port [description]
   * @param {String} path [description]
   * @return {Promise.<gsc.datasource.DataSource>} [description]
   * @public
   */
  mod.create = function(datasourcename,
    organization,
    type,
    description,
    updated,
    url,
    username,
    password,
    ipaddress,
    port,
    path) {

    return gsc.doPost('createdatasrc', {
      datasourcename: datasourcename,
      organization: organization,
      type: type,
      description: description,
      updated: updated,
      url: url,
      username: username,
      password: password,
      ipaddress: ipaddress,
      port: port,
      path: path
    });

  };

  /**
   * List datasource
   *
   * @param {Number} datasourceId Identifier of datasource to be deleted
   * @param {Boolean} [includeDetail=false] Whether to include details
   * @return {Promise.<Object>} A list of datasource objects
   */
  mod.list = function(datasourceId, includeDetail) {
    if (includeDetail === undefined) {
      includeDetail = false;
    }
    return gsc.doPost('listdatasrc', {
      iddatasource: datasourceId,
      detail: includeDetail
    });
  };

  /**
   * Delete datasource
   *
   * @param {Number} datasourceId ID of datasource to be deleted
   * @return {Promise.<Object>}
   */
  mod.delete = function(datasourceId) {
    return gsc.doPost('deletedatasrc', {
      iddatasource: datasourceId
    });
  };

  /**
   * Update datasource
   *
   * @param {number} datasourceId [description]
   * @param {String} datasourcename [description]
   * @param {String} organization [description]
   * @param {gsc.datasource.DatasourceType} type [description]
   * @param {String} description [description]
   * @param {String} updated [description]
   * @param {String} url [description]
   * @param {String} username [description]
   * @param {String} password [description]
   * @param {String} ipaddress [description]
   * @param {String} port [description]
   * @param {String} path [description]
   * @return {Promise.<Response>} [description]
   */
  mod.update = function(datasourceId,
    datasourcename,
    organization,
    type,
    description,
    updated,
    url,
    username,
    password,
    ipaddress,
    port,
    path) {
    return gsc.doPost('updatedatasrc', {
      iddatasource: datasourceId,
      datasourcename: datasourcename,
      organization: organization,
      type: type,
      description: description,
      updated: updated,
      url: url,
      username: username,
      password: password,
      ipaddress: ipaddress,
      port: port,
      path: path
    });
  };

  /**
   * List data source origin?
   *
   * @param {number} datasourceId The id of the data source to list origin for
   * @return {Promise.<Response>} A response object
   */
  mod.listDataOrigin = function(datasourceId) {

    return gsc.doPost('listdataorigin', {
      iddatasource: datasourceId
    });

  };

  return mod;

}());
