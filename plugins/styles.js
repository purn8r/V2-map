let Styles = {}

Styles.Default = {
    weight: 2,
    color: '#637081',
    dashArray: '',
    fillOpacity: 1,
    opacity: .5
}

Styles.Editing = {
    weight: 4,
    color: '#3388ff',
    dashArray: '',
    fillOpacity: 1,
    Opacity: 1
}

Styles.Highway = {
    weight: 4,
    color: '#f5ce42',
    dashArray: '',
    fillOpacity: 1,
    opacity: .5
}

Styles.Major = {
    weight: 4,
    color: '#2c578f',
    dashArray: '',
    fillOpacity: 1,
    opacity: .5
}

Styles.Exit = {
    weight: 4,
    color: '#09751a',
    dashArray: '',
    fillOpacity: 1,
    opacity: .5
}

Styles.Minor = {
    weight: 2,
    color: '#637081',
    dashArray: '',
    fillOpacity: 1,
    opacity: .5
}

Styles.Pedestrian = {
    weight: 1.5,
    color: '#09751a',
    dashArray: '5,5',
    fillOpacity: 1,
    opacity: .5
}

Styles.Hover = {
    stroke: true,
    weight: 8,
    dashArray: '',
    opacity: 0.5,
    color: '#ff3300'
  
}

Styles.ArborPD =  {
    stroke: true,
    weight: 3,
    dashArray: '',
    opacity: 0.7,
    color: '#2a28ad',
    fillOpacity: .2,
}
Styles.RedwoodPD =  {
    stroke: true,
    weight: 3,
    dashArray: '',
    opacity: 0.7,
    color: '#ad2f28',
    fillOpacity: .2,
}
Styles.PromPD =  {
    stroke: true,
    weight: 3,
    dashArray: '',
    opacity: 0.7,
    color: '#ada228',
    fillOpacity: .2,
}

function colorize(layer) {

    let layerStyle = null
    if (layer.feature.properties != undefined && layer.feature.properties.style != undefined) {layerStyle = layer.feature.properties.style}
    if (layerStyle==null || layerStyle==undefined || layerStyle=="Default") {layer.setStyle(Styles.Default)}
    else if (layerStyle=="Highway"){layer.setStyle(Styles.Highway)}
    else if (layerStyle=="Major"){layer.setStyle(Styles.Major)}
    else if (layerStyle=="Exit"){layer.setStyle(Styles.Exit)}
    else if (layerStyle=="Minor"){layer.setStyle(Styles.Minor)}
    else if (layerStyle=="Pedestrian"){layer.setStyle(Styles.Pedestrian)}
    else if (layerStyle=="ArborPD"){layer.setStyle(Styles.ArborPD)}
    else if (layerStyle=="RedwoodPD"){layer.setStyle(Styles.RedwoodPD)}
    else if (layerStyle=="PromPD"){layer.setStyle(Styles.PromPD)}
    layer.redraw()
  }