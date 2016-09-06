// jscs:disable disallowTrailingWhitespace
'use strict';

gsc.editFeatures = (function() {
  /**
   * @exports gsc/editFeatures
   */
  var mod = {};

  /** @type divObject */
  mod.container = null;

  /** @type divObject */
  mod.content = null;

  /** @type aObject */
  mod.closer = null;

  /** Class of edit buttons */
  mod.buttonClass = null;

  /** @type ol.format.WFS */
  mod.formatWFS = null;

  /** @type ol.format.GML */
  mod.formatGML = null;

  /** @type ol.Layer */
  mod.layer = null;

  /** @type ol.Map */
  mod.olMap = null;

  /** Adress of WFS-T */
  mod.wfs = null;

  mod.selectedFeature = null;

  var attTitle = [];

  mod.editingFeature = {};

  mod.interaction = null;

  mod.popupContent = null;

  mod.overlay = null;

  mod.interactionSingleSelect = new ol.interaction.Select({
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#FF2828'
      })
    }),
    toggleCondition: ol.events.condition.never
  });

  mod.interactionMultipleSelect = new ol.interaction.Select({
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#FF2828'
      })
    })
  });

  mod.interactionSnap = null;

  mod.create = function(divContainer, divContent, aCloser,
                        classButton, mapObject, wfs) {

    mod.container = divContainer;

    mod.content = divContent;

    mod.closer = aCloser;

    mod.buttonClass = classButton;

    mod.formatWFS = new ol.format.WFS();

    mod.olMap = mapObject;

    mod.wfs = wfs;

    /**
     * Create an overlay to anchor the popup to the map.
     */
    mod.overlay = new ol.Overlay(/** @type {olx.OverlayOptions} */ ({
      element: mod.container.get(0),
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    }));

    mod.olMap.addOverlay(mod.overlay);

    /**
     * Create an interaction to let select features at map by moving pointer.
     */
    mod.interactionMultipleSelectPointerMove = new ol.interaction.Select({
      condition: ol.events.condition.pointerMove
    });

    mod.olMap.addInteraction(mod.interactionMultipleSelectPointerMove);

    /**
     * Add a click handler to hide the popup.
     *
     * @return {boolean} Don't follow the href.
     */
    mod.closer.click(function() {
      mod.overlay.setPosition(undefined);
      mod.closer.blur();
      return false;
    });
  };

  mod.addLayer = function(layer, gml) {
    mod.removeLayer();
    mod.layer = layer;
    mod.changeSnapLayer();
    mod.formatGML = gml;
  };

  mod.removeLayer = function() {
    mod.layer = null;
    mod.formatGML = null;
  };

  mod.changeSnapLayer = function() {
    mod.interactionSnap = new ol.interaction.Snap({
      pixelTolerance: 5,
      source: mod.layer.getSource()
    });
  };

  mod.transactWFS = function(mode, f) {
    var node;
    switch (mode) {
      case 'insert':
        node = mod.formatWFS.writeTransaction([f], null, null, mod.formatGML);
        break;
      case 'update':
        var sF = f.clone();
        sF.getGeometry().applyTransform(function(crd, crd2, std) {
          for (var i = 0; i < crd.length; i += std) {
            var y = crd[i];
            var x = crd[i + 1];
            crd[i] = x;
            crd[i + 1] = y;
          }
        });
        sF.setId(f.getId());
        node = mod.formatWFS.writeTransaction(null, [sF], null, mod.formatGML);
        break;
      case 'delete':
        node = mod.formatWFS.writeTransaction(null, null, [f], mod.formatGML);
        break;
    }
    var xs = new XMLSerializer();
    var payload = xs.serializeToString(node);
    $.ajax(mod.wfs, {
      type: 'POST',
      dataType: 'xml',
      processData: false,
      contentType: 'text/xml',
      data: payload
    }).done(function() {
      mod.layer.getSource().clear();
    });
  };

  $('button').click(function() {
    mod.olMap.removeInteraction(mod.interaction);
    mod.interactionMultipleSelect.getFeatures().clear();
    mod.interactionSingleSelect.getFeatures().clear();
    mod.olMap.removeInteraction(mod.interactionMultipleSelect);
    mod.olMap.removeInteraction(mod.interactionSingleSelect);

    switch ($(this).attr('id')) {

      case 'btnEdit':
        mod.olMap.addInteraction(mod.interactionMultipleSelect);
        mod.interaction = new ol.interaction.Modify({
          features: mod.interactionMultipleSelect.getFeatures()
        });
        mod.olMap.addInteraction(mod.interaction);
        mod.olMap.addInteraction(mod.interactionSnap);
        mod.editingFeature = {};
        mod.interactionMultipleSelect.getFeatures().on('add', function(e) {
          e.element.on('change', function(e) {
            mod.editingFeature[e.target.getId()] = true;
          });
        });
        mod.interactionMultipleSelect.getFeatures().on('remove', function(e) {
          var f = e.element;
          if (mod.editingFeature[f.getId()]) {
            delete mod.editingFeature[f.getId()];
            var featureProperties = f.getProperties();
            delete featureProperties.boundedBy;
            var clone = new ol.Feature(featureProperties);
            clone.setId(f.getId());
            mod.transactWFS('update', clone);
          }
        });
        break;

      case 'btnEditAttributes':
        mod.olMap.addInteraction(mod.interactionSingleSelect);
        mod.interactionSingleSelect.on('select', function(evt) {
          if (evt.selected.length == 1) {
            mod.selectedFeature = evt.selected[0];
            mod.popupContent = '';
            attTitle = [];
            mod.popupContent = '<table id="feature" ' +
                'class="table table-bordered table-hover" ' +
                'style="clear: both"><tbody>';
            Object.getOwnPropertyNames(mod.selectedFeature.getProperties()).
            forEach(function(val, idx, array) {
              if (val != 'bbox' && val != 'geometry') {
                var i = 0;
                attTitle.push(val);
                mod.popupContent += '<tr>' +
                    '<td width="35%">' + val + '</td>' +
                    '<td width="65%">' +
                    '<a href="#" id="' + val + '" class="edit' + i + '" ' +
                    'data-type="text">' + mod.selectedFeature.
                    getProperties()[val] +
                    '</a>' +
                    '</td>' +
                    '</tr>';
                i++;
              }
            });
            mod.popupContent += '</tbody></table><script>';
            mod.popupContent += '$.fn.editable.defaults.mode = "inline";';
            mod.popupContent += '$(document).ready(function() {';
            attTitle.forEach(function(val, idx, array) {
              mod.popupContent += '	$(".edit' + idx + '").editable({';
              mod.popupContent += 'type: "text",';
              mod.popupContent += 'title: "' + attTitle[idx] + '",';
              mod.popupContent += 'success: function(response, newValue) {';
              mod.popupContent += 'gsc.editFeatures.selectedFeature.set("' +
                  attTitle[idx] + '", newValue, false);';
              mod.popupContent += 'gsc.editFeatures.transactWFS("update", ' +
                  'gsc.editFeatures.selectedFeature);';
              mod.popupContent += '}';
              mod.popupContent += '})';
            });
            mod.popupContent += '});</script>';
            mod.content.html(mod.popupContent);
            var popupCoordinates = mod.selectedFeature.getGeometry().
            getClosestPoint(evt.mapBrowserEvent.coordinate);
            mod.overlay.setPosition(popupCoordinates);
          }
        });
        break;

      case 'btnPoint':
        mod.interaction = new ol.interaction.Draw({
          type: 'Point',
          source: mod.layer.getSource()
        });
        mod.olMap.addInteraction(mod.interaction);
        mod.olMap.addInteraction(mod.interactionSnap);
        mod.interaction.on('drawend', function(e) {
          mod.transactWFS('insert', e.feature);
        });
        break;

      case 'btnLine':
        mod.interaction = new ol.interaction.Draw({
          type: 'LineString',
          source: mod.layer.getSource()
        });
        mod.olMap.addInteraction(mod.interaction);
        mod.olMap.addInteraction(mod.interactionSnap);
        mod.interaction.on('drawend', function(e) {
          mod.transactWFS('insert', e.feature);
        });
        break;

      case 'btnArea':
        mod.interaction = new ol.interaction.Draw({
          type: 'Polygon',
          source: mod.layer.getSource()
        });
        mod.interaction.on('drawend', function(e) {
          mod.transactWFS('insert', e.feature);
        });
        mod.olMap.addInteraction(mod.interaction);
        mod.olMap.addInteraction(mod.interactionSnap);
        break;

      case 'btnDelete':
        mod.interaction = new ol.interaction.Select();
        mod.interaction.getFeatures().on('add', function(e) {
          mod.transactWFS('delete', e.target.item(0));
          mod.interactionMultipleSelectPointerMove.getFeatures().clear();
          mod.interaction.getFeatures().clear();
        });
        mod.olMap.addInteraction(mod.interaction);
        mod.olMap.addInteraction(mod.interactionSnap);
        break;

      default:
        break;
    }
  });
  return mod;
}());
