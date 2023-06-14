/**
 * @property {HTMLElement} pagination
 * @property {HTMLElement} content
 * @property {number} page
 * @property {boolean} moreNav


 */
class HomeFilter {

    /**
     * @param {HTMLElement|null} element
     */
    constructor(element) {

        if (element === null) {
            console.log('je suis null')
            return
        }
        console.log('je me construis')

        this.pagination = element.querySelector('.js-pagination');
        this.content = element.querySelector('.js-content');
        this.page = parseInt(1);
        this.moreNav = this.page === 1;
        // console.log(this.pagination)

        this.bindEvents()
    }

    /**
     * Ajoute les comportements aux différents éléments
     */
    bindEvents() {

        if (this.moreNav) {
            this.pagination.innerHTML = '<div class="text-center"><button class="btn-lg btn-primary mb-3">Voir plus</button></div>'
            this.pagination.querySelector('button').addEventListener('click', this.loadMore.bind(this))
        } else {
            this.pagination.addEventListener('click', aClickListener)
        }

        const aClickListener = e => {
            console.log('aClickListener');
            if (e.target.tagName === 'A') {
                console.log('aClickListener');
                e.preventDefault();
                this.loadUrl(e.target.getAttribute('href'));

            }
        }

        // this.pagination.addEventListener('mouseover', aClickListener)
    }

    async loadMore() {
        console.log('more');
        const button = this.pagination.querySelector('button')
        button.setAttribute('disabled', 'disabled')
        this.page++
        const url = new URL(window.location.href)
        const params = new URLSearchParams(url.search)
        params.set('page', this.page)
        console.log(params.toString());
        await this.loadUrl(url.pathname + '?' + params.toString(), true)
        button.removeAttribute('disabled')
    }






    async loadUrl(url, append = false) {
        console.log('LoadUrl');
        this.showLoader()
        const params = new URLSearchParams(url.split('?')[1] || '')
        params.set('ajax', 1)
        const response = await fetch(url.split('?')[0] + '?' + params.toString(), {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        if (response.status >= 200 && response.status < 300) {
            console.log('on y est')
            const data = await response.json()
            this.content.innerHTML += data.content
            this.updatePrices(data)
            if (!this.moreNav) {
                this.pagination.innerHTML = data.pagination
            } else if (this.page === data.pages) {
                this.pagination.style.display = 'none';
            } else {
                this.pagination.style.display = null;
            }


            history.replaceState({}, '');
        } else {
            console.error(response)
        }
        this.hideLoader()

    }

    showLoader() {
        // Code à écrire




    }

    hideLoader() {
        // Code à écrire



    }

    updatePrices({ min, max }) {

        const slider = document.getElementById('price-slider')
        if (slider === null) {
            return
        }
        slider.noUiSlider.updateOptions({
            range: {
                min: [min],
                max: [max]
            }
        })
    }

}



var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
})
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})

function updateValue(event) {

    document.getElementById("surface").innerText = event.value;
    //console.log('update de la surface')
}
var myArray = { "tag with spaces": 300 };
var cities = ["31000", "Aigrefeuille", "Aucamville", "Aussonne", "Balma", "Beaupuy", "Beauzelle", "Blagnac", "Brax", "Bruguières", "Colomiers", "Cornebarrieu", "Cugnaux", "Drémil-Lafage", "Fenouillet", "Flourens", "Fonbeauzard", "Gagnac-sur-Garonne", "Gratentour", "L&#039;Union", "Launaguet", "Lespinasse", "Mondonville", "Mondouzil", "Mons", "Montrabé", "Pibrac", "Pin-Balma", "Quint-Fonsegrives", "Saint-Alban", "Saint-Jean", "Saint-Jory", "Saint-Orens-de-Gameville", "Seilh", "Toulouse", "Tournefeuille", "Villeneuve-Tolosane"];

autocomplete(document.getElementById("q"), cities);

new HomeFilter(document.querySelector('.js-paginate'));
console.log(document.querySelector('.js-paginate'))
console.log('filtre crée')
const slider = document.getElementById('price-slider')

if (slider) {
    const min = document.getElementById('minPrice')
    const max = document.getElementById('maxPrice')
    const minValue = Math.floor(parseInt(slider.dataset.min, 10) / 10) * 10
    const maxValue = Math.ceil(parseInt(slider.dataset.max, 10) / 10) * 10
    const range = noUiSlider.create(slider, {
        start: [min.value || minValue, max.value || maxValue],
        connect: true,
        step: 5000,
        range: {
            'min': minValue,
            'max': maxValue
        }
    })
    range.on('slide', function (values, handle) {
        if (handle === 0) {
            min.value = Math.round(values[0])
        }
        if (handle === 1) {
            max.value = Math.round(values[1])
        }
    })
    range.on('end', function (values, handle) {
        if (handle === 0) {
            min.dispatchEvent(new Event('change'))
        } else {
            max.dispatchEvent(new Event('change'))
        }
    })
}
var isAuthenticated = "";
var userTry = 0;
document.addEventListener('DOMContentLoaded', function () {
    var userRating = document.querySelector('.js-user-rating');
    isAuthenticated = userRating.dataset.isAuthenticated;
    var user = JSON.parse(userRating.dataset.user);


    console.log("user conected ?");
    console.log(isAuthenticated);
    console.log(user);


    // or with jQuery
    //var isAuthenticated = $('.js-user-rating').data('isAuthenticated');
});

(function () {
    var proxied = window.alert;
    window.alert = function () {
        modaldiv = $('<div id="myModal" class="modal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true"><div class="modal-dialog"><div class="modal-content text-center"><div class="modal-header text-center"><h5 id="myModalTitle" class="modal-title w-100"><i class="fab fa-fly fa-2x text-primary"></i> Connexion requise</h5><button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button></div><div class="modal-body"><p>Modal body text goes here.</p></div><div class="modal-footer"><a class="btn btn-primary" href="/connexion">Se connecter</a><button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fermer</button></div></div></div></div>');
        modaldiv.find(".modal-body").text(arguments[0]);
        modal = new bootstrap.Modal(modaldiv);
        modal.show();
    };
})();


//alert('moo');
//alert('cow');


// Variables globales
let = zipcode = ""



window.onload = () => {







    /**
     * Cette fonction effectue un appel Ajax vers une url et retourne une promesse
     * @param {string} url
     */
    function ajaxGet(url) {
        return new Promise(function (resolve, reject) {
            // Nous allons gérer la promesse
            let xmlhttp = new XMLHttpRequest();

            xmlhttp.onreadystatechange = function () {
                // Si le traitement est terminé
                if (xmlhttp.readyState == 4) {
                    // Si le traitement est un succès
                    if (xmlhttp.status == 200) {
                        // On résoud la promesse et on renvoie la réponse
                        resolve(xmlhttp.responseText);
                    } else {
                        // On résoud la promesse et on envoie l'erreur
                        reject(xmlhttp);
                    }
                }
            }

            // Si une erreur est survenue
            xmlhttp.onerror = function (error) {
                // On résoud la promesse et on envoie l'erreur
                reject(error);
            }

            // On ouvre la requête
            xmlhttp.open('GET', url, true);

            // On envoie la requête
            xmlhttp.send(null);
        })
    }

    // test de la librarie turf


    /* var pt = turf.point([-77, 44]);
    var poly = turf.polygon([[
      [-81, 41],
      [-81, 47],
      [-72, 47],
      [-72, 41],
      [-81, 41]
    ]]);

    console.log(turf.booleanPointInPolygon(pt, poly));
    //= true
    */







    //test affichage prix/m2
    var selectedLayerId = null;



    let map = L.map('map', { scrollWheelZoom: false, zoomControl: false }).setView([43.600000, 1.433333], 12);



    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 18,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        minZoom: 1,
        name: 'tiles',
        // Il est toujours bien de laisser le lien vers la source des données
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, and the GIS User Community'
    }).addTo(map);



    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);

    var scale = L.control.scale({
        position: 'bottomright'
    }); // Creating scale control
    scale.addTo(map); // Adding scale control to the map








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

    let allStations = new Array();

    function initMap(records) {
        let markerLineA = new Array();

        for (let record of records) {
            console.log(record);
            // console.log(record.fields.geo_point_2d[1]);


            console.log(record.fields.infobulle + ", [" + record.fields.geo_point_2d[0] + ", " + record.fields.geo_point_2d[1] + "]")
            let marker = new L.Marker(
                [record.fields.geo_point_2d[0], record.fields.geo_point_2d[1]], {
                icon: L.icon({
                    title: record.fields.infobulle,
                    iconUrl: '/assets/images/Toulouse_ M _symbol.svg.png',
                    iconSize: [12, 12], // size of the icon
                    //shadowSize: [50, 64], // size of the shadow
                    iconAnchor: [6, 6] // point of the icon which will correspond to marker's location
                }),

                bounceOnAdd: false,
                bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
                bounceOnAddCallback: function () { console.log("done"); }
            }).bindTooltip("Station de métro: </br>" + record.fields.infobulle.replace('Ligne C', ', Ligne TER')).addTo(map);
            if (record.fields.ligne == "B") {
                markerLineA.push(marker);
            }

            allStations.push([record.fields.infobulle, record.fields.geo_point_2d[0], record.fields.geo_point_2d[1]]);






        }
        console.log("markerLineA");
        console.log(markerLineA);


    }

    var geojsonLayer = new L.GeoJSON.AJAX("/assets/js/espaces-verts.geojson", {
        local: true, style: style2,
        onEachFeature: function (feature, layer) {
            let str = feature.properties.ombrage.replace('T', 'ombragé');
            layer.bindTooltip("<div class=text-center><img src='/assets/images/icons8-oak-tree-64.png' class='rounded-4' style='width:20px'><b>Espace vert </b></br>" + feature.properties.nom + "</br> " + ((feature.properties.surface_m2 > 10000) ? Math.floor(feature.properties.surface_m2 / 10000) + " ha " : ((feature.properties.surface_m2 > 1000) ? Math.floor(feature.properties.surface_m2 / 1000) + " km² " : Math.floor(feature.properties.surface_m2) + " m² ")) + str.replace('F', '') + "</div>");






        }



    })

    geojsonLayer.on('data:loaded', function () {
        console.log("geojson chargé");
        console.log(geojsonLayer);







    });

    let metroLigneA = [[43.57014083141419, 1.3922746252352554], //basso
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

    let metroLigneB = [[43.55576764710326, 1.4763720419050197], //ramonville
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
        [43.6045337, 1.3352513], //Colomiers
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
        color: 'rgb(19,165,56)',
        weight: 3
        //smoothFactor: 1,
        //zIndexOffset: 10000
    });
    metropolyline.addTo(map);

    var metroAPolyline = new L.Polyline(metroLigneA, {
        color: 'red',
        weight: 3
        //smoothFactor: 1,
        //zIndexOffset: 10000
    });
    metroAPolyline.addTo(map);

    var metroBPolyline = new L.Polyline(metroLigneB, {
        color: 'yellow',
        weight: 3
        //smoothFactor: 1,
        //zIndexOffset: 10000
    });
    metroBPolyline.addTo(map);

    metroLigne3.forEach(polylinePoint => {
        let marker = new L.Marker(
            [polylinePoint[0], polylinePoint[1]], {
            icon: L.icon({
                title: "station de metro ligne C",
                iconUrl: '/assets/images/Toulouse_ M _symbol.svg.png',
                iconSize: [12, 12], // size of the icon
                //shadowSize: [50, 64], // size of the shadow
                iconAnchor: [6, 6] // point of the icon which will correspond to marker's location
            }),


            bounceOnAdd: false,
            bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
            bounceOnAddCallback: function () { console.log("done"); }
        }).bindTooltip("station de metro ligne 3").addTo(map);




    });


    // control that shows state info on hover
    var info = L.control();

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    info.update = function (props) {

        this._div.innerHTML = (props ?
            (props.parent_name ?
                '<b>Secteur: </b>' + '<h4>' + props.parent_name + '</h4>' + '<b>Quartier: </b>' + '<h4>' + props.name + '</h4>' : '<b>Secteur: </b>' + '<h4>' + props.name + '</h4>')
            + '<b>Prix moyen: </b>' + props.density + ' € / m<sup>2</sup>' : 'Survolez un secteur');

    };

    info.addTo(map);

    //const legend = L.control({position: 'bottomright'});

    // control that shows left panel on hover
    var panel = L.control({ position: 'topleft' });

    panel.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'panel');
        this.update();
        return this._div;
    };

    panel.update = function (props) {



        this._div.innerHTML = (
            this._div.innerHTML = (props ?
                (props.image_src ?
                    "<img src='/assets/images/quators/" + props.image_src + "'style='height: 200px;width:300px'></br>" + "<h4>" + props.name + "</h4>" + "<h6><b>" + "Vivre dans le quartier:" + "</b></h6>" +
                    "<p style='width: 300px'>" + props.desc + "</p>" +
                    "<h6><b>" + "Transports: " + "</b></h6>" +
                    "<p style='width: 300px'>" + "Station de métro: </br>" + props.metro + "</p>" : 'Survolez un quartier')
                : 'Survolez un quartier')

            //(props.image_src ? "<img src='/assets/images/quators/" + props.image_src + "'>" : "Sinon")
            /*
            "<img src='/assets/images/quators/carmes.jpg' style='width: 300px'>"+ "</br>" + "<h4>" +"Carmes"+ "</h4>" + "<h6><b>"+"Vivre dans le quartier:"+"</b></h6>"+
            "<p style='width: 300px'>" + "Au cœur de Toulouse, le quartier des Carmes séduit pour son calme. On y retrouve de belles demeures, d’anciens hôtels particuliers et des appartements de cachet. " + "</p>"+
            "<h6><b>"+"Transports: "+"</b></h6>"+
            "<p style='width: 300px'>"+"Station de métro: </br>"+"<img src='/assets/images/Toulouse_ M _symbol.svg.png'>"+" Carmes,"+"<img src='/assets/images/Toulouse_line_B_symbol.svg.png'>"+" ligne B.</br> Lignes de bus: </br>" + "Linéo L4; Bus 44; Navette centre ville." + "</p>"+
            "<h6><b>"+"Marché: "+"</b></h6>"+
            "<p style='width: 300px'>"+"marché couvert de la place des Carmes, formidable atout qui offre des produits frais et variés: primeurs, boulangers, charcutiers, fromagers, bouchers, traiteurs, poissonniers et cavistes y sont présents chaque matin du mardi au dimanche."+ "</p>"
            */

        );

    };

    panel.addTo(map);


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

    function highlightFeature(e) {



        if (selectedLayerId !== e.target._leaflet_id) {
            var layer = e.target;
            layer.setStyle({
                weight: 7,
                color: 'rgb(255,223,0)',//color: or rgb(255,223,0)
                dashArray: "1",
                dashSpeed: 0,
                fillOpacity: 0

            });

            if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                //layer.bringToFront();
            }

            info.update(layer.feature.properties);
            panel.update(layer.feature.properties);
        }


    }

    var geojson;
    var geojson2;
    var geojson3;















    function resetHighlight(e) {
        if (selectedLayerId !== e.target._leaflet_id) {
            geojson.resetStyle(e.target);
            geojson2.resetStyle(e.target);
            info.update();
            panel.update();
        }

    }



    function zoomToFeature(e) {
        map.fitBounds(e.target.getBounds());
        toggleLayerVisibility(map, e.target);
        info.update(e.target.feature.properties);
        geojson2.addTo(map);

    }
    var shelterMarkers = new L.FeatureGroup();


    function zoomToSector(e) {
        //sessionStorage.setItem('userTry', userTry);
        let nb = sessionStorage.getItem('userTry');
        if (!nb) {
            sessionStorage.setItem('userTry', 0);
        }


        userTry++;

        console.log("connected ? " + isAuthenticated);
        if ((isAuthenticated == 'true' || nb < 5)) {

            console.log(isAuthenticated + userTry);
            nb = sessionStorage.setItem('userTry', userTry);






            //o enlève tous les anciens marker
            if (shelterMarkers != null) {
                shelterMarkers.eachLayer(function (marker) {
                    map.removeLayer(marker);

                })
            }


            // on veut enlever tous les layers des quartiers si on a déjà cliqué sur un secteur
            geojson2.eachLayer(function (layer) {
                map.removeLayer(layer);

            })
            // on veut enlever tous les layers des secteurs si on a déjà cliqué sur un secteur et les rajouter
            geojson.eachLayer(function (layer) {
                map.removeLayer(layer);
                map.addLayer(layer);
                toggleLayerVisibility(map, layer);
            })

            // on veut afficher les quartiers d'un secteur donné
            let secteurName = e.target.feature.properties.name;
            console.log(secteurName);
            geojson2.eachLayer(function (layer) {
                if (layer.feature.properties.parent_name == secteurName) {
                    layer.addTo(map);
                    toggleLayerVisibility(map, layer);
                    console.log(layer.feature.properties.parent_name);
                }




            });

            // On récupère la distance choisie
            let zipcode = e.target.feature.properties.zipcode;
            // On vérifie si un code postal a été saisie
            if (zipcode != "") {
                // On envoie les données au serveur
                ajaxGet(`/loadAds.php?zipcode=${zipcode}`).then(reponse => {
                    // On efface toutes les couches de la carte sauf les tuiles
                    map.eachLayer(function (layer) {
                        //  if(layer.options.name != "tiles") map.removeLayer(layer);
                    });



                    // On convertit la réponse en objet Javascript
                    let donnees = JSON.parse(reponse)

                    // On boucle sur les données (ES8)
                    Object.entries(donnees).forEach(function (agence, i) {
                        console.log(agence[1].images)
                        let carrousselHTML = "";
                        let buttons = "";
                        let items = "";
                        if (agence[1].images) {
                            const words = agence[1].images.split(',');
                            console.log("words: " + words);




                            if (words) {

                                new_words = [];
                                words.forEach(element => {
                                    if (!new_words.includes(element))
                                        new_words.push(element);
                                })

                                new_words.forEach(function (image, j = 0) {
                                    console.log(image, "j= " + j)
                                    if (j == 0) {
                                        buttons = buttons + "<button type=\"button\" data-bs-target=\"#carouselExampleIndicators" + i + "\" data-bs-slide-to=\"" + j + "\" class=\"active\" aria-current=\"true\" aria-label=\"Slide " + (j + 1) + "\">" + "</button>";
                                        items = items + "<div class=\"carousel-item active\">" +
                                            "<img src=\"/assets/uploads/" + image + "\" class=\"card-img-home\" alt=\"\">" +
                                            "</div>"

                                    }
                                    else {
                                        buttons = buttons + "<button type=\"button\" data-bs-target=\"#carouselExampleIndicators" + i + "\" data-bs-slide-to=\"" + j + "\" aria-label=\"Slide " + (j + 1) + "\"></button>";
                                        items = items + "<div class=\"carousel-item\">" +
                                            "<img src=\"/assets/uploads/" + image + "\" class=\"card-img-home\" alt=\"...\">" +
                                            "</div>"
                                    }
                                    console.log(buttons)
                                    console.log(items)
                                });

                                carrousselHTML = carrousselHTML + "<div id=\"carouselExampleIndicators" + i + "\" class=\"carousel slide\" data-bs-ride=\"carousel\">" +
                                    "<div class=\"carousel-indicators\">" + buttons +
                                    "</div>" +

                                    "<div class=\"carousel-inner\">" + items + "</div>" +
                                    "</div>"
                                console.log(carrousselHTML)

                            }




                        }
                        else { carrousselHTML = "<img src=\"/assets/images/wait.jpg \" class=\"card-img-home\" alt=\"...\">"; }

                        // On crée un marqueur pour l'agence
                        window.setTimeout(() => {
                            let marker = L.marker([agence[1].latitude, agence[1].longitude], {
                                icon: L.icon({
                                    title: "title",
                                    iconUrl: '/assets/images/icons8-location-64.png',
                                    iconSize: [40, 40], // size of the icon
                                    //shadowSize: [50, 64], // size of the shadow
                                    iconAnchor: [20, 40] // point of the icon which will correspond to marker's location
                                }),
                                bounceOnAdd: true,
                                bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
                            }).addTo(map)
                            let numberRooms = agence[1].bedrooms > 1 ? "chambres" : "chambre";
                            let city = "";
                            geojson2.eachLayer(function (layer) {

                                let pt = [agence[1].longitude, agence[1].latitude];
                                console.log(pt);




                                let coord = layer.feature.geometry.coordinates;
                                console.log(layer.feature.geometry.coordinates)
                                // test poly = toulouse centre
                                var poly = turf.polygon(coord);
                                console.log(turf.booleanPointInPolygon(pt, poly));

                                if (turf.booleanPointInPolygon(pt, poly)) {
                                    city = " " + layer.feature.properties.name + ", " + layer.feature.properties.parent_name;
                                    console.log(city)

                                }
                            })

                            array = agence[1].options.split(',');
                            new_array = [];
                            array.forEach(element => {
                                if (!new_array.includes(element))
                                    new_array.push(element);
                            })

                            let optionsHTML = ""
                            if (new_array) {

                                new_array.forEach(function (elt) {
                                    optionsHTML = optionsHTML + "<span class=\"badge rounded-pill bg-dark\"><i class=\"fas fa-hashtag\"></i> " + elt + "</span>"

                                })
                            }


                            console.log(new_array);
                            marker.bindPopup("<div class=\"custom-card2 bg-transparent \" style=\"width: 18rem;\">" + carrousselHTML + "<div class=\"card-body\"><div class=\"row\"><h5 class=\"card-title col-10 mb-0\" onclick=\"location.href='/biens/" + agence[1].slug + "'\">" + agence[1].categories + "</h5><i class=\"love col-2\" data-bs-toggle=\"popover\" data-bs-placement=\"right\" data-bs-trigger=\"hover focus\" data-bs-html=\"true\" title=\"Un coup de coeur !\" data-bs-content=\"Ajoutez le en favoris\"><i class=\"far fa-heart\"></i></i></div><h5 class=\"card-subtitle mb-1\" style='font-size: 1.1rem;'>T" + agence[1].rooms + ", " + agence[1].surface + "m²</h5><h6 class=\"card-subtitle text-muted\"><i class=\"fas fa-search-location\"></i>" + city + "</h6><div class=\"text-primary\" style=\"font-weight: bold; font-size: 1.2em;\">" + new Intl.NumberFormat().format(agence[1].price) + " € " + "<small class=\"\" style=\"color:grey; font-size: 0.9em\">" + new Intl.NumberFormat().format(Math.floor(agence[1].price / agence[1].surface)) + " €/m²</small>" + "</div><i class=\"fas fa-couch\"></i>Séjour 19 m² | <i class=\"fas fa-bed \"></i> " + agence[1].bedrooms + " " + numberRooms + "</br><div class='col text-center'>" + optionsHTML + "</div><div class=\"row mt-2\"><div class=\"col text-center\"><button onclick=\"location.href='/biens/" + agence[1].slug + "'\" class=\"btn btn-outline-danger\">En savoir plus </button></div></div></div></div>", { offset: [10, -30] });
                            marker.bindTooltip("<b><i class='fas fa-city'></i> " + agence[1].categories + ", " + agence[1].surface + " m²</b></br>" + "<i class='fas fa-search-location'></i>" + city, {
                                sticky: true, // If true, the tooltip will follow the mouse.

                            })
                            shelterMarkers.addLayer(marker);
                        }, i * 200);
                    })




                })
            }



            console.log("zoom sur secteur");
            console.log(e.target.feature.properties);
            map.fitBounds(e.target.getBounds());
            toggleLayerVisibility(map, e.target);
            info.update(e.target.feature.properties);
            panel.update(e.target.feature.properties);




            ////////////////////////////////////////////////////
            // Listen to IMG "load" event on all popups.
            ////////////////////////////////////////////////////
            document.querySelector(".leaflet-popup-pane", ".carousel").addEventListener("load", function (event) {
                var target = event.target,
                    tagName = target.tagName,
                    popup = map._popup;

                console.log("got load event from " + tagName);

                // on rajoute ces evt pour le popover de l'icone heart
                var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
                var popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
                    return new bootstrap.Popover(popoverTriggerEl)
                })
                var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
                var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                    return new bootstrap.Tooltip(tooltipTriggerEl)
                })

                var myCarousel = document.querySelector('[id*="carouselExampleIndicators"]')
                var carousel = new bootstrap.Carousel(myCarousel, {
                    interval: 2000,
                    pause: 'hover'
                })

                carousel.cycle();

                // Also check if flag is already set.
                if (tagName === "IMG" && popup && !popup._updated) {
                    popup._updated = true; // Set flag to prevent looping.
                    popup._updateLayout();
                    popup.update();




                }
            }, true);

            /*
            marker.on('mouseout', function (e) {
                this.closePopup();
            });
            */




        }
        else alert("Vous avez utilisé 5 requêtes.\nConnectez vous pour continuer à naviguer sur la carte, c'est gratuit !");


    }
    var markerBus = new Array();


    /*
    let alreadyIn = false

    L.DomEvent.addListener(e.target, 'click', function (evt) {
        panel.update(e.target.feature.properties);
        let alreadyIn = true
        console.log("jai clické sur e.target"+ e.target)
      });
*/

    function zoomToQuator(e) {
        /*
                // on enleve les markers
                if (shelterMarkers != null){
                    shelterMarkers.eachLayer(function(marker) {
                        map.removeLayer(marker);

                        })
                    }

        */













        // on veut enlever tous les layers des secteurs si on a déjà cliqué sur un secteur
        geojson.eachLayer(function (layer) {
            map.removeLayer(layer);

        })

        // on veut enlever tous les layers des bus si on a déjà cliqué sur un quartier
        for (i = 0; i < markerBus.length; i++) {
            map.removeLayer(markerBus[i]);
        }


        // on veut afficher les secteur aux alentours d'un quartier donné donné
        let secteurName = e.target.feature.properties.parent_name;

        geojson.eachLayer(function (layer) {
            if (layer.feature.properties.name !== secteurName) {
                layer.addTo(map);
                console.log(layer.feature.properties.parent_name);
            }
        });



        /*

        let quatorArea = e.target.feature.geometry.coordinates;

        console.log(quatorArea);
//afficher les zones vertes
var geojsonLayer = new L.GeoJSON.AJAX("/assets/js/espaces-verts.geojson", {local:true,style:style2,
    onEachFeature: function(feature, layer) {
        let str=feature.properties.ombrage.replace('T','ombragé');

      }

} )


        geojsonLayer.on('data:loaded', function() {
            console.log("geojson chargé");
            console.log(geojsonLayer);

            geojsonLayer.eachLayer(function(layer) {
                var pt= layer.feature.properties.geo_point_2d.reverse();
                console.log(pt);




            // test poly = toulouse centre
                var poly = turf.polygon(e.target.feature.geometry.coordinates);
                console.log(turf.booleanPointInPolygon(pt, poly));
                if (turf.booleanPointInPolygon(pt, poly)){

                map.addLayer(layer.bindTooltip("<"));
                }
            });





        });

*/

        // on veut afficher les stations de bus d'un quartier donné



        //console.log(secteurName);
        geojson3.eachLayer(function (layer) {
            //console.log(layer.feature.properties.nom_log);
            //console.log(e.target.feature.properties.busStation);
            let pt = ""
            //console.log("start greenArea")
            pt = [layer.feature.properties.geo_point_2d[1], layer.feature.properties.geo_point_2d[0]];
            console.log(pt);




            // test poly = toulouse centre
            let poly = turf.polygon(e.target.feature.geometry.coordinates);
            console.log(e.target.feature.properties.name)
            console.log(turf.booleanPointInPolygon(pt, poly));
            if (turf.booleanPointInPolygon(pt, poly)) {

                let marker = new L.Marker(
                    [layer.feature.properties.geo_point_2d[0], layer.feature.properties.geo_point_2d[1]], {
                    icon: L.icon({
                        iconUrl: '/assets/images/Toulouse_ BUS _symbol.svg.png',
                        iconSize: [12, 12], // size of the icon
                        //shadowSize: [50, 64], // size of the shadow
                        iconAnchor: [6, 6] // point of the icon which will correspond to marker's location
                    }),

                    bounceOnAdd: true,
                    bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
                    bounceOnAddCallback: function () { console.log("done"); }
                }).bindTooltip("<img src='/assets/images/Toulouse_ BUS _symbol1.svg.png' style='width:17px'><b>Station de bus: </b></br>" + layer.feature.properties.nom_log + "</br><b>Ligne: </b></br>" + layer.feature.properties.conc_ligne.replaceAll(" ", ", ")).addTo(map);



            }

        });


        geojsonLayer.eachLayer(function (layer) {
            let pt = ""
            //console.log("start greenArea")
            pt = [layer.feature.properties.geo_point_2d[1], layer.feature.properties.geo_point_2d[0]];
            console.log(pt);




            // test poly = toulouse centre
            let poly = turf.polygon(e.target.feature.geometry.coordinates);
            console.log(e.target.feature.properties.name)
            console.log(turf.booleanPointInPolygon(pt, poly));
            if (turf.booleanPointInPolygon(pt, poly)) {


                map.addLayer(layer);
            }
        });

        console.log("zoom sur quartier");
        console.log(e.target.feature.properties);

        //toggleLayerVisibility(map, e.target);
        map.fitBounds(e.target.getBounds());
        info.update(e.target.feature.properties);
        panel.update(e.target.feature.properties);


    }

    function toggleLayerVisibility(map, selectedLayer) {
        if (selectedLayerId && selectedLayerId !== selectedLayer._leaflet_id) {
            map.eachLayer(layer => {
                if (layer._leaflet_id === selectedLayerId) geojson.resetStyle(layer);
                if (layer._leaflet_id === selectedLayerId) geojson2.resetStyle(layer);
            })
        }
        selectedLayer.setStyle({
            weight: 5,
            color: 'rgb(255,223,0)',//color: or
            dashArray: "15,15",
            fillOpacity: 0
        });
        selectedLayerId = selectedLayer._leaflet_id; //save identifier of a selected layer
        console.log("n° selecltlayer_leaflet_id sauvegardé: " + selectedLayerId)
        //console.log(quatorsData.features[1].properties.name);

    }

    /* function onEachFeature(feature, layer) {
         layer.on({
             mouseover: highlightFeature,
             mouseout: resetHighlight,
             click: zoomToFeature
         });
     }
     */
    function onEachSector(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToSector
        });
    }
    function onEachQuator(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: zoomToQuator
        });
    }
    function picnicFilter(feature) {
        if (feature.properties.name !== "Toulouse") return true
    }
    /* global statesData */
    geojson = L.geoJson(sectorsData, {
        style: style,
        onEachFeature: onEachSector,
        filter: picnicFilter
    }).addTo(map);


    geojson2 = L.geoJson(quatorsData, {
        style: style,
        onEachFeature: onEachQuator
    });
    // les bus de toulouse
    geojson3 = L.geoJson(busData, {
        style: style

    });





    /*
        map.on('zoomend', function () {
            if (map.getZoom() < 14) {
                map.addLayer(geojson);
                map.removeLayer(geojson2);
                map.removeLayer(shelterMarkers);
            }
            else {
                map.addLayer(shelterMarkers);



                //map.removeLayer(geojson);
                map.addLayer(geojson2);
            }

            if (map.getZoom() < 12) {
                //2nd geoJSON layer
                map.removeLayer(job2)
            } else {
                map.addLayer(job2);
            }
            if (map.getZoom() < 8) {
                map.removeLayer(job3); //3rd geoJSON layer
            } else {
                map.addLayer(job3);
            }

        });*/

    map.attributionControl.addAttribution('Prix / m² &copy; <a href="">Figaro immobilier</a>');


    const legend = L.control({ position: 'bottomright' });

    legend.onAdd = function (map) {

        const div = L.DomUtil.create('div', 'info legend d-none d-sm-block');
        const grades = [0, 2000, 2500, 3000, 3500, 4000, 4500, 5000];
        const labels = [];
        let from, to;

        for (let i = 0; i < grades.length; i++) {
            from = grades[i];
            to = grades[i + 1];

            if (i == 0) {
                labels.push(`<i style="background:${getColor(from + 1)}"></i>- de ${to ? `${to}` : ' et plus'} €/m² `);
            }
            else
                labels.push(`<i style="background:${getColor(from + 1)}"></i> ${from}${to ? `&ndash;${to}` : ' et +'} €/m² `);
        }

        div.innerHTML = labels.join('<br>');
        return div;
    };

    legend.addTo(map);

    L.circleMarker([10, 70], {
        dashArray: "15,15",
        dashSpeed: -30,
        radius: 147.5
    }).addTo(map);







}
