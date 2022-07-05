//NM Water App JS

const frostServer = "https://st2.newmexicowaterdata.org/FROST-Server/v1.1/"

//Build initial plotly charts
var wellchrt = document.getElementById('wellchart')
//var pchrt = document.getElementById('precipchart')

basic_layout = {
    xaxis: {
        type: 'date',
        title: 'Date'
    },
    yaxis: {
        title: 'testing'
    },
    height: 300,
    width: 600,
    margin: { t: 0 } 
}

Plotly.newPlot(wellchrt, [{x:[],y:[]}], basic_layout)
//Plotly.newPlot(pchrt, [{x:[],y:[]}], basic_layout)

function updateWellChrt(dts,vals,ylabel){
 
    var data_update = {
        x: [dts],
        y: [vals]
    }

    var layout_update = {
        yaxis: {title: ylabel}
    }
    
    Plotly.update(wellchrt, data_update, layout_update)
}

function getWellData(datastream_id){
    //Download groundwater level data from NM Water Data

    let querytxt = document.getElementById('chartquery')
    let querystr = 
        `Datastreams(${datastream_id})?$expand=Observations($orderby=phenomenonTime desc)`
    querytxt.textContent = querystr

    fetch(
        frostServer + querystr,
        {
            method: 'GET',
            headers: {'Content-Type':'application/json'}
        }
    ).then(response => response.json()).then(function(rawdata){
        let yaxis = rawdata.name
        let dtstamps = rawdata.Observations.map(x => x['phenomenonTime'])
        let dvals = rawdata.Observations.map(x => x['result'])
        updateWellChrt(dtstamps,dvals,yaxis)
    })
}

function getWellMeta(datastream_id){
    //Download "thing" information associated with datastream

    let querystr = `Datastreams(${datastream_id})/Thing`
    let querytxt = document.getElementById('metaquery')
    querytxt.textContent = querystr
    
    fetch(
        frostServer + querystr,
        {
            method: 'GET',
            headers: {'Content-Type':'application/json'}
        }
    ).then(response => response.json()).then(function(rawdata){
        let wellname = document.getElementById("welluse")
        let welldepth = document.getElementById("welldepth")
        let wellstatus = document.getElementById("wellstatus")
        let wellagency = document.getElementById("wellagency")
        
        wellname.textContent = rawdata.properties.Use
        welldepth.textContent = rawdata.properties.WellDepth
        wellstatus.textContent = rawdata.properties.Status
        wellagency.textContent = rawdata.properties.agency
    })

}