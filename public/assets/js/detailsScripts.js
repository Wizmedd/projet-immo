var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})


window.onload = () => {


    var selectedLayerId = null;

    let map = L.map('map', { scrollWheelZoom: false, zoomControl: false }).setView([43.600000, 1.433333], 12);

    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 18,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        minZoom: 1,
        name: 'tiles',
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: '©  - <a href="https://data.toulouse-metropole.fr/pages/accueil/">Data Toulouse Métropole</a>'
    }).addTo(map);


    var controlLoader = L.control.loader().addTo(map);

    controlLoader.show();

    L.streetView().addTo(map);

    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    var scale = L.control.scale({
        position: 'bottomright',
        imperial:false
    }); // Creating scale control
         scale.addTo(map); // Adding scale control to the map


// control that shows left panel on hover
var panel = L.control({position: 'topleft'});



 // get color depending on population density value
 function getColor(d) {
    return d > 5000 ? '#800026' : d > 4500 ? '#BD0026' : d > 4000 ? '#E31A1C' : d > 3500 ? '#FC4E2A' : d > 3000 ? '#FD8D3C' : d > 2500 ? '#FEB24C' : d > 2000 ? '#FED976' : '#FFEDA0';
}

function style(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'white',
        dashArray: "15,15",
        dashSpeed: -30,
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.density)
    };
}

function style2(feature) {
    return {
        weight: 2,
        opacity: 1,
        color: 'green',

        fillOpacity: 0.7,
        fillColor: 'rgb(0,255,0)'
    };
}

var geojson2;
var geojson3;
var geojson4;



function toggleLayerVisibility(map, selectedLayer) {
    if (selectedLayerId && selectedLayerId !== selectedLayer._leaflet_id) {
        map.eachLayer(layer => {
            if (layer._leaflet_id === selectedLayerId) geojson.resetStyle(layer);
            if (layer._leaflet_id === selectedLayerId) geojson2.resetStyle(layer);
        })
    }
    selectedLayer.setStyle({
        weight: 5,
        color: 'rgb(255,223,0)',//color: or 'rgb(255,223,0)'
        dashArray: "15,15",
        fillOpacity: 0
    });
    selectedLayerId = selectedLayer._leaflet_id; //save identifier of a selected layer
    console.log("n° selecltlayer_leaflet_id sauvegardé: " + selectedLayerId)
    //console.log(quatorsData.features[1].properties.name);

}
geojson2 = L.geoJson(quatorsData, {
    style: style,

});

var shelter3 = L.marker([43.60003295262995, 1.443237606626574], {
    icon: L.icon({
        title: "title",
        iconUrl: '/assets/images/icon3.png',
        iconSize: [40, 40], // size of the icon
        //shadowSize: [50, 64], // size of the shadow
        iconAnchor: [20, 40] // point of the icon which will correspond to marker's location
    }),
    bounceOnAdd: true,
    bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
}).addTo(map);

// on veut afficher les marché sur tolouse


let xhrMarket = new XMLHttpRequest();
xhrMarket.addEventListener("readystatechange", onLoadProgress);
xhrMarket.open('GET', '/assets/js/marches-couverts-et-de-plein-vent.json');
xhrMarket.send();

function onLoadProgress(evt) {
    console.log(this.readyState);
    if (this.readyState === 4 && this.status === 200) {
        initMapMarket(JSON.parse(this.responseText));

    }
}

function initMapMarket(markets) {

    console.log(markets)
    for (let market of markets) {


        const fontAwesomeIcon = L.divIcon({
            html: '<i class="fas fa-map-marker-alt fa-lg" style="color:red"></i>',
            iconSize: [14, 14],
            className: 'myDivIcon'
          });

        let marker = new L.Marker(
            [market.fields.geo_point_2d[0], market.fields.geo_point_2d[1]],{
                icon: L.icon({
                    iconUrl: '/assets/images/icons8-ingredients-64.png',
                    iconSize: [20, 20], // size of the icon
                    //shadowSize: [50, 64], // size of the shadow
                    iconAnchor: [10, 10] // point of the icon which will correspond to marker's location
                }),

            bounceOnAdd: false,
            bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
            bounceOnAddCallback: function () { console.log("done"); }
        }).bindTooltip("<img src='/assets/images/icons8-ingredients-64.png' class='rounded-4' style='width:20px'><b> Marché: </b>" + market.fields.nom + "</br><b>"  + "</b> "+ market.fields.adresse + "</br>" + market.fields.jours_de_tenue + "</br>" + market.fields.type).addTo(map);







    }

}




// on veut afficher les quartiers d'un secteur donné e.target.feature.properties.name
 let secteurName= "Carmes";
 console.log(secteurName);
 geojson2.eachLayer(function(layer) {
   if (layer.feature.properties.name == secteurName ){
     layer.addTo(map);
     toggleLayerVisibility(map, layer);

     map.setView(shelter3.getLatLng(),15);
     //map.fitBounds(layer.getBounds());

     console.log(layer.feature.properties.parent_name);
   }




   let xhr = new XMLHttpRequest();
   xhr.addEventListener("readystatechange", onLoadProgress);
   xhr.open('GET', '/assets/js/stations-de-metro.json');
   xhr.send();

   function onLoadProgress(evt) {
       console.log(this.readyState);
       if (this.readyState === 4 && this.status === 200) {
           initMap(JSON.parse(this.responseText));
       }
   }

   function initMap(records) {
       let markerLineA = new Array();
       for (let record of records) {


        let str = record.fields.infobulle.replace('Ligne A',", <img src='/assets/images/Toulouse_line_A_symbol.svg.png' style='width:12px'> Ligne A");


           let marker = new L.Marker(
               [record.fields.geo_point_2d[0], record.fields.geo_point_2d[1]], {
               icon: L.icon({
                   title: record.fields.infobulle,
                   iconUrl: '/assets/images/Toulouse_ M _symbol.svg.png',
                   iconSize: [14, 14], // size of the icon
                   //shadowSize: [50, 64], // size of the shadow
                   iconAnchor: [0, 7] // point of the icon which will correspond to marker's location
               }),

               bounceOnAdd: false,
               bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
               bounceOnAddCallback: function () { console.log("done"); }
           }).bindTooltip("<img src='/assets/images/Toulouse_ M _symbol.svg.png' style='width:14px'><b>Station de métro: </b></br>" + str.replace('Ligne B',", <img src='/assets/images/Toulouse_line_B_symbol.svg.png' style='width:12px'> Ligne B")).addTo(map);
           if (record.fields.ligne == "A"){
               markerLineA.push(marker);
           }






       }

   }



let metroLigne3 = [
   [43.6045337 , 1.3352513], //Colomiers
   [43.6087206, 1.3541675], // Airbus  colomiers
   [43.6104526, 1.371578], //airbus saint martin
   [43.6215883, 1.3960277], // jean maga
   [43.6204417, 1.411436], // sept deniers
   [43.6199575, 1.4234189], //bd de suisse
   [43.632155, 1.4279994], //fondeyre
   [43.6355556, 1.4371334], // la vache
   [43.6267425, 1.4438159], // Lautrec
   [43.6182859, 1.4462371], //raynal
   [43.6185936, 1.4564397], //bonnefoy
   [43.6113898, 1.4556183], // matabiau
   [43.6003242, 1.4519221], // F verdier
   [43.5938279, 1.4658848], //jean rieux
   [43.591121, 1.4804068], // limayrac
   [43.5792317, 1.4833526], // l'ormeaux
   [43.572247, 1.481384], // montaudran piste des geants
   [43.5636553, 1.4921206], //montaudran innovation
   [43.5511577, 1.5051036], // institut poly
   [43.5441583, 1.5096311], // labege enova
   [43.5389174, 1.5207107] // labege cédène
]

var metropolyline = new L.Polyline(metroLigne3, {
   color: 'orange',
   weight: 3
   //smoothFactor: 1,
   //zIndexOffset: 10000
});
metropolyline.addTo(map);

metroLigne3.forEach(polylinePoint => {
   let marker = new L.Marker(
       [polylinePoint[0], polylinePoint[1]], {
       icon: L.icon({
           title: "station de metro ligne 3",
           iconUrl: '/assets/images/Toulouse_ M _symbol.svg.png',
           iconSize: [14, 14], // size of the icon
           //shadowSize: [50, 64], // size of the shadow
           iconAnchor: [0, 7] // point of the icon which will correspond to marker's location
       }),


       bounceOnAdd: false,
       bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
       bounceOnAddCallback: function () { console.log("done"); }
   }).bindTooltip("station de metro ligne 3").addTo(map);




});


   });








   var markerBus = new Array();


// les bus de toulouse
geojson3 = L.geoJson(busData, {
    style: style

});



    // on veut afficher les stations de bus d'un quartier donné



//console.log(secteurName);
geojson2.eachLayer(function(layer) {
    //console.log(layer.feature.properties.nom_log);
   //console.log(e.target.feature.properties.busStation);

    if (layer.feature.properties.name == secteurName ){

        busStations = layer.feature.properties.busStation;
        console.log(busStations)
        busStations.forEach(function(element) {
            geojson3.eachLayer(function(layer) {
            if (element == layer.feature.properties.nom_log) {

                const fontAwesomeIcon = L.divIcon({
                    html: '<i class="fas fa-circle fa-xs" style="color:black"></i>',
                    iconSize: [14, 14],
                    className: 'myDivIcon'
                  });

                let str = layer.feature.properties.conc_mode.replace('ligne_affrete','');
                let marker = new L.Marker(
                    layer.feature.properties.geo_point_2d,{
                        icon: L.icon({

                            iconUrl: '/assets/images/icons8-bus-64.png',
                            iconSize: [20, 20], // size of the icon
                            //shadowSize: [50, 64], // size of the shadow
                            iconAnchor: [10, 10] // point of the icon which will correspond to marker's location
                        }),


                    bounceOnAdd: true,
                    bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
                    bounceOnAddCallback: function () { console.log("done"); }
                }).bindTooltip("<img src='/assets/images/icons8-bus-64.png' style='width:20px'><b>Station de bus: </b></br>" + layer.feature.properties.nom_log + "</br><b>" + str.replace('bus','Ligne de bus') + "</b>: "+ layer.feature.properties.conc_ligne.replace('NCV','Navette')).addTo(map);
                markerBus.push(marker);




                }
            })

        })


    };






});








// on veut afficher les espaces verts sur tolouse






        var geojsonLayer = new L.GeoJSON.AJAX("/assets/js/espaces-verts.geojson", {local:true,
            style: style2,
            onEachFeature: function(feature, layer) {
                let str=feature.properties.ombrage.replace('T','ombragé')
                layer.bindTooltip(feature.properties.nom + "</br> "+str.replace('F',''));

              }

        } )



        geojsonLayer.on('data:progress', function() {
            console.log("geojson chargé");
            console.log(geojsonLayer);
            controlLoader.hide();
            geojsonLayer.eachLayer(function(layer) {
                var pt= layer.feature.properties.geo_point_2d.reverse();
                console.log(pt);




            // test poly = toulouse centre
                var poly = turf.polygon([
                    [
                        [1.433670306471019, 43.60230322953094], [1.430882256953293, 43.60268590786901], [1.427694068976328, 43.603180729443004], [1.423305892420607, 43.6041558988787], [1.420193426158227, 43.604881982330575], [1.4178745687829, 43.605643748046504], [1.416433147345459, 43.60632555866894], [1.414667834189876, 43.607322621321565], [1.411921477454291, 43.6090131698276], [1.41320324181712, 43.60958329279647], [1.414373808900566, 43.609922089999216], [1.415215872717813, 43.610201430698424], [1.415642336100114, 43.610326944865314], [1.417223832283153, 43.61070311313557], [1.418627897341556, 43.611018209042356], [1.419972059280072, 43.61124954810315], [1.422649628141692, 43.611650581969016], [1.425274817525706, 43.6120738408619], [1.426202583542414, 43.612202415790485], [1.427502912550045, 43.612493862648584], [1.428763015864434, 43.61277740207009], [1.429739280972094, 43.613057702896484], [1.430602174598487, 43.61334561177464], [1.431224881032523, 43.61358617966135], [1.431712529289147, 43.61380201015062], [1.432292313483664, 43.61412548658085], [1.432716670548383, 43.61439473854028], [1.433151329751905, 43.614671636433584], [1.433607056258291, 43.61493262284275], [1.434021808266369, 43.61514880592676], [1.434457853992432, 43.61533392968755], [1.435039281473549, 43.61555143859663], [1.435611321130296, 43.61569981463846], [1.436328839661434, 43.61587297635082], [1.43728704866412, 43.61606225137535], [1.438163166380936, 43.61616759709058], [1.438558662597991, 43.61619344636184], [1.439070955916394, 43.6161596554253], [1.439678239110779, 43.61604335963467], [1.440119193650722, 43.61590304910699], [1.440813175542523, 43.615650244659605], [1.441558037197858, 43.61539026292634], [1.442113572598987, 43.61525084116115], [1.442553734060546, 43.61516348940593], [1.443087314755835, 43.615098639512105], [1.443703186475422, 43.61510349255912], [1.444370333089726, 43.61516267703551], [1.445871395826638, 43.615363711896286], [1.446330134344072, 43.61542787933303], [1.446737454474911, 43.61544621658827], [1.44714512938344, 43.615441853354426], [1.44759579696486, 43.61534698964458], [1.44798334830973, 43.615206220401156], [1.448274390905519, 43.615077036919594], [1.448274367276996, 43.615076991590946], [1.448571923619489, 43.61494497804854], [1.449539602770209, 43.61449747342524], [1.450717920287553, 43.61389455020225], [1.451143579890196, 43.61364148231516], [1.451331623373161, 43.613518059153684], [1.451432957321538, 43.61344600273127], [1.45171033634963, 43.61309337056162], [1.452255302618036, 43.6121694781538], [1.452667950972887, 43.61147445131666], [1.452948840501085, 43.61088248272385], [1.453390978401, 43.61004197438595], [1.453581992554076, 43.6098041049596], [1.454122363371983, 43.60936362917126], [1.45468511807057, 43.60890536446317], [1.454816002730274, 43.60877108904114], [1.454918248816149, 43.60863658374652], [1.456185044282251, 43.60643628322179], [1.456376276513002, 43.606093382032604], [1.456907853217835, 43.60509745882551], [1.456953572723298, 43.604909524524444], [1.456960467209875, 43.60444125276333], [1.456929482053136, 43.603627344148364], [1.456872225294314, 43.60256439523574], [1.456751322575021, 43.60202132699658], [1.456420713991653, 43.60113223528113], [1.456332987109153, 43.60081175991007], [1.456337818751904, 43.59721462390627], [1.456028092065023, 43.597207489074385], [1.453703337076902, 43.596393691941756], [1.453560876728636, 43.596344334499314], [1.453904216990307, 43.59601396824569], [1.454016201805549, 43.59583603126701], [1.454021409241929, 43.5954831635315], [1.453971207517159, 43.59535693613288], [1.453747862930975, 43.595053377564085], [1.453417000780421, 43.59489185041471], [1.453010916933784, 43.594798795685556], [1.452381050990242, 43.59478631209227], [1.451915112059174, 43.59495581611304], [1.451582747180598, 43.59515946239207], [1.451295358725803, 43.59534882050632], [1.451079509253207, 43.59547144791218], [1.449029447708024, 43.59478704369161], [1.446837126899293, 43.593979887755154], [1.444581777280139, 43.59320203496943], [1.444186943881103, 43.59300040547515], [1.443842118364312, 43.592874950953835], [1.443136895375062, 43.59262382898169], [1.442293791557216, 43.59228023521653], [1.441811460358367, 43.59225108313515], [1.440759875765688, 43.59234260637166], [1.44065001966016, 43.59298294076315], [1.440038784962947, 43.59372975867918], [1.43945103133728, 43.593963448104894], [1.438056669815558, 43.592426916169345], [1.436791729081104, 43.592527078786006], [1.437620999668035, 43.59343632668181], [1.438516918832828, 43.594627991257816], [1.438979005579795, 43.59567144352569], [1.439203307935697, 43.596598540565424], [1.439225440700947, 43.59772461421206], [1.439093099996644, 43.59864887466756], [1.438804105877507, 43.599340090002364], [1.438317266656296, 43.600028802647216], [1.437710651738581, 43.600631398103005], [1.436867524356803, 43.60120278582813], [1.43558655100165, 43.601799066514474], [1.433670306471019, 43.60230322953094]
                    ]
                ]);
                console.log(turf.booleanPointInPolygon(pt, poly));
                 if (turf.booleanPointInPolygon(pt, poly)){

                map.addLayer(layer);
                }
            });
//= true




          } );


// on veut afficher les créches sur tolouse


let xhrGarderie = new XMLHttpRequest();
xhrGarderie.addEventListener("readystatechange", onLoadProgress);
xhrGarderie.open('GET', '/assets/js/creches.json');
xhrGarderie.send();

function onLoadProgress(evt) {
    console.log(this.readyState);
    if (this.readyState === 4 && this.status === 200) {
        initMapGarderie(JSON.parse(this.responseText));

    }
}

function initMapGarderie(garderies) {

    console.log(garderies)
    for (let garderie of garderies) {




        let markerGarderie = new L.Marker(
            [garderie.fields.geo_point_2d[0], garderie.fields.geo_point_2d[1]],{
                icon: L.icon({
                    iconUrl: '/assets/images/icons8-pacifier-64.png',
                    iconSize: [20, 20], // size of the icon
                    //shadowSize: [50, 64], // size of the shadow
                    iconAnchor: [10, 10] // point of the icon which will correspond to marker's location
                }),
            bounceOnAdd: false,
            bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
            bounceOnAddCallback: function () { console.log("done"); }
            }).bindTooltip("<img src='/assets/images/icons8-pacifier-64.png' class='rounded-4' style='width:20px'><b>" + garderie.fields.nom + "</b>").addTo(map);







    }

}

}