/* ------------- CLASSE MAP MAPBOX + LEAFLET --------------- */

class MapClass {
    constructor(container, mapID, lat, lng, zoom, ajaxURL) {
        this.container = $(container);
        this.mapID = mapID;
        this.latView = lat;
        this.lngView = lng;
        this.zoom = zoom;
        this.ajaxURL = ajaxURL;
        this.map = L.map(mapID).setView([this.latView, this.lngView], this.zoom); // initialisation de la map
        this.tilelayer = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoicGFibG8tYiIsImEiOiJjanJtOGNhdDMwZmsyNDRvOTE2NGh6OWVpIn0.F2dzzHhRYuKt10Vp9I_hTg', {
            attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>', // création du design de la map
            maxZoom: 18,
            id: 'mapbox.streets',
            accessToken: 'pk.eyJ1IjoicGFibG8tYiIsImEiOiJjanJtOGNhdDMwZmsyNDRvOTE2NGh6OWVpIn0.F2dzzHhRYuKt10Vp9I_hTg'
        });
        this.tilelayer.addTo(this.map); // ajout du design à la map
        this.stationModel = { // création de l'objet station
            init: function (name, address, positionlat, positionlng, banking, status, bikestands, availableBS, availableB, lastupdate) {
                this.name = name;
                this.address = address;
                this.position = {
                    lat: positionlat,
                    lng: positionlng
                };
                this.banking = banking;
                this.status = status;
                this.bike_stands = bikestands;
                this.available_bike_stands = availableBS;
                this.available_bikes = availableB;
                this.last_update = lastupdate;
            }

        };
        this.greenIcon = L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            shadowSize: [41, 41],
        });

        this.orangeIcon = L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            shadowSize: [41, 41],
        });

        this.redIcon = L.icon({
            iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            shadowSize: [41, 41],
        });
        this.document = $(document);
        this.regex = /......./; // enlève les chiffres et le tiret du nom de la station
        this.name = this.container.find('#name');
        this.firstname = this.container.find('#firstname');
        this.initSettings();
    }; // fin du constructor

    initSettings() {
        this.document.ready( ($) => { // quand le DOM est prêt, on lance la méthode AJAX
            this.launchAjax();
        });
    }

    launchAjax() {
            $.ajax({
                url: this.ajaxURL,
                type: 'GET',
                dataType: 'json',
                data: {param1: 'value1'},
            })
            .done(function() {
                console.log("success");
            })
            .fail(function() {
                console.log("error");
            })
            .always( (response) => {
                console.log("complete");
                this.ajaxOK(response);
            });
        };

    ajaxOK(response) { // fonction qui se déclenche quand  l'appel AJAX s'est terminé avec succès
        let stations = response; // le tableau JS obtenu (jQuery traduit en JS)
        for (let station of stations) { // création d'une classe pour chaque station
            let newStation = Object.create(this.stationModel);
            newStation.init(station.name, station.address, station.position.lat, station.position.lng, station.banking, station.status, station.bike_stands, station.available_bike_stands, station.available_bikes, station.last_update);

            let myIcon = this.greenIcon; // au début de la boucle, l'icône est vert

            if (newStation.status === "CLOSED") { // si la station est FERMÉE
                newStation.available_bikes === 0; // elle n'a plus de vélos disponibles
            };
            
            if (newStation.available_bikes < 10) { // moins de 10 places restantes, il devient orange
                myIcon = this.orangeIcon;
                if (newStation.available_bikes === 0) { // à 0, il devient rouge
                    myIcon = this.redIcon;
                }
            }

            let newMarker = L.marker([newStation.position.lat, newStation.position.lng], {icon: myIcon}, {opacity: 1}, {bubblingMouseEvents: true}, {interactive: true});
            newMarker.bindPopup(newStation.name.replace(this.regex, 'STATION'));
            newMarker.addTo(this.map).on('click', (e) => {
                this.newMarkerClic(newStation);
            });
        };
    };

    newMarkerClic(newStation) {
        $('#before_form').remove();
        $('#form_container').prepend('<p id="before_form"></p>'); 
        $('#before_form').append(newStation.name.replace(this.regex, 'STATION')); // affiche le nom de la station
        $('#form_container').css('width', '100%');
        $('#station_infos').css('display', 'block'); // affiche les infos de la stations
        $('#station_infos p').html(''); // efface les dernières valeurs d'informations
        $('#form_container form').css('display', 'none'); // efface le formulaire
        $('#nobikes').css('display', 'none'); // efface le message en cas de réservation impossible
        
        $('#station_infos p:first').append(`Adresse : ${newStation.address.toLowerCase()}`); // remplissage de l'info 1
        $('#station_infos p:eq(1)').append(`Nombre de places : ${newStation.bike_stands}`); // remplissage de l'info 2
        $('#station_infos p:last').append(`Nombre de vélos disponibles : ${newStation.available_bikes}`); // remplissage de l'info 3

        $('#canvas_container').css('display', 'none'); // efface le canvas s'il est ouvert
        $('#form_confirm').css('display', 'none'); // efface le message de confirmation
        $('#form_exp').css('display', 'none'); // efface le message d'expiration de reservation

        if (newStation.available_bikes > 0) { // S'il y a des vélos disponibles...
            $('#form_container form').css('display', 'block');
			$('html, body').animate({ // pour les mobiles, scroll down jusqu'au formulaire
			    scrollTop: $("#before_form").offset().top
			}, 1000);
        } else {
            $('#nobikes').css('display', 'block'); // message de réservation impossible
            $('html, body').animate({ // pour les mobiles, scroll down jusqu'au formulaire
                scrollTop: $("#before_form").offset().top
            }, 1000);
        }
    }
}; // fin de la classe