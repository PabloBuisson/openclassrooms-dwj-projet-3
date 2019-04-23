/* REGROUPE CLASSES JS SLIDER, MAP, RESA, CANVAS */

$(document).ready(function() {
	let sliderVelos = new SliderClass('#slider_container', 5000, 1000, 1000);
	let mapVelos = new MapClass('#map_container','map', 43.605000, 1.440466, 12, 'https://api.jcdecaux.com/vls/v1/stations?contract=Toulouse&apiKey=f6a9c95e2374d74194c77cd797a18bb712c237d9');
	let resaVelos = new ResaClass('#form_bikes', 20 * 60 * 1000, new CanvasClass('#canvas_div', '#canvas_resa'));
	let canvasVelos = new CanvasClass('#canvas_div', '#canvas_resa');
});
