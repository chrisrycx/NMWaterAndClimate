// Adapted from HydroViewer map.js
// L is the global Leaflet object



var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
})

//Instantiate as leafmap to avoid conflict with JS map function
var leafmap = L.map('map', {
        preferCanvas: true,
        updateWhenZooming: false,
        updateWhenIdle: true,
        layers: [osm]
    }
)
leafmap.setView([34, -106], 7);

//Creates the marker layer
//var layerControl = L.control.layers({"osm": osm}, null).addTo(leafmap);
wellGroup = L.featureGroup()

//Load initial well locations
getWellLocations(2022)

//Change locations based on selected year
var wellyear_form = document.getElementById('wellyear_form')
wellyear_form.onsubmit = function(e) { 
    e.preventDefault()
    let wellyear_data = new FormData(wellyear_form)
    getWellLocations(wellyear_data.get('wellyear'))
}

function getWellLocations(datayear){
    //Get locations of wells with data for input year
    let querytxt = document.getElementById('mapquery')
    let querystr = "Datastreams?$filter=year(phenomenonTime) eq " + datayear
    querytxt.textContent = querystr

    fetch(
        frostServer + querystr,
        {
            method: 'GET',
            headers: {'Content-Type':'application/json'}
        }
    ).then(response => response.json()).then(loadWellLayer)

}

//Display sites on the map
function loadWellLayer(data){

        //Remove old layer
        if (leafmap.hasLayer(wellGroup)){
            console.log('Removing layer')
            leafmap.removeLayer(wellGroup)
        }
    
        let locations = data['value']

        let markers = locations.map(loadMarker)

        wellGroup = new L.featureGroup(markers)
        leafmap.addLayer(wellGroup)
        //layerControl.addOverlay(layer, label)

        wellGroup.on('click', function(e){
            console.log(e)
            getWellData(e.layer.dsid)
            getWellMeta(e.layer.dsid)
        })

        

}

function loadMarker(markerdata){
    //Create a marker for location

    //Parse phenomenon time in order to assess dataset
    let daterange = markerdata['phenomenonTime'].split('\/')
    let startdate = new Date(daterange[0])
    let enddate = new Date(daterange[1])
    let days = ((enddate - startdate)/1000)/86400

    //Specify marker color based on days in dataset
    let mcolor = 'blue'
    if(days < 360){
        mcolor = 'red'
    }else if (days < 1825) {
        //Less than 5 years
        mcolor = 'yellow'
    } else {
        mcolor = 'green'
    }
    
    let marker = L.circleMarker(
        [
            markerdata['observedArea']['coordinates'][1],
            markerdata['observedArea']['coordinates'][0]
        ]
    )
    marker.setStyle(
        {
            color: mcolor,
            radius: 4
        }
    )
    marker.dsid = markerdata['@iot.id']
    marker.name = markerdata['name']
    
    return marker

}







