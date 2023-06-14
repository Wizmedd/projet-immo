//var cities = ["31000", "Aigrefeuille", "Aucamville", "Aussonne", "Balma", "Beaupuy", "Beauzelle", "Blagnac", "Brax", "Bruguières", "Colomiers", "Cornebarrieu", "Cugnaux", "Drémil-Lafage", "Fenouillet", "Flourens", "Fonbeauzard", "Gagnac-sur-Garonne", "Gratentour", "L&#039;Union", "Launaguet", "Lespinasse", "Mondonville", "Mondouzil", "Mons", "Montrabé", "Pibrac", "Pin-Balma", "Quint-Fonsegrives", "Saint-Alban", "Saint-Jean", "Saint-Jory", "Saint-Orens-de-Gameville", "Seilh", "Toulouse", "Tournefeuille", "Villeneuve-Tolosane"];
//autocomplete(document.getElementById("q"), cities);

// Get the wizard field
let wizards = document.querySelector('#q');


/**
 * Create and render the datalist element
 * @param  {Array} data  The data to use for the list
 */
function renderDatalist(data) {

    // Create the datalist element
    let datalist = document.createElement('datalist');
    datalist.id = 'wizards-data';
    wizards.setAttribute('list', datalist.id);
    //wizards.setAttribute('class', "");

    // Create fragment for option elements
    let fragment = document.createDocumentFragment();

    // Create list options
    for (let wizard of data) {
        let option = document.createElement('option');
        option.textContent = wizard;
        option.setAttribute('class', "autocomplete-items");
        fragment.append(option);
    }

    // Add options to datalist
    datalist.append(fragment);

    // Inject into the DOM
    wizards.after(datalist);

}

// Fetch the data and render the datalist element
fetch('/assets/js/wizards.json').then(function (response) {
    if (response.ok) {
        return response.json();
    }
    throw response;
}).then(function (data) {
    renderDatalist(data);
}).catch(function (error) {
    console.warn(error);
});


var geojson;
/* global statesData */

let $map = document.querySelector('#map');



/**
 * @property {HTMLElement} pagination
 * @property {HTMLElement} content
 * @property {HTMLElement} sorting
 * @property {HTMLFormElement} form
 */
class Filter {

    /**
     * @param {HTMLElement|null} element
     */
    constructor(element) {

        if (element === null) {
            console.log('je suis null')
            return
        }
        console.log('je me construis')

        this.pagination = element.querySelector('.js-filter-pagination');

        this.content = element.querySelector('.js-filter-content');
        this.sorting = element.querySelector('.js-filter-sorting');
        this.form = document.getElementById('exampleModal').querySelector(".js-filter-form")

        //console.log(this.pagination)






        this.bindEvents()
    }


    /**
     * Ajoute les comportements aux différents éléments
     */
    bindEvents() {


        const aClickListener = e => {
            if (e.target.tagName === 'A') {
                e.preventDefault()
                this.loadUrl(e.target.getAttribute('href'))
            }
        }

        this.sorting.addEventListener('click', aClickListener)
        this.pagination.addEventListener('click', () => { window.scrollTo(0, 0); aClickListener; })

        //console.log(this.form.querySelectorAll('input'))
        this.form.querySelectorAll('input').forEach(input => {




            //   $("#q").on("autocompletechange", function (event, ui) { console.log("autocomplete") });

            input.addEventListener('change', this.loadForm.bind(this));
            //this.form.submit()
        })







        // elt.addEventListener('change', this.loadForm.bind(this))
        console.log("on ajoute les comportement des select")
        //select.addEventListener('change', this.loadForm.bind(this))
        $('#categories').on("select2:select", this.loadForm.bind(this))
        $('#categories').on("select2:unselect", this.loadForm.bind(this))

        $('#options').on("select2:select", this.loadForm.bind(this))
        $('#options').on("select2:unselect", this.loadForm.bind(this))
        /**
        $('#categories').on('select2:select', function (e) {
            var data = e.params.data;
            console.log(data);
            this.loadForm.bind(this)
        });
        //$('#options').on("select2:selecting", this.loadForm.bind(this))

        */








    }



    async loadForm() {
        console.log('on utilise loadform')
        const data = new FormData(this.form)
        const url = new URL(this.form.getAttribute('action') || window.location.href)
        const params = new URLSearchParams()
        data.forEach((value, key) => {
            params.append(key, value)
        })
        return this.loadUrl(url.pathname + '?' + params.toString())
    }

    async loadUrl(url, append = false) {
        console.log("loadUrl start");
        this.showLoader()

        const params = new URLSearchParams(url.split('?')[1] || '')

        const response = await fetch(url.split('?')[0] + '?' + params.toString(), {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
        if (response.status >= 200 && response.status < 300) {
            console.log("Ajax response ok");
            const data = await response.json()
            this.content.innerHTML = data.content
            this.updatePrices(data)
            this.sorting.innerHTML = data.sorting

            this.pagination.innerHTML = data.pagination

            //console.log(map);
            /**
                       const container = L.DomUtil.get("map");

                       if (container != null) {
                           container._leaflet_id = null;
                           // map.removeLayer()
                           container.innerHTML = "";


                           await initMap();
                           //console.log(map);

                       }
                       // $map.remove()
                       //  $map.innerHTML = "< div id='map' style='width: 100%; height: 100%;'>";


                       let g = document.createElement('div');
                       g.setAttribute("id", "map");

                       $map = document.querySelector('#map');
                       */






            // on efface les markers

            //  document.getElementById('map').innerHTML = "<div id='map' style='width: 100%; height: 100%;'></div>";
            console.log(map);
            const container = L.DomUtil.get("map");

            if (container != null) {
                container._leaflet_id = null;
                // map.removeLayer()
                container.innerHTML = "";



            }

            $("#map").remove();
            var g = document.createElement("div");
            g.setAttribute("id", "map");
            g.classList.add("search-map")
            document.getElementById("main-div").appendChild(g);

            // document.getElementById('map').innerHTML = `<div id="map" class="search-map" style="width:50%;"></div>`;

            // var map = L.map("map", { scrollWheelZoom: false, maxZoom: 18 });
            $map = document.querySelector('#map');


            history.replaceState({}, '', url.split('?')[0] + '?' + params.toString());



            await initMap();












        } else {
            console.error(response)
        }
        this.hideLoader()
        //initMap()
    }

    showLoader() {
        // Code à écrire

        this.form.classList.add('is-loading');
        const loader = this.form.querySelector('.js-loading');
        if (loader === null) { return }
        loader.setAttribute('aria-hidden', 'false');
        loader.style.display = null;

    }

    hideLoader() {
        // Code à écrire

        this.form.classList.remove('is-loading');
        const loader = this.form.querySelector('.js-loading');
        if (loader === null) { return }
        loader.setAttribute('aria-hidden', 'true');
        loader.style.display = 'none';
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

new Filter(document.querySelector('.js-filter'));
console.log('filtre crée');
const slider = document.getElementById('price-slider');







if (slider) {

    const min = document.getElementById('minPrice')

    const max = document.getElementById('maxPrice')
    const minValue = Math.floor(parseInt(slider.dataset.min, 10) / 10) * 10
    console.log(new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: '0' }).format(minValue));
    const maxValue = Math.ceil(parseInt(slider.dataset.max, 10) / 10) * 10



    const range = noUiSlider.create(slider, {
        start: [minValue, maxValue],
        // snap: true,
        connect: true,
        range: {
            'min': minValue,
            'max': maxValue
        },


        //format: wNumb({ decimals: 0, suffix: ' €' })
    })


    range.on('start', function (values) {

        min.value = Math.round(values[0])


        max.value = Math.round(values[1])

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

function updateSurface() {

    /* on update la value surface si elle est définie*/
    var str = window.location.href;
    var url = new URL(str);
    var search_params = new URLSearchParams(url.search);
    if (search_params.has('minSurface')) {
        var surface = search_params.get('minSurface');
        console.log(surface);







        if (surface !== "") {

            document.getElementById("minSurface").value = surface;


            document.getElementById("surface").innerText = surface;
        }
    }



}

function updateValue(event) {


    document.getElementById("surface").innerText = event.value;
    //console.log(document.getElementById("surface").innerText);
    //console.log('update de la surface')
}
updateSurface();




const COLORS = {
    line: '#8fd9b6', // aqua green shade for line
    fill: '#d6f0ff' // sky blue shade for fill
};

const ICONS = {
    pin: '/assets/images/Pink-Map-Pin-png-hd.png',
    size: [30, 30],
    anchor: [0, 30]
};

function formatSearchArea(q) {
    return "<div class='text-center'>Votre zone de recherche:</br> <b> \" " + q + " \" </b></div>";
}

class LeafletMap {

    constructor() {

        this.map = null;
        this.bounds = [];


    }

    async load(element) {

        return new Promise((resolve, reject) => {

            $script("https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.2/leaflet.js", 'bundle', () => {



                this.map = L.map(element, { scrollWheelZoom: false, maxZoom: 18 });

                let Stamen_watercolor = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}', {
                    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                    subdomains: 'abcd',
                    minZoom: 0,
                    maxZoom: 20,
                    name: 'tiles',
                    ext: 'png'
                });



                this.map.addLayer(Stamen_watercolor);




            })
            $script.ready('bundle', function () {
                $script("assets/js/bouncemarker.js", () => { console.log("bounce load"); })
                $script("assets/js/L.Path.DashFlow.js", () => { console.log("Dashflow load"); resolve(); })
            })



        });




    }



    addMarker(lat, lng, text) {
        let point = [lat, lng];
        this.bounds.push(point);

        return new LeafletMarker(point, text, this.map);

    }

    center() {
        console.log(this.bounds);
        if (this.bounds.length > 0) {
            //console.log("non nulle");
            this.map.fitBounds(this.bounds, { padding: [50, 50] });
        }

        else { this.map.setView([43.600000, 1.433333], 12); }
    }




    addPoly() {
        const searchParams = new URLSearchParams(window.location.search);

        if (searchParams.has('q')) {
            console.log("J'ai trouvé q dans l'URL.");

            const q = searchParams.get('q');
            console.log("Chaîne de requête : ", q);

            const cityName = q.split("+").join(" ").split(" ");
            console.log("Tableau de noms de villes/secteurs : ", cityName);


            const geojson = L.geoJson(sectorsData);

            let tooltipTimeout;

            cityName.forEach((city) => {
                geojson.eachLayer((layer) => {
                    if (layer.feature.properties.name == city || layer.feature.properties.zipcode == city) {
                        console.log(`J'ai trouvé ${city} dans le GeoJSON.`);

                        layer.bindTooltip(formatSearchArea(city), { sticky: true, closeOnClick: false });

                        layer.on('mouseover', function (e) {
                            clearTimeout(tooltipTimeout);
                            this.openTooltip();
                            tooltipTimeout = setTimeout(() => {
                                this.closeTooltip();
                            }, 2000);
                        });

                        layer.on('mouseout', function (e) {
                            clearTimeout(tooltipTimeout);
                            this.closeTooltip();
                        });

                        const coord = layer;

                        coord.setStyle({
                            weight: 3,
                            color: COLORS.line,
                            dashArray: "15,15",
                            dashSpeed: -30,
                            fillOpacity: 0.3,
                            fillColor: COLORS.fill
                        });

                        coord.addTo(this.map);

                        const marker = L.marker(coord.getCenter(), {
                            icon: L.icon({
                                iconUrl: ICONS.pin,
                                iconSize: ICONS.size,
                                iconAnchor: ICONS.anchor
                            }),
                            bounceOnAdd: true,
                            bounceOnAddOptions: { duration: 500, height: 250, loop: 1 },
                            bounceOnAddCallback: function () { console.log("done"); }
                        });

                        const tooltip = "<div class='text-center'>Centre de la recherche :</br>\"<b>" + city + "\"</b></div>";
                        marker.bindTooltip(tooltip, {
                            sticky: true // Si vrai, l'infobulle suivra la souris.
                        }).setZIndexOffset(-1).addTo(this.map);
                    }
                });
            });

            console.log("Ajustement des limites...");
            // this.map.fitBounds(geojson.getBounds());
            console.log("Limites ajustées.");

        } else {
            console.log("Pas de paramètre q trouvé dans l'URL.");
        }
    }





}

class LeafletMarker {
    constructor(point, text, map) {
        this.text = text;
        this.popup = L.popup({
            autoClose: false,
            closeOnEscapeKey: false,
            closeOnClick: false,
            closeButton: false,
            className: 'marker',
            maxWidth: 300
        })
            .setLatLng(point)
            .setContent(text)
            .openOn(map);

    }

    setActive() {
        this.popup.getElement().classList.add('is-active')
    }
    unsetActive() {
        this.popup.getElement().classList.remove('is-active')
    }

    addEventListener(evt, cb) {
        this.popup.addEventListener('add', () => {
            this.popup.getElement().addEventListener(evt, cb);
        })

    }
    setContent(text) {
        this.popup.setContent(text);
        this.popup.getElement().classList.add('is-expanded');
        this.popup.update();
    }
    resetContent() {
        this.popup.setContent(this.text);
        this.popup.getElement().classList.remove('is-expanded');
        this.popup.update();
    }

}

let map = new LeafletMap();


const initMap = async function () {



    // let map = new LeafletMap();




    let hoverMarker = null;
    let activeMarker = null;





    await map.load($map);





    Array.from(document.querySelectorAll('.js-marker')).forEach((item) => {


        let marker = map.addMarker(item.dataset.lat, item.dataset.lng, item.dataset.price + ' K €')

        item.addEventListener('mouseover', function () {
            if (hoverMarker !== null) {
                hoverMarker.unsetActive();
            }
            marker.setActive();
            hoverMarker = marker;
        })
        item.addEventListener('mouseleave', function () {
            if (hoverMarker !== null) {
                hoverMarker.unsetActive();
            }

        })

        marker.addEventListener('click', function () {
            if (activeMarker !== null) {
                //activeMarker.classList.remove('marker');
                activeMarker.resetContent();
            }

            // Créez la carte pour l'élément
            var card = document.createElement('div');
            card.classList.add('card');

            // Récupérez la référence vers le carousel
            var carousel = item.querySelector('.carousel');

            // Récupérez la référence vers l'image active dans le carousel
            var activeImage = carousel.querySelector('.carousel-item.active img');

            // Créez l'image principale pour la carte
            var mainImage = document.createElement('img');
            mainImage.classList.add('card-img-top');
            //mainImage.classList.add('rounded-top');
            mainImage.src = activeImage.src;
            mainImage.alt = "";
            card.appendChild(mainImage);

            // Créez le corps de la carte
            var cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'd-flex', 'flex-column', 'align-items-center');
            card.appendChild(cardBody);

            // Ajouter les informations de l'élément à la carte
            /*var title = document.createElement('h5');
            title.classList.add('card-title');
            title.textContent = item.dataset.title;
            cardBody.appendChild(title);*/

            /*var description = document.createElement('p');
             description.classList.add('card-text');
             description.textContent = item.dataset.description;
             cardBody.appendChild(description);*/

            var price = document.createElement('h5');
            price.classList.add('card-text');
            price.textContent = item.dataset.rooms + " chambres, " + item.dataset.price + " €";
            cardBody.appendChild(price);

            var link = document.createElement('a');
            link.classList.add('btn', 'btn-danger', 'text-white');
            link.href = item.dataset.link;
            link.textContent = "En savoir plus";
            cardBody.appendChild(link);

            marker.setContent(card);

            activeMarker = marker;
        });


        marker.addEventListener('mouseleave', function () {
            if (activeMarker !== null) {
                activeMarker.resetContent();
            }



        })


    })

    map.center();
    map.addPoly();






}



if ($map !== null) {




    initMap();


}



