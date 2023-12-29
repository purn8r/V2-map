
const defaultStyle = {
  weight: 2,
  color: '#637081',
  dashArray: '',
  fillOpacity: 1,
  opacity: 1
}
const unnamedStyle = {
  weight: 4,
  color: '#3388ff',
  dashArray: '',
  fillOpacity: 1,
  Opacity: 1
}
var modal = document.getElementById("myModal");

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


function highlightFeature(e) {
  var layer = e.target;

  layer.setStyle({
    stroke: true,
    weight: 8,
    dashArray: '',
    opacity: .5,
    color: '#ff3300'

  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
}
function colorize(layer) {
  let layerStyle = layer.feature.properties.style
  if (layerStyle==null || layerStyle==undefined || layerStyle=="Default") {layer.setStyle(Styles.Default)}
  else if (layerStyle=="Highway"){layer.setStyle(Styles.Highway)}
  else if (layerStyle=="Major"){layer.setStyle(Styles.Major)}
  else if (layerStyle=="Minor"){layer.setStyle(Styles.Minor)}
  else if (layerStyle=="Pedestrian"){layer.setStyle(Styles.Pedestrian)}
  layer.redraw()
}
function resetHighlight(e) {
  // dataset.resetStyle(e.target);
  var layer = e.target;
  colorize(layer)
}
let target = null
let targetLayer = null
function onClick(e) {
  modal.style.display = "block";
  target = e.target 
  target.redraw()
  // console.log(e.target)
}

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

  layer.on({
    click: onClick,
    mouseover: highlightFeature,
    mouseout: resetHighlight,
  });
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

// Add map, set default view
var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -1,
  center: [0, 0],
  renderer: streetLabelsRenderer,
  layers: datasets,
}).setView([-300, 500], 0);

// Add tile layer
var t = L.tileLayer('../tiles/{z}/{y}/{x}.png', {
  noWrap: true,
  tileSize: L.point(1021, 865),
  minNativeZoom: 0,
  maxNativeZoom: 3,
  minZoom: -1,
  maxZoom: 5,
  bounds: [[0, 0], [-864, 1020]],
  attribution: "purn8r"
}).addTo(map);

L.control.layers({ "Satellite": t /*only 1 can be picked from here, separate with ;*/ }, layerList).addTo(map)

// for testing
/*
var popup = L.popup();
let listString = ""
let debounce = false
 
async function onMapClick(e) {
    if (debounce === false) {
        debounce = true
        let initialCoords = e.latlng.toString().split("(")[1].split(")")[0]
        const splitted = initialCoords.split(", ")
        initialCoords = "[" + splitted[1] + ", " + splitted[0] + "], "
        listString = listString + initialCoords
        console.log(listString)       
        await new Promise(resolve => setTimeout(resolve, 100))
        debounce = false
    }
    
}
map.on('click', onMapClick);
*/
//

// Get the modal

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];
var selection = document.getElementById("selection")
// When the user clicks on the button, open the modal
// modal.style.display = "block";

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
selection.value = ""
function changed(){
  target.feature.properties.style = selection.value
  colorize(target)
  target.redraw()
  selection.value = ""
  modal.style.display = "none";
}

function exporter() {
  function generateGeoJson() {
    var fg = L.featureGroup();
    var layers = findLayers(map);
    layers.forEach(function (layer) {
      fg.addLayer(layer);
    });
    console.log(JSON.stringify(fg.toGeoJSON()));
    document.getElementById("export-text").textContent = JSON.stringify(fg.toGeoJSON())

    return fg.toGeoJSON()
  }

  function findLayers(map) {
    var layers = [];
    map.eachLayer(layer => {
      if (
        layer instanceof L.Polyline || //Don't worry about Polygon and Rectangle they are included in Polyline
        layer instanceof L.Marker ||
        layer instanceof L.Circle ||
        layer instanceof L.CircleMarker
      ) {
        layers.push(layer);
      }
    });

    // filter out layers that don't have the leaflet-geoman instance
    // layers = layers.filter(layer => !!layer.pm);

    // filter out everything that's leaflet-geoman specific temporary stuff
    layers = layers.filter(layer => !layer._pmTempLayer);

    return layers;
  }

  generateGeoJson()
}

function clearExporter() { document.getElementById("export-text").textContent = "" }