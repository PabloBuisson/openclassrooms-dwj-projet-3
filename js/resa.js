/* ------ Classe Réservation (localeStorage, sessionStorage, compte à rebours) ----- */

class ResaClass {
	constructor(form, timer, canvas) {
		this.form = $(form); // ID du formulaire
		this.timer = timer; // temps du décompte en millisecondes (ex. 20min = 20*60*1000)
		this.canvas = canvas; // permet de récupérer les valeurs de la classe Canvas (ex. this.canvas.ctx = le contexte du canvas)
		this.beforeForm = $('#before_form'); // message avant l'apparition du formulaire
		this.formName = this.form.find('#name'); // input name du formulaire
		this.formFirstName = this.form.find('#firstname'); // input firstname du formulaire
		this.intervalResa = null;
		this.stopTimer = null;
		this.regexResa = /......../;
		this.documentHeight = $(document).height();
		this.initSettings();
	}; // fin du constructor

	initSettings() {
		$(document).ready(($) => { // Quand le DOM est prêt...

			if (this.storageAvailable('localStorage')) {
				console.log("Nous pouvons utiliser localStorage");
			} else {
				console.log("Malheureusement, localStorage n'est pas disponible");
			};

			if (!localStorage.name) { // s'il n'y a pas d'élément name, on laisse l'utilisateur faire
				console.log("Veuillez renseigner vos identifiants"); // populateStorage();
			} else { // si l'élément est présent (sauvegardé), on active les changements sauvegardés
				this.setStyles();
			}

			if (!sessionStorage.stoptimer) { // s'il n'y a pas d'élément stopTimer, on laisse l'utilisateur faire
				console.log("Pas de réservation en cours");
			} else { // si l'élément est présent (réservation en cours), on ré-active le compte à rebours
				console.log("Une réservation est en cours...");
				this.stopTimer = sessionStorage.stoptimer;
				console.log(this.stopTimer);
				$('#form_confirm').css('display', 'block');
				$('#confirm_station').html(`${sessionStorage.station}`);
				$('#confirm_name').html(`${localStorage.firstname} ${localStorage.name}`);

				this.loopTimer();

				this.documentHeight = $(document).height();
				$('html, body').animate({
					scrollTop: this.documentHeight
				}, 1000); // descend la fenêtre de navigation à hauteur des informations de réservation
			};
		});

		this.form.submit((event) => { // au submit du formulaire, déclencher...
			event.preventDefault();
			console.log("Réservé !");
			this.canvas.canvasContainer.css('display', 'block'); // lancer le bloc canvas
			this.canvas.resize();
			this.beforeForm = $('#before_form');
			$('#confirm_station').html(this.beforeForm.text().replace(this.regexResa, ''));
			$('#confirm_name').html(`${this.formFirstName.val()} ${this.formName.val()}`);
			clearInterval(this.intervalResa);
			$('#timer').html("");
			this.documentHeight = $(document).height();
			$('html, body').animate({ // pour les mobiles, scroll down jusqu'au canvas
				scrollTop: $("#canvas_message").offset().top
			}, 1000);
		});

		this.canvas.clear.click((e) => {
			console.log("appuyé");
			clearInterval(this.intervalResa);
			$('#timer').html("");
			this.canvas.ctx.clearRect(0, 0, this.canvas.canvas.width(), this.canvas.canvas.height());
			this.canvas.canvasFilled = false;
		});

		this.canvas.submit.click((e) => { // à la validation du canvas
			e.preventDefault();
			if (!this.canvas.canvasFilled) { // si le canvas n'est pas rempli...
				alert("Il manque votre signature !");
			} else { // si le canvas est rempli
				this.stopTimer = new Date().getTime() + this.timer; // le temps du clic + 20*minutes
				sessionStorage.stoptimer = this.stopTimer; // enregistre (temporairement) la fin du décompte
				console.log(this.stopTimer);

				this.populateStorage(); // on sauvegarde les identifiants
				this.loopTimer(); // on active le compte à rebours

				$('#form_confirm').css('display', 'block');
				this.documentHeight = $(document).height();

				$('html, body').animate({
					scrollTop: this.documentHeight
				}, 1000); // scroll down de la fenêtre de navigation

				$(window).on('beforeunload', (event) => { // si l'utilisateur veut quitter l'onglet
					event.preventDefault(); // on l'avertit de la perte des données
					console.log("Do you really want to close the window ?");
				});
			};
		});
	}

	storageAvailable(type) {
		try {
			let storage = window[type],
				x = '__storage_test__';
			storage.setItem(x, x);
			storage.removeItem(x);
			return true;
		}
		catch(e) {
			return false;
		}
	};

	loopTimer() {
		this.intervalResa = setInterval( () => { // à chaque rappel :
				let startTimer = new Date().getTime(); // le temps présent
				let distance = this.stopTimer - startTimer; // la distance présent - fin de décompte
				let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)); // le nombre de minutes restantes
				let seconds = Math.floor((distance % (1000 * 60)) / 1000); // le nombre de secondes restantes
				$('#timer').html(`${minutes}m ${seconds}s`);

				if (distance < 0) { // fin du décompte
					clearInterval(this.intervalResa); // fin de la boucle
					$('#form_confirm').css('display', 'none');
					$('#form_exp').css('display', 'block');
					sessionStorage.clear(); // supprime les valeurs temporaires
				};
			}, 1000);
	};

	populateStorage() { // enregistrer des valeurs
	  localStorage.name = this.formName.val(); // enregistre la valeur nom
	  localStorage.firstname = this.formFirstName.val(); // enregistre la valeur prénom
	  sessionStorage.station = $('#confirm_station').text(); // enregistre (temporairement) la valeur station

	  console.log(`Prénom et nom : ${localStorage.getItem('firstname')} ${localStorage.getItem('name')} réservé à la station ${sessionStorage.getItem('station')}`);

	  this.setStyles();
	};

	setStyles() { // obtenir les valeurs
	  let currentName = localStorage.name;
	  let currentFirstname = localStorage.firstname;
	  let currentStation = sessionStorage.station;

	  this.formName.val(currentName);
	  this.formFirstName.val(currentFirstname);
	  $('#confirm_station').html(currentStation);
	  console.log(`${currentFirstname} ${currentName}`);
	};

}; // fin de la classe