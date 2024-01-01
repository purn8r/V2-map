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

let roadsList = []
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
function onEachFeature2(feature, layer) {
    // do something with the features here (bind popups, etc.)
    /*
    layer.setStyle({
      weight: 10,
      color: 'green',
      fillOpacity: 0,
    })
    */
    colorize(layer)
    roadsList.push(layer)
    // layer.on({
    //   mouseover: highlightFeature,
    //   mouseout: resetHighlight,
    // });
}
let markerIcon = L.Icon.extend({
    options: {
        // shadowUrl: 'leaf-shadow.png',
        iconSize:     [44, 44],
        shadowSize:   [0, 0],
        iconAnchor:   [16, 44],
        shadowAnchor: [0, 0],
        popupAnchor:  [-3, -76]
    }
})
function makeMarker(name) {return new markerIcon({iconUrl:`assets\\markers\\${name}.png`})}

let builds = []
function onEachPoint(feature, layer) {
  let marker = makeMarker(feature.properties.style || "default")
  marker.interactive = false
  const lat = feature.geometry.coordinates[1];
  const lon = feature.geometry.coordinates[0];
  let realMarker = L.marker([lat, lon], { icon: marker })
//   realMarker.on('click', onClick)
  realMarker.feature = feature
  builds.push(realMarker)

  // marker.getPane().onclick(()=>{console.log("a")})
}

let datasets = []
let layerList = {}
let delayedAdd = []
data.forEach(json => {
    var dataset
    if (json.properties.layerName == "Roads") {
        dataset = L.geoJSON(json, {
            onEachFeature: onEachFeature2,
            //color: color: "#ff0000"
        })
    } else {
        dataset = L.geoJSON(json, {
            onEachFeature: onEachFeature,
            //color: color: "#ff0000"
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
// buildingLayerGroup.on('mouseover', (e) => { console.log(e) })
datasets.push(buildingLayerGroup)
layerList = { ...layerList, ["Buildings"]: buildingLayerGroup }

// buildingLayer.addTo(map)

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
// delayedAdd.forEach(layer=>{
//     layer.addTo(map)
// })


//Autocomplete stuffs
function autocomplete(inp, arr) {
    /*the autocomplete function takes two arguments,
    the text field element and an array of possible autocompleted values:*/
    var currentFocus;
    /*execute a function when someone writes in the text field:*/
    inp.addEventListener("input", function (e) {
        var a, b, i, val = this.value;
        /*close any already open lists of autocompleted values*/
        closeAllLists();
        if (!val) { return false; }
        currentFocus = -1;
        /*create a DIV element that will contain the items (values):*/
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        /*append the DIV element as a child of the autocomplete container:*/
        this.parentNode.appendChild(a);
        /*for each item in the array...*/
        for (i = 0; i < arr.length; i++) {
            /*check if the item starts with the same letters as the text field value:*/
            if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
                /*create a DIV element for each matching element:*/
                b = document.createElement("DIV");
                /*make the matching letters bold:*/
                b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
                b.innerHTML += arr[i].substr(val.length);
                /*insert a input field that will hold the current array item's value:*/
                b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
                /*execute a function when someone clicks on the item value (DIV element):*/
                b.addEventListener("click", function (e) {
                    /*insert the value for the autocomplete text field:*/
                    inp.value = this.getElementsByTagName("input")[0].value;
                    /*close the list of autocompleted values,
                    (or any other open lists of autocompleted values:*/
                    closeAllLists();
                });
                a.appendChild(b);
            }
        }
    });
    /*execute a function presses a key on the keyboard:*/
    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            /*If the arrow DOWN key is pressed,
            increase the currentFocus variable:*/
            currentFocus++;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 38) { //up
            /*If the arrow UP key is pressed,
            decrease the currentFocus variable:*/
            currentFocus--;
            /*and and make the current item more visible:*/
            addActive(x);
        } else if (e.keyCode == 13) {
            /*If the ENTER key is pressed, prevent the form from being submitted,*/
            e.preventDefault();
            if (currentFocus > -1) {
                /*and simulate a click on the "active" item:*/
                if (x) x[currentFocus].click();
            }
        }
    });
    function addActive(x) {
        /*a function to classify an item as "active":*/
        if (!x) return false;
        /*start by removing the "active" class on all items:*/
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        /*add class "autocomplete-active":*/
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        /*a function to remove the "active" class from all autocomplete items:*/
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(elmnt) {
        /*close all autocomplete lists in the document,
        except the one passed as an argument:*/
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

let names = data[0].features.map(road=>road.properties.name).filter(road=>road!=undefined)
let search = document.getElementById("searchBox")
function onTextChanged() {
    // console.log(search.value)
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
// console.log(roadsList)

// console.log(names)
autocomplete(search, names);