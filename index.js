var streetLabelsRenderer = new L.StreetLabels({
    //color : "#ff0000",
    collisionFlg: true,
    propertyName: 'name',
    showLabelIf: function (layer) {
        return true; //layer.properties.type == "primary";
    },
    fontStyle: {
        //color : "#ff0000",
        dynamicFontSize: false,
        fontSize: 15, // was 15
        fontSizeUnit: "px",
        lineWidth: 2.0, // was 4.0
        fillStyle: "white",
        strokeStyle: "black",
    },
    //lineStyle: {
    //color: "#ff0000",
    //}
})

// function highlightFeature(e) {
//   var layer = e.target;

//   layer.setStyle({
//     stroke: true,
//     weight: 8,    
//     dashArray: '',
//     opacity: 0.6,
//     color: '#ff3300'

//   });

//   if (!L.Browser.ie && !L.Browser.opera) {
//     layer.bringToFront();
//   }
// }

// function resetHighlight(e) {
//   dataset.resetStyle(e.target);
// 	var layer = e.target;

//   layer.setStyle(defaultStyle);
// }


function onEachFeature(feature, layer) {
    // do something with the features here (bind popups, etc.)
    /*
    layer.setStyle({
      weight: 10,
      color: 'green',
      fillOpacity: 0,
    })
    */
    colorize(layer)

    // layer.on({
    //   mouseover: highlightFeature,
    //   mouseout: resetHighlight,
    // });
}

let datasets = []
let layerList = {}
data.forEach(json => {
    var dataset = L.geoJSON(json, {
        onEachFeature: onEachFeature,
        //color: color: "#ff0000"
    })
    datasets.push(dataset)
    layerList = { ...layerList, [json.layerName]: dataset }

})

// Load the dataset




// Add map, set default view
var map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -1,
    center: [0, 0],
    renderer: streetLabelsRenderer,
    layers: datasets,
}).setView([-300, 500], 0);

// Add tile layer
var t = L.tileLayer('tiles/{z}/{y}/{x}.png', {
    noWrap: true,
    tileSize: L.point(1021, 865),
    minNativeZoom: 0,
    maxNativeZoom: 3,
    minZoom: -1,
    maxZoom: 6,
    bounds: [[0, 0], [-864, 1020]],
    attribution: "purn8r"
}).addTo(map);

L.control.layers({ "Satellite": t /*only 1 can be picked from here, separate with ;*/ }, layerList).addTo(map)