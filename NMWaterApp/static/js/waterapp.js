//NM Water App JS

const frostServer = "https://st2.newmexicowaterdata.org/FROST-Server/v1.1/"

//Build initial plotly charts
var wellchrt = document.getElementById('wellchart')
//var pchrt = document.getElementById('precipchart')

basic_layout = {
    title: 'Select well site',
    xaxis: {
        type: 'date'
    },
    height: 300,
    margin: { t: 0 } 
}

Plotly.newPlot(wellchrt, [{x:[],y:[]}], basic_layout)
//Plotly.newPlot(pchrt, [{x:[],y:[]}], basic_layout)

function updateWellChrt(dts,vals){
 
    var data_update = {
        x: [dts],
        y: [vals]
    }

    var layout_update = {
        title: 'New',
    }
    
    Plotly.update(wellchrt, data_update)
}

function updatePrecip(){
    //Generate data

    let data = {
        x: [[1, 2, 4, 8, 16]],
        y: [[1, 2, 3, 4, 5]]
    }

    Plotly.update(pchrt,data)

}

function getDataStream(well_id){
    console.lot('datastream')
    let querytxt = document.getElementById('querytxt')
    let querystr = `Locations(${well_id})?$expand=Things/Datastreams/ObservedProperty,Things/Datastreams/Sensor`
    querytxt.textContent = querystr
    
    //Get the groundwater level datastream ID from NM Water Data
    fetch(
        frostServer + querystr,
        {
            method: 'GET',
            headers: {'Content-Type':'application/json'}
        }
    ).then(response => response.json()).then(function(location_data){
        //TODO!!!!!!!!!!!!!!
        return 4900
    })

}

function getWellData(datastream_id){
    //Download groundwater level data from NM Water Data

    let querytxt = document.getElementById('querytxt')
    let querystr = `Datastreams(${datastream_id})/Observations?$orderby=phenomenonTime desc`
    querytxt.textContent = querystr

    console.log('Datastream: ' + datastream_id)
    fetch(
        frostServer + querystr,
        {
            method: 'GET',
            headers: {'Content-Type':'application/json'}
        }
    ).then(response => response.json()).then(function(rawdata){
        let dtstamps = rawdata['value'].map(x => x['phenomenonTime'])
        let dvals = rawdata['value'].map(x => x['result'])
        updateWellChrt(dtstamps,dvals)
    })
}