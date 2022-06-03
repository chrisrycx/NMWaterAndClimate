/*
Code copied from HydroViewer
*/

const sourceURL = 'https://raw.githubusercontent.com/NMWDI/VocabService/main/pvacd.json';
// const USGS_sourceURL = 'https://raw.githubusercontent.com/NMWDI/VocabService/main/usgs_pvacd.json';
// const OSEROSWELL_sourceURL = 'https://raw.githubusercontent.com/NMWDI/VocabService/main/ose_roswell.json'

var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

var map = L.map('map', {
        preferCanvas: true,
        updateWhenZooming: false,
        updateWhenIdle: true,
        layers: [osm]
    }
)
map.setView([33.5, -104.5], 7);


var layerControl = L.control.layers({"osm": osm}, null).addTo(map);

var use_cluster = false;
var allmarkers = [];

data = {
    "locations": [
        {
            "description": "Stream",
            "encodingType": "application/vnd.geo+json",
            "@iot.id": "f70a1f72-2d24-11ec-84b5-9747f797b70e",
            "location": {
                "type": "Point",
                "coordinates": [
                    -104.2149722,
                    32.409275
                ]
            },
            "name": "USGS-08405200",
            "@iot.selfLink": "https://labs.waterdata.usgs.gov/sta/v1.1/Locations('f70a1f72-2d24-11ec-84b5-9747f797b70e')",
            "HistoricalLocations@iot.navigationLink": "https://labs.waterdata.usgs.gov/sta/v1.1/Locations('f70a1f72-2d24-11ec-84b5-9747f797b70e')/HistoricalLocations",
            "Things@iot.navigationLink": "https://labs.waterdata.usgs.gov/sta/v1.1/Locations('f70a1f72-2d24-11ec-84b5-9747f797b70e')/Things",
            "source": "USGS"
        }
    ]
}

var locations=data['locations']
// var layer = new L.LayerGroup();
let usgs = locations.filter(function(l){return l['source']=='USGS'})
let ose = locations.filter(function(l){return l['source']=='OSE-Roswell'})
let nmbgmr = locations.filter(function(l){return l['source']=='NMBGMR'})
loadLayer(ose, 'blue', 'OSE Roswell', false);
loadLayer(usgs, 'green', 'USGS', true);
loadLayer(nmbgmr, 'orange', 'NMGBMR', false);

    /*
fetch(sourceURL,{
    method: 'GET',
    headers: {'Content-Type':'application/json'},
    mode: 'no-cors'
})
.then(response => console.log(response.json()))
)
.then(function (data){
    var locations=data['locations']
    // var layer = new L.LayerGroup();
    let usgs = locations.filter(function(l){return l['source']=='USGS'})
    let ose = locations.filter(function(l){return l['source']=='OSE-Roswell'})
    let nmbgmr = locations.filter(function(l){return l['source']=='NMBGMR'})
    loadLayer(ose, 'blue', 'OSE Roswell', false);
    loadLayer(usgs, 'green', 'USGS', true);
    loadLayer(nmbgmr, 'orange', 'NMGBMR', false);
})*/

function loadLayer(ls, color, label, load_things){
    console.log('load late')

        let markers = ls.map(function (loc){return loadMarker(loc, color, load_things)})

        var layer = new L.featureGroup(markers)
        map.addLayer(layer)
        layerControl.addOverlay(layer, label)

        layer.on('click', function(e){
            toggleLocation(e.layer.stid, e.layer.name)
        })
}
function loadMarker(loc, color, load_things){
    var marker = L.circleMarker([loc['location']['coordinates'][1], loc['location']['coordinates'][0], ],)
    marker.setStyle({color: color,
        fillColor: color,
        radius: 4})
    marker.stid = loc['@iot.id']
    marker.name = loc['name']
    marker.source =loc['source']
    marker.defaultColor = color
    marker.properties = loc['properties']
    if (load_things){
        $.get(loc['Things@iot.navigationLink']).then(function(data){
              let things = data['value']
            marker.bindPopup(loc['name']+'<br/>'+ things[0]['properties']['monitoringLocationName'])
        })
    }else{
        marker.bindPopup(loc['name'])
    }

    // console.log(loc, loc['Things'])
    marker.on('mouseover', function(e) {
        marker.openPopup();
    } )
    marker.on('mouseout', function(e) {
        map.closePopup();
    } )

    allmarkers.push(marker)
    return marker
    // markers.push(marker)
}
// var sourceURL = 'https://raw.githubusercontent.com/NMWDI/VocabService/main/ose_roswell.json';
// var ose_roswell_markers = []
// loadSource(sourceURL, ose_roswell_markers, 'blue', 'OSE Roswell');

// var sourceURL = 'https://raw.githubusercontent.com/NMWDI/VocabService/main/usgs_pvacd.json';
// var usgs_pvacd_markers = []
// loadSource(sourceURL, usgs_pvacd_markers, 'green', 'USGS');



//
// $.getJSON("st2locations").then(
//     function (data) {
//         var options=data['options'];
//         var fuzzy_options=data['fuzzy_options'];
//         var markers=data['markers'];
//         var fuzzy_markers=data['fuzzy_markers'];
//         var markers_layer = L.geoJson(markers, {
//             pointToLayer: function (feature, latln){
//                 var marker = L.circleMarker(latln, options)
//                 return marker
//             }
//         })
//
//             if (use_cluster){
//                 var cluster= L.markerClusterGroup();
//                 cluster.addLayer(markers_layer)
//             }else{
//                 cluster = markers_layer
//             }
//
//             map.addLayer(cluster)
//             layerControl.addOverlay(cluster, 'ST2')
//
//
//             var fuzzy_layer = L.geoJson(fuzzy_markers, fuzzy_options)
//             layerControl.addOverlay(fuzzy_layer, 'OSE RealTime')
//     })
//
// $.getJSON("nmenvlocations").then(
// function (data) {
// var options=data['options'];
// var markers=data['markers'];
// var layer = L.geoJson(markers, {
//     pointToLayer: function (feature, latln){
//         var marker = L.circleMarker(latln, options)
//         return marker
//     }
// })
//     if (use_cluster){
//         var cluster= L.markerClusterGroup();
//         cluster.addLayer(layer)
//     }else{
//         cluster = layer
//     }
//     map.addLayer(cluster)
//     layerControl.addOverlay(cluster, 'NMENV')
//
//
// })
//
// $.getJSON("oselocations").then(
// function (data) {
// var options=data['options'];
// var markers=data['markers'];
// var layer = L.geoJson(markers, {
//     pointToLayer: function (feature, latln){
//         var marker = L.circleMarker(latln, options)
//         return marker
//     }
// })
//         if (use_cluster){
//             var cluster= L.markerClusterGroup({'chunkedLoading': true});
//             cluster.addLayers(layer)
//
//         }else{
//             cluster = layer
//         }
//
//         map.addLayer(cluster)
//         layerControl.addOverlay(cluster, 'OSE PODS')
// })



