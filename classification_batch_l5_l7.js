/* 
======================================

### Classification Batch L5 and L7  ###
Origin Collection: 5

# Notes
- Remember to Change asset path in ExportImage function (assetID)
- Remember to rename the file when exporting in the task tab
=======================================
*/
var samples_urban = ee.FeatureCollection("projects/mapbiomas-workspace/AMOSTRAS/INFRAURBANA_COL4/samples_urban_carta/samples_urban_2018"),
    cartas_col = ee.FeatureCollection("projects/mapbiomas-workspace/AUXILIAR/cartas"),
    cartas_hex_col = ee.FeatureCollection("projects/mapbiomas-workspace/TRANSVERSAIS/INFRAURBANA5/cartas_hex_col"),
    br = 
    /* color: #98ff00 */
    /* shown: false */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon(
        [[[-75.59290241852334, 6.116530180285959],
          [-75.59290241852334, -36.47606779670446],
          [-32.526496168523344, -36.47606779670446],
          [-32.526496168523344, 6.116530180285959]]], null, false);

var class_lib = require("users/breno_malheiros/terras:classification_lib.js");
var index_lib = require("users/breno_malheiros/terras:index_lib.js");
var indexes = require("users/breno_malheiros/terras:indexes.js");
var year = 1985;
var getCollection = require("users/breno_malheiros/terras:collection.js");
var samples_noturban = ee.FeatureCollection("projects/mapbiomas-workspace/AMOSTRAS/INFRAURBANA_COL4/samples_noturban_carta/samples_noturban_" + String(year));

var rename = require("users/breno_malheiros/terras:rename_bands.js");

//CLOUD MASK 
var cloudMaskL57 = function(image) {
    var qa = image.select("pixel_qa");
    var atmos = image.select("sr_atmos_opacity");
    
    // If the cloud bit (5) is set and the cloud confidence (7) is high
    // or the cloud shadow bit is set (3), then it's a bad pixel.
    var cloud = qa.bitwiseAnd(1 << 5)
            .and(qa.bitwiseAnd(1 << 7))
            .or(qa.bitwiseAnd(1 << 3));
            
   // Remove edge pixels that don't occur in all bands 
    var mask2 = image.mask().reduce(ee.Reducer.min());
    var mask3 = qa.bitwiseAnd(1 << 5);
    var mask4 = atmos.gt(200);
    
    return image.updateMask(cloud.not()).updateMask(mask2).updateMask(mask3.not()).updateMask(mask4.not());
  
  };
  
var bandsl5 = rename.rename("l5_7");
var bandsl7 = rename.rename("l5_7");

var bandsRF = ["blue", "bu", "evi", "green", "mndwi", "ndbi", "ndvi", "nir", "red", 
            "swir1", "swir2", "ui","gv", "npv", "soil","cloud","shade","gvs"];

// International Map of the World -IMW
// The grids commented below have some kind of error (eg Error: Image.select: Pattern 'blue' did not match any bands.)
// when executed together with the other grids
var listGrid_1 = ["NA-20-X-A",
"NA-20-X-B",
"NA-20-X-D",
"NA-20-Z-B",
"NA-20-Z-D",
"NA-21-V-A",
"NA-21-Y-C",
//"NA-22-V-B",
"NA-22-X-C",
"NA-22-Y-D",
"NA-22-Z-A",
"NA-22-Z-C",
"NB-20-Z-D",
//"SA-19-X-B",
"SA-19-X-D",
"SA-19-Z-A",
"SA-19-Z-B",
"SA-19-Z-C",
"SA-19-Z-D",
"SA-20-V-A",
"SA-20-V-C",
"SA-20-X-A",
"SA-20-X-B",
"SA-20-X-C",
"SA-20-X-D",
"SA-20-Y-A",
//"SA-20-Y-C",
"SA-20-Y-D",
"SA-20-Z-B",
"SA-20-Z-C",
"SA-20-Z-D",
"SA-21-V-A",
"SA-21-V-C",
"SA-21-X-C",
"SA-21-X-D",
"SA-21-Y-A",
"SA-21-Y-B",
"SA-21-Y-C",
"SA-21-Y-D",
"SA-21-Z-A",
"SA-21-Z-B",
//"SA-21-Z-C",
"SA-21-Z-D",
"SA-22-V-A",
"SA-22-V-B",
"SA-22-V-C",
"SA-22-V-D",
"SA-22-X-A",
"SA-22-X-B",
"SA-22-X-C",
"SA-22-X-D",
"SA-22-Y-A",
//"SA-22-Y-B",
"SA-22-Y-C",
//"SA-22-Y-D",
"SA-22-Z-A",
"SA-22-Z-B",
"SA-22-Z-C",
"SA-22-Z-D",
"SA-23-V-A",
"SA-23-V-C",
"SA-23-V-D",
"SA-23-X-C",
"SA-23-Y-A",
"SA-23-Y-B",
"SA-23-Y-C",
"SA-23-Y-D",
"SA-23-Z-A",
"SA-23-Z-B",
"SA-23-Z-C",
"SA-23-Z-D",
"SA-24-Y-A",
"SA-24-Y-B",
"SA-24-Y-C",
"SA-24-Y-D",
"SA-24-Z-C",
"SB-18-Z-D",
"SB-19-V-A",
"SB-19-V-B"]

var listGrid_2 = ["SB-19-X-B",
"SB-19-Y-B",
//"SB-19-Y-C",
"SB-19-Y-D",
"SB-19-Z-A",
"SB-19-Z-D",
"SB-20-V-A",
"SB-20-V-B",
"SB-20-V-D",
"SB-20-X-D",
"SB-20-Y-B",
"SB-20-Y-C",
"SB-20-Y-D",
"SB-20-Z-C",
"SB-21-V-A",
"SB-21-X-A",
//"SB-21-X-B",
"SB-21-X-C",
"SB-21-Y-B",
"SB-21-Y-C",
"SB-21-Z-A",
"SB-21-Z-D",
//"SB-22-V-D",
//"SB-22-X-A",
"SB-22-X-B",
"SB-22-X-C",
"SB-22-X-D",
"SB-22-Y-B",
"SB-22-Z-A",
"SB-22-Z-B",
"SB-22-Z-C",
"SB-22-Z-D",
"SB-23-V-A",
"SB-23-V-B",
"SB-23-V-C",
"SB-23-V-D",
"SB-23-X-A",
"SB-23-X-B",
"SB-23-X-C",
"SB-23-X-D",
"SB-23-Y-A",
"SB-23-Y-B",
"SB-23-Y-C",
"SB-23-Y-D",
"SB-23-Z-A",
"SB-23-Z-B",
"SB-23-Z-C",
"SB-23-Z-D",
"SB-24-V-A",
"SB-24-V-B",
"SB-24-V-C",
"SB-24-V-D",
"SB-24-X-A",
"SB-24-X-B",
"SB-24-X-C",
"SB-24-X-D",
"SB-24-Y-A",
"SB-24-Y-B",
"SB-24-Y-C",
"SB-24-Y-D",
"SB-24-Z-A",
"SB-24-Z-B",
"SB-24-Z-C",
"SB-24-Z-D",
"SB-25-V-C",
"SB-25-Y-A",
"SB-25-Y-C",
//"SC-18-X-B",
"SC-19-V-A",
"SC-19-V-B",
"SC-19-V-C",
"SC-19-V-D",
"SC-19-X-B",
"SC-19-X-C",
"SC-19-X-D",
"SC-19-Y-B",
"SC-19-Z-A",
"SC-19-Z-B"]

var listGrid_3 = ["SC-19-Z-C",
"SC-20-V-B",
"SC-20-V-C",
"SC-20-V-D",
"SC-20-X-A",
"SC-20-X-C",
"SC-20-X-D",
"SC-20-Y-A",
"SC-20-Y-B",
"SC-20-Y-C",
"SC-20-Y-D",
"SC-20-Z-A",
"SC-20-Z-B",
"SC-20-Z-C",
"SC-20-Z-D",
"SC-21-V-C",
"SC-21-V-D",
"SC-21-X-B",
"SC-21-X-C",
"SC-21-X-D",
"SC-21-Y-A",
"SC-21-Y-B",
"SC-21-Y-C",
"SC-21-Y-D",
"SC-21-Z-A",
"SC-21-Z-B",
"SC-21-Z-C",
"SC-21-Z-D",
"SC-22-V-D",
"SC-22-X-A",
"SC-22-X-B",
"SC-22-X-C",
"SC-22-X-D",
"SC-22-Y-A",
"SC-22-Y-B",
"SC-22-Y-C",
"SC-22-Y-D",
"SC-22-Z-A",
"SC-22-Z-B",
"SC-22-Z-C",
"SC-22-Z-D",
"SC-23-V-A",
"SC-23-V-B",
"SC-23-V-C",
"SC-23-V-D",
"SC-23-X-A",
"SC-23-X-B",
"SC-23-X-C",
"SC-23-X-D",
"SC-23-Y-A",
"SC-23-Y-B",
"SC-23-Y-C",
"SC-23-Y-D",
"SC-23-Z-A",
"SC-23-Z-B",
"SC-23-Z-C",
"SC-23-Z-D",
"SC-24-V-A",
"SC-24-V-B",
"SC-24-V-C",
"SC-24-V-D",
"SC-24-X-A",
"SC-24-X-B",
"SC-24-X-C",
"SC-24-X-D",
"SC-24-Y-A",
"SC-24-Y-B",
"SC-24-Y-C",
"SC-24-Y-D",
"SC-24-Z-A",
"SC-24-Z-B",
"SC-24-Z-C",
"SC-24-Z-D",
"SC-25-V-A",
"SC-25-V-C",
"SD-20-V-B",
"SD-20-X-A",
"SD-20-X-B",
"SD-20-X-D",
"SD-21-V-B",
"SD-21-V-C",
"SD-21-V-D",
"SD-21-X-A",
"SD-21-X-B",
"SD-21-X-C",
"SD-21-X-D",
"SD-21-Y-A",
"SD-21-Y-B",
"SD-21-Y-C",
"SD-21-Y-D",
"SD-21-Z-A",
"SD-21-Z-B",
"SD-21-Z-C",
"SD-21-Z-D",
"SD-22-V-B",
"SD-22-V-C",
"SD-22-V-D",
"SD-22-X-A"]

var listGrid_4 = ["SD-22-X-B",
"SD-22-X-C",
"SD-22-X-D",
"SD-22-Y-A",
"SD-22-Y-B",
"SD-22-Y-C",
"SD-22-Y-D",
"SD-22-Z-A",
"SD-22-Z-B",
"SD-22-Z-C",
"SD-22-Z-D",
"SD-23-V-A",
"SD-23-V-B",
"SD-23-V-C",
"SD-23-V-D",
"SD-23-X-A",
"SD-23-X-B",
"SD-23-X-C",
"SD-23-X-D",
"SD-23-Y-A",
"SD-23-Y-B",
"SD-23-Y-C",
"SD-23-Y-D",
"SD-23-Z-A",
"SD-23-Z-B",
"SD-23-Z-C",
"SD-23-Z-D",
"SD-24-V-A",
"SD-24-V-B",
"SD-24-V-C",
"SD-24-V-D",
"SD-24-X-A",
"SD-24-X-C",
"SD-24-Y-A",
"SD-24-Y-B",
"SD-24-Y-C",
"SD-24-Y-D",
"SD-24-Z-A",
"SD-24-Z-C",
"SE-21-V-A",
"SE-21-V-B",
"SE-21-X-A",
"SE-21-X-B",
"SE-21-X-D",
"SE-21-Y-B",
"SE-21-Y-D",
"SE-21-Z-B",
"SE-21-Z-D",
"SE-22-V-A",
"SE-22-V-B",
"SE-22-V-C",
"SE-22-V-D",
"SE-22-X-A",
"SE-22-X-B",
"SE-22-X-C",
"SE-22-X-D",
"SE-22-Y-A",
"SE-22-Y-B",
"SE-22-Y-C",
"SE-22-Y-D",
"SE-22-Z-A",
"SE-22-Z-B",
"SE-22-Z-C",
"SE-22-Z-D",
"SE-23-V-A",
"SE-23-V-B"
]

var listGrid_5 = ["SE-23-V-C",
"SE-23-V-D",
"SE-23-X-A",
"SE-23-X-B",
"SE-23-X-C",
"SE-23-X-D",
"SE-23-Y-A",
"SE-23-Y-B",
"SE-23-Y-C",
"SE-23-Y-D",
"SE-23-Z-A",
"SE-23-Z-B",
"SE-23-Z-C",
"SE-23-Z-D",
"SE-24-V-A",
"SE-24-V-B",
"SE-24-V-C",
"SE-24-V-D",
"SE-24-X-A",
"SE-24-Y-A",
"SE-24-Y-B",
"SE-24-Y-C",
"SE-24-Y-D",
"SF-21-V-B",
"SF-21-V-D",
"SF-21-X-A",
"SF-21-X-B",
"SF-21-X-C",
"SF-21-X-D",
"SF-21-Y-B",
"SF-21-Z-A",
"SF-21-Z-B",
"SF-21-Z-C",
"SF-21-Z-D",
"SF-22-V-A",
"SF-22-V-B",
"SF-22-V-C",
"SF-22-V-D",
"SF-22-X-A",
"SF-22-X-B",
"SF-22-X-C",
"SF-22-X-D",
"SF-22-Y-A",
"SF-22-Y-B",
"SF-22-Y-C",
"SF-22-Y-D",
"SF-22-Z-A",
"SF-22-Z-B",
"SF-22-Z-C",
"SF-22-Z-D",
"SF-23-V-A",
"SF-23-V-B",
"SF-23-V-C",
"SF-23-V-D",
"SF-23-X-A",
"SF-23-X-B",
"SF-23-X-C",
"SF-23-X-D",
"SF-23-Y-A",
"SF-23-Y-B",
"SF-23-Y-C",
"SF-23-Y-D",
"SF-23-Z-A",
"SF-23-Z-B",
"SF-23-Z-C",
"SF-23-Z-D",
"SF-24-V-A",
"SF-24-V-B",
"SF-24-V-C",
"SF-24-Y-A",
"SG-21-X-B",
"SG-21-X-D",
"SG-21-Z-D",
"SG-22-V-A",
"SG-22-V-B",
"SG-22-V-C",
"SG-22-V-D",
"SG-22-X-A",
"SG-22-X-B",
"SG-22-X-C",
"SG-22-X-D",
"SG-22-Y-A",
"SG-22-Y-B",
"SG-22-Y-C",
"SG-22-Y-D",
"SG-22-Z-A",
"SG-22-Z-B",
"SG-22-Z-C",
"SG-22-Z-D",
"SG-23-V-A",
"SG-23-V-B",
"SG-23-V-C",
"SH-21-V-D",
"SH-21-X-A",
"SH-21-X-B",
"SH-21-X-C",
"SH-21-X-D",
"SH-21-Y-B",
"SH-21-Z-A",
"SH-21-Z-B",
"SH-21-Z-D",
"SH-22-V-A",
"SH-22-V-B",
"SH-22-V-C",
"SH-22-V-D",
"SH-22-X-A",
"SH-22-X-B",
"SH-22-X-C",
"SH-22-X-D",
"SH-22-Y-A",
"SH-22-Y-B",
"SH-22-Y-C",
"SH-22-Y-D",
"SH-22-Z-A",
"SH-22-Z-C",
"SI-22-V-A",
"SI-22-V-B",
"SI-22-V-C"
]

// List of grids that will be exported, running a gridlist takes around 8 hours
var ExportGrid = [listGrid_1] 


// ADD INDEXES  
// The codes for these indexes are being called from index_lib.js
var landsatAddIndex = function(landsat){
    landsat = landsat.addBands(index_lib.getNDVI(landsat));
    landsat = landsat.addBands(index_lib.getMNDWI(landsat));
    landsat = landsat.addBands(index_lib.getEVI(landsat));
    landsat = landsat.addBands(index_lib.getNDBI(landsat));
    landsat = landsat.addBands(index_lib.getBU(landsat));
    landsat = landsat.addBands(index_lib.getUI(landsat));

    return landsat;

};


var image_list = ee.List([])

//Loop around the list of listsGrids to be exported
ExportGrid.map(function(listGrid){

  
  //Process the Grids contained in each listGrid to be exported
  listGrid.forEach(function(grid){
    
    var carta = ee.Feature(cartas_col.filterMetadata("grid_name", "equals", grid).first());
    var carta_hex = ee.Feature(cartas_hex_col.filterMetadata("grid_name", "equals", grid)
                                .first()).buffer(100);
    
    //Separation of non-urban samples
    var samples_noturban_grid = samples_noturban.filterBounds(carta.geometry()
                                        .buffer(500));
    var geometry_noturban_grid = samples_noturban_grid.map(function(feature){
            var randomc = feature.get("randomc");
            var value =  feature.get("value");
            var block_id = feature.get("block_id");
            var hex_id = feature.get("hex_id");
            var npoints = feature.get("npoints");
            
            return ee.Feature(feature.geometry()).set({
              "randomc":randomc,
              "value":value,
              "block_id":block_id,
              "hex_id":hex_id,
              "npoints":npoints
            });
          });
    
    //Separation of urban samples    
    var samples_urban_grid = samples_urban.filterBounds(carta.geometry().buffer(500));
    var geometry_samples_urban_grid = samples_urban_grid.map(function(feature){
        var randomc = feature.get("randomc");
        var value =  feature.get("value");
        var block_id = feature.get("block_id");
        var hex_id = feature.get("hex_id");
        var npoints = feature.get("npoints");
        
        return ee.Feature(feature.geometry()).set({
          "randomc":randomc,
          "value":value,
          "block_id":block_id,
          "hex_id":hex_id,
          "npoints":npoints
        });
      });
      
      
    var objCollection_5 = {
    "collectionid":"LANDSAT/LT05/C01/T1_SR", 
    //"LANDSAT/LC08/C01/T1_SR",
    "geometry": carta_hex.geometry(),
    "dateStart": String(year) + "-01-01",
    "dateEnd": String(year + 1) + "-01-01",
    "cloud_cover": 60,
    };
    
    var objCollection_7 = {
    "collectionid":"LANDSAT/LE07/C01/T1_SR", 
    //"LANDSAT/LC08/C01/T1_SR",
    "geometry": carta_hex.geometry(),
    "dateStart": String(year) + "-01-01",
    "dateEnd": String(year + 1) + "-01-01",
    "cloud_cover": 60,
    };

    //Imports the landsat images into memory,
    // rename bands, adjust their properties and crop images using urban hexagons 
    var collection_5 = getCollection.getCollection(objCollection_5)
                      .select(bandsl5.bandNames, bandsl5.newNames)
                      .map(function(image){
                        return image.clip(carta_hex.geometry());
                        });
                        
    var collection_7 = getCollection.getCollection(objCollection_7)
                      .select(bandsl7.bandNames, bandsl7.newNames)
                      .map(function(image){
                          return image.clip(carta_hex.geometry());
                        });

    //print("collection_5",collection_5.size());
    //print("collection_7",collection_7.size());
    
    //Filter clouds and create the median landsat mosaic
    var colmask = collection_7.merge(collection_5).map(cloudMaskL57);
    var mosaic = ee.Image(colmask.median());
    var mosaicNDFI = ee.Image(indexes.getSMA(mosaic));
   
    mosaicNDFI =  ee.Image(indexes.getNDFI(mosaicNDFI));
    mosaicNDFI =  ee.Image(landsatAddIndex(mosaicNDFI));
    
    //Apply the classification process imported from classification_lib.js
    var new_samples_noturban_grid = class_lib.getFeatureSpace(mosaicNDFI.select(bandsRF),
                                                geometry_noturban_grid,bandsRF);
    var new_samples_urban_grid = class_lib.getFeatureSpace(mosaicNDFI.select(bandsRF),
                                geometry_samples_urban_grid,bandsRF);
    var samples = new_samples_urban_grid.merge(new_samples_noturban_grid)
                                    .sort("randomc")
    var classified = class_lib.classifyLandsat(mosaicNDFI.select(bandsRF), samples, bandsRF)
                                .set("grid", grid).set("year", year);
    
    //print(grid,classified) // This print is used to identify Grids that can generate errors
    
    //Each classified Grid is added to the classified image list                            
    image_list = image_list.add(classified)  
  })
});

//After all Grids are sorted, the list will be converted into a single mosaic
var ImageCol = ee.ImageCollection(image_list)
var mosaic_col = ImageCol.mosaic()

//Export mosaic as asset
Export.image.toAsset({
      "image": mosaic_col,
      "description":"INFRAURBANA6-PROB-" + year,  //Remember to rename the file when exporting in the task tab
      "assetId":"INFRAURBANA6-PROB-" + year ,     //Remember to rename the file when exporting in the task tab
      "region": br,
      "scale": 30,
      "maxPixels": 1e13,      
  });


