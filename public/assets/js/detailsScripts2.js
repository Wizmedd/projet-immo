var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
  return new bootstrap.Popover(popoverTriggerEl)
})

var el = document.getElementById('yourLinkID');
console.log(el);
document.getElementById('yourLinkID').onclick = function() {

    var newEl = document.createElement('a');
    newEl.innerHTML = '';

    // replace el with newEL
    el.parentNode.replaceChild(newEl, el); }

window.onload = () => {

    geojson2 = L.geoJson(quatorsData, {


    });


    var selectedLayerId = null;

    let map = L.map('map',{ fullscreenControl: true, fullscreenControlOptions: {
        position: 'topright'
      }, scrollWheelZoom: false, zoomControl: false }).setView([43.600000, 1.433333], 12);

    L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        maxZoom: 18,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        minZoom: 1,
        name: 'tiles',
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: '©  - <a href="https://data.toulouse-metropole.fr/pages/accueil/">Data Toulouse Métropole</a>'
    }).addTo(map);

// events are fired when entering or exiting fullscreen.
map.on('enterFullscreen', function(){
    console.log('entered fullscreen');
    map.scrollWheelZoom.enable();
  });

  map.on('exitFullscreen', function(){
    console.log('exited fullscreen');
    map.scrollWheelZoom.disable();
  });

    var controlLoader = L.control.loader().addTo(map);

    controlLoader.show();

    L.streetView().addTo(map);




    var scale = L.control.scale({
        position: 'bottomleft',
        imperial:false
    }); // Creating scale control
         scale.addTo(map); // Adding scale control to the map



         const DetailLegend = L.control({position: 'bottomright'});

         DetailLegend.onAdd = function (map) {

             const div = L.DomUtil.create('div', 'info detailLegend d-none d-sm-block lh-sm');

             const labels = [];



            labels.push(`<img style="width:20px" src="/assets/images/icons8-ingredients-64.png"> Marché</br><img style="width:20px" src="/assets/images/icons8-pacifier-64.png"> Crèche </br><img style="width:20px" src="/assets/images/icons8-babys-room-64.png"> Ecole maternelle </br><img style="width:20px" src="/assets/images/icons8-books-64.png"> Ecole primaire`);
// <i style="  border-radius: 3px; height: 17px;width:17px; background:rgb(0,255,0); border: 2px solid green"></i> Espace vert </br>

             div.innerHTML = labels.join('<br>');
             return div;
         };

         DetailLegend.addTo(map);

    function style2(feature) {
        return {
            weight: 2,
            opacity: 1,
            color: 'green',

            fillOpacity: 0.7,
            fillColor: 'rgb(0,255,0)'
        };
    }


    var sector="";

    Array.from(document.querySelectorAll('.js-marker')).forEach((item) => {
        let lat= item.dataset.lat;
        let lng= item.dataset.lng;

        let shelter3 = L.marker([item.dataset.lat, item.dataset.lng], {
            icon: L.icon({
                title: "title",
                iconUrl: '/assets/images/icons8-location-64.png',
                iconSize: [40, 40], // size of the icon
                //shadowSize: [50, 64], // size of the shadow
                iconAnchor: [20, 40] // point of the icon which will correspond to marker's location
            }),
            bounceOnAdd: true,
            bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
        }).bindTooltip("<div class='text-center fw-bold'>Votre recherche</div>", {
            sticky: true // If true, the tooltip will follow the mouse.
          }).addTo(map);


        //map.setView(shelter3.getLatLng(),15);
        geojson2.eachLayer(function(layer) {

            var pt= [lng, lat];
                    console.log(pt);


            let coord  =   layer.feature.geometry.coordinates;
                    console.log(layer.feature.geometry.coordinates)
                // test poly = toulouse centre
                    var poly = turf.polygon(coord);
                    console.log(turf.booleanPointInPolygon(pt, poly));

                    if (turf.booleanPointInPolygon(pt, poly)){
                    layer.setStyle({

                        dashArray: "15,15",
                        dashSpeed: -30,

                    });

                    map.addLayer(layer);
                    map.fitBounds(layer.getBounds());
                    //map.panTo(shelter3.getLatLng());
                    //var latLngs = [ shelter3.getLatLng() ];
                    //var markerBounds = L.latLngBounds(latLngs);
                    //map.fitBounds(markerBounds);

                    sector = coord;

                    // on insert les info du quartier dans le DOM
    const elem = document.getElementById('quatorCard');
    elem.innerHTML = "<img class='img-fluid' src='/assets/images/quators/" + layer.feature.properties.image_src + "'></img>"

    const desc = document.getElementById('desc');
    desc.innerHTML =  layer.feature.properties.desc;

    const price = document.getElementById('price');
    price.innerHTML =  layer.feature.properties.density+ " €/m²";

    const percents = document.getElementsByClassName('js-percent');
                const moy = document.getElementById('js-moy');
                console.log("moy");
                console.log(moy);
                console.log(percents);

                const deals = document.getElementsByClassName('js-deal');

                const arrows = document.getElementsByClassName('js-arrow');

        if (moy.textContent.replace("€/m²"," ")/ layer.feature.properties.density > 1.20){

            for(var i = 0; i < deals.length; i++) {
                deals[i].textContent = deals[i].textContent.replace("Bonne affaire:","Au-dessus du marché:");
                percents[i].innerHTML = "+ "+ Math.floor((moy.textContent.replace("€/m²"," ")/ layer.feature.properties.density - 1)*100)+ " %";
                percents[i].classList.remove('bg-success');
                percents[i].classList.add('bg-danger');
                arrows[i].innerHTML = arrows[i].innerHTML.replace("<i class=\"fas fa-level-up-alt fa-lg\"></i>","<i class=\"fas fa-level-down-alt fa-lg\"></i>");
                arrows[i].classList.add('text-danger');
                arrows[i].classList.remove('text-success');
            }


        }
        else if (moy.textContent.replace("€/m²"," ")/ layer.feature.properties.density > 1){
              for(var i = 0; i < deals.length; i++) {
                deals[i].textContent = deals[i].textContent.replace("Bonne affaire:","Offre équitable:");
                percents[i].innerHTML = "+ "+ Math.floor((moy.textContent.replace("€/m²"," ")/ layer.feature.properties.density - 1)*100)+ " %";
                percents[i].classList.remove('bg-success');
                percents[i].classList.add('bg-warning');
                arrows[i].innerHTML = arrows[i].innerHTML.replace("<i class=\"fas fa-level-up-alt fa-lg\"></i>","<i class=\"fas fa-long-arrow-alt-right fa-lg\"></i>");
                arrows[i].classList.add('text-warning');
                arrows[i].classList.remove('text-success');
            }
        }
        else
            for(var i = 0; i < deals.length; i++) {
            percents[i].innerHTML = "- " + Math.floor((1 - moy.textContent.replace("€/m²"," ")/ layer.feature.properties.density)*100)+ " %";
            }

    const elements = document.getElementsByClassName("js-quator");

for(var i = 0; i < elements.length; i++) {
    elements[i].innerHTML = "<i class='fas fa-map-pin'></i>&nbsp" + layer.feature.properties.name;
}

const elements2 = document.getElementsByClassName("js-city");

for(var i = 0; i < elements2.length; i++) {
    elements2[i].innerHTML = "<i class='fas fa-map-marked-alt'></i>&nbsp" + layer.feature.properties.parent_name ;
}

//on inset un pin's au centre du quartier
  //map.fitBounds(layer.getBounds());

  console.log(layer.feature.properties.parent_name);


L.marker(layer.getCenter(),{
    icon: L.icon({

        iconUrl: '/assets/images/Pink-Map-Pin-png-hd.png',
        iconSize: [30, 30], // size of the icon
        //shadowSize: [50, 64], // size of the shadow
        iconAnchor: [0, 30] // point of the icon which will correspond to marker's location
    }),

    bounceOnAdd: false,
    bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
    bounceOnAddCallback: function () { console.log("done"); }
    }).bindTooltip("<div class='text-center'>Centre du quartier</br>" + layer.feature.properties.name+"</div>", {
        sticky: true // If true, the tooltip will follow the mouse.
      }).addTo(map);



                    }

        })










    })



    let metroLigneA= [ [43.57014083141419, 1.3922746252352554], //basso
    [43.566070319723806, 1.3979818493171199],//bellefon
    [43.57092682506198, 1.4017298110937741],//reynerie
    [43.57468748248248, 1.4020013383230499],//mirail
    [43.58000054513937, 1.41231775730557],//baga
    [43.583431566925086, 1.4151007899581522],//mermoz
    [43.58757348788524, 1.4184535231606714],//fontaine les
    [43.59339293216814, 1.4185384994463353],//arenes
    [43.596404401428096, 1.423026771309233],//patte doie
    [43.597992727342124, 1.431706193747511],//sait cyp
    [43.60001627686981, 1.4439367973705772],//esquirol
    [43.60422253107123, 1.4450327782779084],//capitol
    [43.606192750989536, 1.4496318655113922],//jeanjo
    [43.61075751258499, 1.4551030230585125],//marengo
    [43.61531728374124, 1.4634370441539155], //jolimont
    [43.61997905927524, 1.4696207010833544],//roseraie
    [43.62434091079181, 1.4767514498118757],//argoulet
    [43.62911025887068, 1.4827692025966492],//balma
    ]

    let metroLigneB= [ [43.55576764710326, 1.4763720419050197], //ramonville
    [43.560955377123996, 1.4632149860625445],//université
    [43.568177080110424, 1.4644929387727335],//faculté
    [43.574779606695515, 1.4617559708574162],//rangruil
    [43.57979237408453, 1.458931457220792],//saouzelong
    [43.58042037801212, 1.450081838286977],//st agne
    [43.579803867528575, 1.4420802003999509],//empalot
    [43.58635889716109, 1.44714575039516],//st mich
    [43.59233941114831, 1.4446424450750757],//palais
    [43.59761946536058, 1.4455965424232315],//carmes
    [43.600694301731906, 1.4521694769314244],//francois
    [43.60571920700635, 1.4487245279013112],//jeanjo
    [43.609011860597064, 1.4451953264526656],//jeanne
    [43.61058045988207, 1.4355289917804777],//compans
    [43.615424128473016, 1.4344206853532684],//canal
    [43.620270202924566, 1.435887610411194], //minimes
    [43.62659649428339, 1.4339707297204713],//barriere
    [43.63384922318083, 1.4357351684573365],//la vache
    [43.63800110310026, 1.4444395484427033],//3 cocus
    [43.64052310426048, 1.4525343502687176]
    ]

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



    // on veut afficher les quartiers d'un secteur donné e.target.feature.properties.name
 //let secteurName= e.target.feature.properties.parent_name;
 //console.log("test"+secteurName);








    var metroAPolyline = new L.Polyline(metroLigneA, {
        color: 'red',
        weight: 3
        //smoothFactor: 1,
        //zIndexOffset: 10000
    });
    metroAPolyline.bindTooltip("Métro Ligne A </br> Basso Cambo - Balma Gramont", {
        sticky: true // If true, the tooltip will follow the mouse.
      }).addTo(map);
    metroAPolyline.addTo(map);

    var metroBPolyline = new L.Polyline(metroLigneB, {
        color: 'yellow',
        weight: 3
        //smoothFactor: 1,
        //zIndexOffset: 10000
    })
    metroBPolyline.bindTooltip("Métro Ligne B </br> Borderouge - Ramonville", {
        sticky: true // If true, the tooltip will follow the mouse.
      }).addTo(map);
    metroAPolyline.addTo(map);





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

       for (let record of records) {


        let str = record.fields.infobulle.replace('Ligne A',", <img src='/assets/images/Toulouse_line_A_symbol.svg.png' style='width:12px'> Ligne A");


           let marker = new L.Marker(
               [record.fields.geo_point_2d[0], record.fields.geo_point_2d[1]], {
               icon: L.icon({
                   title: record.fields.infobulle,
                   iconUrl: '/assets/images/Toulouse_ M _symbol.svg.png',
                   iconSize: [14, 14], // size of the icon
                   //shadowSize: [50, 64], // size of the shadow
                   iconAnchor: [7, 7] // point of the icon which will correspond to marker's location
               }),

               bounceOnAdd: false,
               bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
               bounceOnAddCallback: function () { console.log("done"); }
           }).bindTooltip("<img src='/assets/images/Toulouse_ M _symbol.svg.png' style='width:14px'><b>Station de métro: </b></br>" + str.replace('Ligne B',", <img src='/assets/images/Toulouse_line_B_symbol.svg.png' style='width:12px'> Ligne B")).addTo(map);







       }

   }




    function createGarderieMarker(feature, latlng) {
        return L.marker(latlng, {icon: L.icon({
            iconUrl: '/assets/images/icons8-pacifier-64.png',
            iconSize: [20, 20], // size of the icon
            //shadowSize: [50, 64], // size of the shadow
            iconAnchor: [10, 10] // point of the icon which will correspond to marker's location
        }),
        });
    }






    var geojsonLayer2 = new L.GeoJSON.AJAX("/assets/js/creches.geojson", {local:true,
        pointToLayer: createGarderieMarker,
        onEachFeature: function(feature, layer) {

            layer.bindTooltip("<img src='/assets/images/icons8-pacifier-64.png' class='rounded-4' style='width:20px'>"+ "<b>" + feature.properties.types +"</b></br>" + feature.properties.nom.replace(feature.properties.types,''));

          }


    } )

    geojsonLayer2.on('data:loaded', function() {
        console.log("geojson2 chargé");
        console.log(geojsonLayer2);

        geojsonLayer2.eachLayer(function(layer) {map.addLayer(layer);})

    })




    var geojsonLayer = new L.GeoJSON.AJAX("/assets/js/espaces-verts.geojson", {local:true,style:style2,
        onEachFeature: function(feature, layer) {
            let str=feature.properties.ombrage.replace('T','ombragé')
            layer.bindTooltip("<div class=text-center><img src='/assets/images/icons8-oak-tree-64.png' class='rounded-4' style='width:20px'><b>Espace vert </b></br>"+feature.properties.nom + "</br> "+str.replace('F','')+ ", "+ Math.floor( feature.properties.surface_m2)+ " m²</div>");

          }

    } )



    geojsonLayer.on('data:loaded', function() {
        console.log("geojson chargé");
        console.log(geojsonLayer);

        geojsonLayer.eachLayer(function(layer) {
            var pt= layer.feature.properties.geo_point_2d.reverse();
            console.log(pt);




        // test poly = toulouse centre
            var poly = turf.polygon(sector);
            console.log(turf.booleanPointInPolygon(pt, poly));
            if (turf.booleanPointInPolygon(pt, poly)){

            map.addLayer(layer);
            }
        });






    });

    function createMarketMarker(feature, latlng) {
        return L.marker(latlng, {icon: L.icon({
            iconUrl: '/assets/images/icons8-ingredients-64.png',
            iconSize: [20, 20], // size of the icon
            //shadowSize: [50, 64], // size of the shadow
            iconAnchor: [10, 10] // point of the icon which will correspond to marker's location
        }),
        });
    }






    var geojsonLayer3 = new L.GeoJSON.AJAX("/assets/js/marches-couverts-et-de-plein-vent.geojson", {local:true,
        pointToLayer: createMarketMarker,
        onEachFeature: function(feature, layer) {

            layer.bindTooltip("<img src='/assets/images/icons8-ingredients-64.png' class='rounded-4' style='width:20px'><b> Marché: </b>" + feature.properties.nom + "</br><b>"  + "</b> "+ feature.properties.adresse + "</br>" + feature.properties.jours_de_tenue + "</br>" + feature.properties.type);

          }


    } )

    geojsonLayer3.on('data:loaded', function() {
        console.log("geojson3 chargé");
        console.log(geojsonLayer3);

        geojsonLayer3.eachLayer(function(layer) {map.addLayer(layer);})

    })

    function createSchoolMarker(feature, latlng) {
        return L.marker(latlng, {icon: L.icon({
            iconUrl: '/assets/images/icons8-babys-room-64.png',
            iconSize: [20, 20], // size of the icon
            //shadowSize: [50, 64], // size of the shadow
            iconAnchor: [12, 12] // point of the icon which will correspond to marker's location
        }),
        });
    }






    var geojsonLayer4 = new L.GeoJSON.AJAX("/assets/js/ecoles-maternelles-publiques.geojson", {local:true,
        pointToLayer: createSchoolMarker,
        onEachFeature: function(feature, layer) {

            layer.bindTooltip("<img src='/assets/images/icons8-babys-room-64.png' class='rounded-4' style='width:20px'><b> Ecole maternelle: </b></br>" + feature.properties.ecole + "</br>");

          }


    } )

    geojsonLayer4.on('data:loaded', function() {
        console.log("geojson4 chargé");
        console.log(geojsonLayer4);

        geojsonLayer4.eachLayer(function(layer) {map.addLayer(layer);})

    })

    function createEltSchoolMarker(feature, latlng) {
        return L.marker(latlng, {icon: L.icon({
            iconUrl: '/assets/images/icons8-books-64.png',
            iconSize: [20, 20], // size of the icon
            //shadowSize: [50, 64], // size of the shadow
            iconAnchor: [12, 12] // point of the icon which will correspond to marker's location
        }),
        });
    }

    var geojsonLayer5 = new L.GeoJSON.AJAX("/assets/js/ecoles-elementaires-publiques.geojson", {local:true,
        pointToLayer: createEltSchoolMarker,
        onEachFeature: function(feature, layer) {

            layer.bindTooltip("<img src='/assets/images/icons8-books-64.png' class='rounded-4' style='width:20px'><b> Ecole Elémentaire: </b></br>" + feature.properties.ecole + "</br>");

          }


    } )

    geojsonLayer5.on('data:loaded', function() {
        console.log("geojson5 chargé");
        console.log(geojsonLayer5);

        geojsonLayer5.eachLayer(function(layer) {map.addLayer(layer);})
        controlLoader.hide();

    })

let xhrWiki = new XMLHttpRequest();
let url = "https://fr.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=5&gsrsearch='Quartier_des_carmes'";


// Open a new connection, using the GET request on the URL endpoint
// Providing 3 arguments (GET/POST, The URL, Async True/False)
xhrWiki.open('GET', url, true);

// Once request has loaded...
xhrWiki.onload = function() {
    // Parse the request into JSON
    let data = JSON.parse(this.response);

    // Log the data object
    console.log(data);

    // Log the page objects
    console.log(data.query.pages)

    // Loop through the data object
    // Pulling out the titles of each page
    for (let i in data.query.pages) {
        console.log(data.query.pages[i].title);
    }
}

// Send request to the server
xhrWiki.send();


}