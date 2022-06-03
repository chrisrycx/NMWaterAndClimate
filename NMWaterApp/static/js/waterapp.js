//NM Water App JS


/**** Map *****/
console.log('hello?')


/**** Charts ****/
var wellchrt = document.getElementById('wellchart')
var pchrt = document.getElementById('precipchart')

Plotly.newPlot( wellchrt, [
    {
        x: [1, 2, 3, 4, 5],
        y: [1, 2, 4, 8, 16] 
    }],
    {
        height: 250,
        margin: { t: 0 } 
    } 
);

Plotly.newPlot( pchrt, [
    {
        x: [1, 2, 3, 4, 5],
        y: [1, 2, 4, 8, 16] 
    }],
    {
        height: 250,
        margin: { t: 0 } 
    } 
);

function updatePrecip(){
    //Generate data

    let data = {
        x: [1, 2, 4, 8, 16],
        y: [1, 2, 3, 4, 5]
    }

    Plotly.restyle(pchrt,data)

}