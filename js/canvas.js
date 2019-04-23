/* CLASSE CANVAS (SOURIS et TACTILE) */

class CanvasClass {
	constructor(canvasDiv, canvas) {
		this.canvasDiv = $(canvasDiv);
		this.canvas = $(canvas);
		this.ctx = this.canvas[0].getContext("2d");
		this.topCanvas = this.canvas[0].getBoundingClientRect().top; // pixels par rapport au haut de la page
		this.leftCanvas = this.canvas[0].getBoundingClientRect().left; // pixels par rapport au coin gauche de la page
		this.x = this.leftCanvas; // position initiale = left 0 du canvas
		this.y = this.topCanvas; // position initiale = top 0 du canvas
		this.x2 = 0;
		this.y2 = 0; // deuxièmes coordonnées
		this.canvasFilled = false;
		this.canvasContainer = $('#canvas_container'); // fait le lien avec la classe Resa
		this.clear = $('#clear_canvas'); // idem
		this.submit = $('#submit_canvas'); // idem
		this.click = function (e) { // crée une fonction stable qui permet au OFF de marcher
					console.log("bougé");
					e.preventDefault(); // permet de ne pas déclencher d'événement de souris si c'est en mode digital
					this.ctx.strokeStyle = 'grey';
					this.ctx.lineWidth = 4;
					this.ctx.lineJoin = 'round';
					this.ctx.lineCap = 'round';
					this.ctx.beginPath();
					this.ctx.moveTo(this.x, this.y);
					this.ctx.lineTo(this.x2, this.y2);
					console.log(this.x, this.y, this.x2, this.y2);
					this.ctx.closePath();
					this.ctx.stroke();
					this.canvasFilled = true; // le canvas est rempli
					console.log("canvas rempli");
		};
		this.draw = this.click.bind(this); // crée une nouvelle fonction attachée à la classe (this sera toujours la classe)
		this.initSettings(); // lance les premières propriétés + events
	}; // fin du constructor

	initSettings() {
		this.canvas.on('mousedown', (e) => { // clic
			console.log("MOUSEDOWN")
			this.canvas.on('mousemove', this.draw);
		});

		this.canvas.on('mouseup', (e) => { // clic relevé
			this.canvas.off('mousemove', this.draw);
		});

		this.canvas.on('mouseleave', (e) => { // la souris quitte le périmètre du Canvas
			this.canvas.off('mousemove', this.draw);
		});

		this.canvas.on('mousemove', (e) => { // la souris bouge sur le Canvas
			console.log("MOUSEMOVE")
			this.topCanvas = this.canvas[0].getBoundingClientRect().top;
			this.leftCanvas = this.canvas[0].getBoundingClientRect().left;
			this.x2 = this.x;
			this.y2 = this.y;
			this.x = e.clientX - this.leftCanvas; // coordonnées sur le viewport - leftCanvas
			this.y = e.clientY - this.topCanvas;
		});

		this.canvas.on('touchstart', (e) => {
			e.preventDefault();
			this.topCanvas = this.canvas[0].getBoundingClientRect().top;
			this.leftCanvas = this.canvas[0].getBoundingClientRect().left;
			this.x = e.touches[0].clientX - this.leftCanvas; // coordonnées sur le viewport - leftCanvas
			this.y = e.touches[0].clientY - this.topCanvas;
			this.canvas.on('touchmove', this.draw);
		});

		this.canvas.on('touchend', (e) => {
			e.preventDefault();
			this.canvas.off('touchmove', this.draw);
		});

		this.canvas.on('touchleave', (e) => {
			e.preventDefault();
			this.canvas.off('touchmove', this.draw);
		});

		this.canvas.on('touchmove', (e) => {
			e.preventDefault();
			this.x2 = this.x;
			this.y2 = this.y;
			this.x = e.touches[0].clientX - this.leftCanvas; // coordonnées sur le viewport - leftCanvas
			this.y = e.touches[0].clientY - this.topCanvas;
			console.log("TOUCHMOVE");
			console.log(this.x, this.y, this.x2, this.y2);
		});

		$(window).on('resize', (e) => {
			this.resize();
		});
	};

	resize() { // adapte la taille du canvas à celle de sa div
		this.canvas.prop('width', this.canvasDiv.width());
		this.canvas.prop('height', this.canvasDiv.height());
	};
}; // fin de la classe