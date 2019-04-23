/* --------- CLASSE SLIDER LOCATIONS VELOS ------------- */

class SliderClass {
	constructor(container, timeout, fadeout, fadein) {
		this.slider = $(container); // selecteur du container du slider
		this.slide = this.slider.find('.slide'); // selecteur des slides
		this.dot = this.slider.find('.dot'); // selecteur des points sous le slider
		this.timeline = this.slider.find('.timeline'); // selecteur de la barre de progression
		this.timeout = timeout; // durée de mise en ligne du slide actif
		this.fadeout = fadeout; // durée du fadeOut des slides
		this.fadein = fadein; // durée du fadeIn des slides
		this.indexSlide = this.slide.length - 1; // index (nombre de slides)
		this.i = 0; // compteur
		this.activeSlide = this.slide.eq(this.i); // image active, qui possède l'index
		this.activeDot = this.dot.eq(this.i); // le point actif suit le comportement du slide actif
		this.animation;
		this.next = this.slider.find('#slider_next'); // bouton next
		this.prev = this.slider.find('#slider_prev'); // bouton prev
        this.pause = this.slider.find('#slider_pause'); // bouton pause
        this.initSettings(); // lance les premières propriétés + événements
    }; // fin du constructor
    
    initSettings() {
        this.activeSlide.css({ // this.activeSlide.css('display', 'block'); // lance la première slide
			display: 'block'
        });
        
        this.activeDot.addClass('dot_active'); // met en valeur le première point

         $(document).ready(($) => { // quand le DOM est prêt, on lance ces 2 méthodes
			this.launchTimeline();
			this.slideLoop();
		});

		this.next.click( (event) => { // événement clic sur l'image suivante
            this.nextSlide();
    	});

    	this.prev.click( (event) => { // événement clic sur l'image précédente
            this.prevSlide();
    	});

        this.pause.click( (event) => { // événement clic sur pause
            if (this.pause.children(':first').hasClass('fa-pause')) {
                clearTimeout(this.animation); // annule le setTimeout
                this.timeline.stop(); // arrête l'animation de la barre de progression
                this.pause.children(':first').removeClass('fa-pause').addClass('fa-play'); // le bouton pause devient bouton play
            } else if (this.pause.children().hasClass('fa-play')) {
                this.nextSlide(); // lance la slide suivante et remet le bouton pause
            }  		
    	});

    	 $(document).keyup((touche) => { // événement touche clavier
	        let saisie = touche.code || touche.key;

	        if (saisie === "ArrowRight") {
	           this.nextSlide();
	        } else if (saisie === "ArrowLeft") {
	           this.prevSlide();
	        }
        });

        this.dot.click( (event) => { // événement clic sur les points
            if (this.pause.children().hasClass('fa-play')) { // remet le bouton pause
                this.pause.children(':first').removeClass('fa-play').addClass('fa-pause');
            };

    		this.i = $(event.target).index(); // le compteur prend l'index de l'élément cliqué

    		this.activeSlide.fadeOut(this.fadeout); // fait disparaître lentement la slide active (remplace $slide.css('display', 'none');)
        	this.activeSlide = this.slide.eq(this.i); // change l'index
        	this.activeSlide.fadeIn(this.fadein); // fait apparaître lentement le slide du nouvel index

        	this.dot.removeClass('dot_active'); // supprime la classe décorative
            $(event.target).addClass('dot_active'); // ajoute la classe décorative au point cliqué

            clearTimeout(this.animation); // annule le setTimeout
        	this.slideLoop(); // relance le setTimeout à 0

        	this.timeline.stop(); // arrête l'animation de la barre de progression
        	this.timeline.css('width', 0); // remet le width à 0
        	this.launchTimeline(); // relance la barre de progression
		});
    };

	nextSlide() {
        if (this.pause.children().hasClass('fa-play')) { // remet le bouton pause
            this.pause.children(':first').removeClass('fa-play').addClass('fa-pause'); 
        };

        this.i++; // on incrémente l'index
        	if (this.i > this.indexSlide) { // si index supérieur au nombre de slide, on revient au début
            this.i = 0;
            };

        this.changeSlide();

        clearTimeout(this.animation); // annule le setTimeout
        this.slideLoop(); // relance le setTimeout à 0

        this.timeline.stop(); // arrête l'animation de la barre de progression
        this.timeline.css('width', 0); // remet le width à 0
        this.launchTimeline(); // relance la barre de progression
    };

    prevSlide() {
        if (this.pause.children().hasClass('fa-play')) { // remet le bouton pause
            this.pause.children(':first').removeClass('fa-play').addClass('fa-pause');
        };

        this.i--; // on décrémente l'index
        if (this.i < 0) { // si index inférieur à 0, on passe au dernier slide
            this.i = this.indexSlide;
        };

        this.changeSlide();

        clearTimeout(this.animation); // annule le setTimeout
        this.slideLoop(); // relance le setTimeout à 0

        this.timeline.stop(); // arrête l'animation de la barre de progression
        this.timeline.css('width', 0); // remet le width à 0
        this.launchTimeline(); // relance la barre de progression
    };

	slideLoop() {
		this.animation = setTimeout( () => {
			if (this.i < this.indexSlide) { // si l'index est inférieur au nombre de slides
            	this.i++; // on incrémente (on passe au slide suivant)
             } 
            else {
            	this.i = 0; // sinon, on revient au premier slide (dernier slide => premier slide)
            };
            this.changeSlide();
            this.slideLoop(); // on relance la fonction pour créer la boucle
            this.launchTimeline(); // on lance la barre de progression
        }, this.timeout); // toutes les 5 secondes
	};

	changeSlide() {
		this.activeSlide.fadeOut(this.fadeout); // fait disparaître lentement la slide active (remplace $slide.css('display', 'none');)
        this.activeSlide = this.slide.eq(this.i); // change l'index
        this.activeSlide.fadeIn(this.fadein); // fait apparaître lentement le slide du nouvel index(précédement : $activeSlide.css('display', 'block');)
        this.dot.removeClass('dot_active'); // enleve la classe décorative
        this.activeDot = this.dot.eq(this.i); // remet à jour l'index
        this.activeDot.addClass('dot_active'); // rajoute la classe décorative au point suivant
	};

	launchTimeline() {
		let percent = this.timeline.attr('data-percent'); // récupère le data 100% de l'élément
        this.timeline.animate( {
        	width: percent
        },this.timeout, 'linear', () => {
        	this.timeline.css('width', 0); // une fois l'animation complète, on revient à 0
        });
    };

};