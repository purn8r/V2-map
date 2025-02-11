var streetLabelsRenderer = new L.StreetLabels({
    //color : "#ff0000",
    collisionFlg: true,
    propertyName: 'name',
    showLabelIf: function (layer) {
        return true; //layer.properties.type == "primary";
    },
    fontStyle: {
        dynamicFontSize: false,
        fontSize: 15, // was 15
        fontSizeUnit: "px",
        lineWidth: 2.0, // was 4.0
        fillStyle: "white",
        strokeStyle: "black",
    },
})


let roadsList = []
function onEachFeature(feature, layer) {
    colorize(layer)
}
function onEachFeature2(feature, layer) {
    colorize(layer)
    roadsList.push(layer)
}
let markerIcon = L.Icon.Label.extend({
    options: {
        iconSize:     new L.Point(44, 44),
        shadowSize:   [0, 0],
        // iconAnchor:   [22, 44],
        shadowAnchor: [0, 0],
        popupAnchor:  [-3, -76],
        wrapperAnchor: new L.Point(22,44),
        iconAnchor:   new L.Point(0,0),
        labelAnchor:  new L.Point(32,9)//Actual icon width (excluding whitespace on sides) + padding
    }
})
function makeMarker(iconName,labelText) {return new markerIcon({iconUrl:`assets\\markers\\${iconName}.png`,labelText:labelText})}

let builds = []
let icons = []
function onEachPoint(feature, layer) {
  let marker = makeMarker(feature.properties.style || "default",feature.properties.name)
  marker.interactive = false
  const lat = feature.geometry.coordinates[1];
  const lon = feature.geometry.coordinates[0];
  let realMarker = new L.Marker.Label([lat, lon], { icon: marker })
  //L.marker([lat, lon], { icon: marker })
  realMarker.feature = feature
  builds.push(realMarker)
  icons.push(marker)
}

let datasets = []
let layerList = {}
let delayedAdd = []
data.forEach(json => {
    var dataset
    if (json.properties.layerName == "Roads") {
        dataset = L.geoJSON(json, {
            onEachFeature: onEachFeature2,
        })
    } else {
        dataset = L.geoJSON(json, {
            onEachFeature: onEachFeature,
        })
    }
    
    if (json.properties.hideByDefault) {
        delayedAdd.push(dataset)
    } else {
        datasets.push(dataset)
    }
    layerList = { ...layerList, [json.properties.layerName]: dataset }

})


let buildingLayer = L.geoJSON(buildings, { onEachFeature: onEachPoint })
let buildingLayerGroup = L.layerGroup(builds)
datasets.push(buildingLayerGroup)
layerList = { ...layerList, ["Buildings"]: buildingLayerGroup }


// Configuration constants
const TILE_CONFIG = {
    tileSize: 4096,
    minNativeZoom: 4,
    maxNativeZoom: 4,
    minZoom: 0,
    maxZoom: 100,
    bounds: [[0, 0], [-1010, 1200]],
    updateWhenIdle: true,
    updateInterval: 500,
    reuseTiles: true,
    keepBuffer: 2,
    maxTiles: 10,
    tileRetryInterval: 2000,
    tileRetryLimit: 3,
    errorTileUrl: 'assets/error.png',
    crossOrigin: 'anonymous',
};


const map = L.map('map', {
    crs: L.CRS.Simple,
    center: [-500, 250],
    zoom: 1,
    fadeAnimation: false,
    renderer: streetLabelsRenderer,
    layers: datasets,
    maxBounds: [[-1010, 0], [0, 1200]], 
    maxBoundsViscosity: 1.0, 
    zoomAnimation: !/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
});

const tileLayer = L.tileLayer('tiles/{z}/{y}/{x}.png', TILE_CONFIG)
    .on('tileerror', handleTileError)
    .on('tileloadstart', handleTileLoadStart)
    .addTo(map);

// Layer management
const layers = {
    Roads: createRoadLayer(),
    Buildings: createBuildingLayer(),

};

// Initialize layer control
L.control.layers({ "Satellite": tileLayer }, layerList).addTo(map);

// Road layer configuration
function createRoadLayer() {
    const roads = [];
    return L.geoJSON(data.find(json => json.properties.layerName === "Roads"), {
        onEachFeature: (feature, layer) => {
            colorize(layer);
            roads.push(layer);
        }
    });
}

// Building layer configuration
function createBuildingLayer() {
    const buildings = [];
    const markerIcon = L.Icon.Label.extend({
        options: {
            iconSize: new L.Point(44, 44),
            shadowSize: [0, 0],
            popupAnchor: [-3, -76],
            wrapperAnchor: new L.Point(22, 44),
            iconAnchor: new L.Point(0, 0),
            labelAnchor: new L.Point(32, 9)
        }
    });

    function createMarker(iconName, labelText) {
        return new markerIcon({
            iconUrl: `assets/markers/${iconName}.png`,
            labelText: labelText
        });
    }

    return L.geoJSON(buildings, {
        onEachFeature: (feature, layer) => {
            const marker = createMarker(feature.properties.style || "default", feature.properties.name);
            marker.interactive = false;
            const [lon, lat] = feature.geometry.coordinates;
            const realMarker = new L.Marker.Label([lat, lon], { icon: marker });
            realMarker.feature = feature;
            buildings.push(realMarker);
        }
    });
}

// Error handling
function handleTileError(error) {
    console.warn('Tile loading error:', error);
    error.tile.src = TILE_CONFIG.errorTileUrl;
}

function handleTileLoadStart(event) {
    setTimeout(() => {
        if (!event.tile.complete) {
            event.tile.src = TILE_CONFIG.errorTileUrl;
            tileLayer._tileLoaded();
        }
    }, 5000);
}





// Handle memory warnings
map.on('unload', () => window.location.reload());

//Autocomplete stuffs
function autocomplete(inp, arr) {
    var currentFocus;
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        this.parentNode.appendChild(a);
        for (i = 0; i < arr.length; i++) {
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                b = document.createElement("DIV");
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                b.addEventListener("click", function (e) {
                    inp.value = this.getElementsByTagName("input")[0].value;
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) { //up
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

let names = data[0].features.map(road=>road.properties.name).filter(road=>road!=undefined)
let search = document.getElementById("searchBox")
function onTextChanged() {
    if(names.includes(search.value)) {
        //find the layer and change its style to highlight
        roadsList.forEach(layer=>{
            if (layer.feature.properties.name == search.value) {
                layer.setStyle(Styles.Hover)
                layer.redraw()
                setTimeout(()=>{colorize(layer)},5000)
            }
        })        
    }
    
}
autocomplete(search, names);