

window.onload = () => {








    //initialize the map object
//initialize the map object
var map = L.map('map', {zoomControl:false}).setView([38.91600, -77.22357], 18);

    //test affichage prix/m2
    var selectedLayerId = null;


    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        minZoom: 1,
        name: 'tiles',
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//google.fr/maps/">Google Maps: vue Satellite</a>'
    }).addTo(map);

    L.control.zoom({
        position: 'topright'
    }).addTo(map);




//geojson with stores data
var storeData = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "stroke": "#555555",
        "stroke-width": 1,
        "stroke-opacity": 1,
        "fill": "#008080",
        "fill-opacity": 0.5,
        "name": "store5"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -77.22447752952576,
              38.91583006777975
            ],
            [
              -77.22404837608337,
              38.915696503151565
            ],
            [
              -77.22395181655884,
              38.91585511111954
            ],
            [
              -77.22439169883728,
              38.915980327685965
            ],
            [
              -77.22444534301758,
              38.91590519777263
            ],
            [
              -77.22447752952576,
              38.91583006777975
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "stroke": "#555555",
        "stroke-width": 1,
        "stroke-opacity": 1,
        "fill": "#808000",
        "fill-opacity": 0.5,
        "name": "store4"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -77.22430050373076,
              38.91615771744356
            ],
            [
              -77.22439706325531,
              38.915986588508495
            ],
            [
              -77.22395449876785,
              38.91586137195311
            ],
            [
              -77.2238740324974,
              38.916049196703334
            ],
            [
              -77.22430050373076,
              38.91615771744356
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "stroke": "#555555",
        "stroke-width": 1,
        "stroke-opacity": 1,
        "fill": "#804040",
        "fill-opacity": 0.5,
        "name": "store3"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -77.22420930862427,
              38.9163309328966
            ],
            [
              -77.22430050373076,
              38.91616189131486
            ],
            [
              -77.2238767147064,
              38.91605545751978
            ],
            [
              -77.22379893064499,
              38.91622867322243
            ],
            [
              -77.22420930862427,
              38.9163309328966
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "stroke": "#555555",
        "stroke-width": 1,
        "stroke-opacity": 1,
        "fill": "#400080",
        "fill-opacity": 0.5,
        "name": "store2"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -77.22411006689072,
              38.91651458255373
            ],
            [
              -77.22420662641525,
              38.916337193688186
            ],
            [
              -77.223801612854,
              38.91623284708958
            ],
            [
              -77.22371309995651,
              38.916420670856624
            ],
            [
              -77.22411006689072,
              38.91651458255373
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "stroke": "#555555",
        "stroke-width": 1,
        "stroke-opacity": 1,
        "fill": "#0080c0",
        "fill-opacity": 0.5,
        "name": "store1"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -77.22400277853012,
              38.916708666333946
            ],
            [
              -77.22411543130875,
              38.91651875640406
            ],
            [
              -77.22370773553848,
              38.9164269316403
            ],
            [
              -77.22362458705902,
              38.916635624113376
            ],
            [
              -77.22400277853012,
              38.916708666333946
            ]
          ]
        ]
      }
    }
  ]
};

//this is a variable to host the GeoJSON Layer Object
var geoJSONLayer;

//function to set the default style of the polygons
function style(feature) {
    return {
        fillColor: "#939393",
        weight: 1,
        opacity: 1,
        color: "#636363",
        fillOpacity: 0.7
    };
}

//function to update the style of the selected layer & reset the style for other unselected layers
function highlightFeature(e){
    //variable to host the selected layer
    var clickedLayer = e.target;

    //use the "eachLayer" method to llop through all layers in the GeoJSON object
    geoJSONLayer.eachLayer(function(layer){
        //set the style for the selected layer
        if(layer == clickedLayer) {
            layer.setStyle({
                fillColor: "#FFCC00",
                weight: 5,
                color: '#666',
                dashArray: '',
                fillOpacity: 0.7
            });
        }
        //reset the style for the other layers
        else {
            layer.setStyle({
                fillColor: "#939393",
                weight: 1,
                opacity: 1,
                color: "#636363",
                fillOpacity: 0.7
            });
        }
    })
}

//add popup window to each layer and style the highlighted layer
function onEachFeature(feature, layer) {
    //appending popup info window to the layer
    layer.bindPopup(feature.properties.name);

    //indicateing the functions will be fired when a layer is clicked
    layer.on({
       mouseover: highlightFeature,
       mouseout: resetHighlight

        //call "highlightFeature" function when a layer is clicked
         //click: highlightFeature
    });
}

//adding the store layer to the map
geoJSONLayer = L.geoJson(storeData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map);




  }