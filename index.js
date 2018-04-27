// window.onload = function(){
// 	alert('loaded')
// } //funciona igual que .ready pero es mas lento por que primero debe de cargar todo el documento

// $(document).ready(function(){
// 	alert('ready')
// }) 


//Manera resumida de escribir .ready codigo de arriba
/*$(function(){
	var header = document.getElementById('app-header')
	var seleccion = $([ document, header]);

	$('#app-header').find('h1') //tip buscar elementos primero por id y luego el elemnto
	//$('#app-header').has('h1')
	//$('#app-header').not('h1')
	//$('p').filter('h1') //<p class="text"></p>
})*/

$(function() {
	var $tvShowsContainer = $('#app-body').find('.tv-shows') //busca el elemento tc-show que esta dento de app-body y guarda el resultado en la variable $tvShowsContainer

	function renderShows(shows) {
		$tvShowsContainer.find('.loader').remove();
		shows.forEach(function (show) { //muestra cada uno de los registros devueltos
	 			var article = template //tranfiere el valor de template a la variable article
	 				.replace(':name:', show.name) //Remplasa el tecto del template con con la data recibida
	 				.replace(':img:', show.image ? show.image.medium : '')// verifica que exista la imagen promero 
	 				.replace(':summary:', show.summary)
	 				.replace(':img alt:', show.name + " logo")

	 				
	 				var $article = $(article)
	 				$tvShowsContainer.append($article.fadeIn(3500)); //agrega cada article recibito desde la api
	 	})
	}
	/**
	* Submit search form
	*/

	$('#app-body')
		.find('form')
		.submit(function (ev) {
			ev.preventDefault();
			var busqueda = $(this)
				.find('input[type="text"]')
				. val();

			$tvShowsContainer.find('.tv-show').remove()
			var $loader = $('<div class="loader">');
			$loader.appendTo($tvShowsContainer);
			$.ajax({
				url: ' http://api.tvmaze.com/search/shows',
				data: { q: busqueda },
				success: function (res,textStatus, xhr) {
					$loader.remove();
					var shows = res.map(function(el) { //modifica el objeto obtenido y solo se queda con la parte del show
						return el.show;
					})

					renderShows(shows);
				}
			})
		})


	var template = '<article class="tv-show">' +
					'<div class="left img-container">' +
						'<img src=":img:" alt=":img alt:">' +
					'</div>' +
					'<div class="right info">' +
						'<h1>:name:</h1>' +
						'<p>:summary:</p>' +
					'</div>' +
				'</article>';


	 // $.ajax({ // usando callback
	 // 	url: 'http://api.tvmaze.com/shows',
	 // 	success: function (shows, textStatus, xhr) {
	 // 		$tvShowsContainer.find('.loader').remove(); //Quita el spiner de load al recibir la data	
	 // 		renderShows(shows);
	 // 	}
	 // }) 	

	  // $.ajax('http://api.tvmaze.com/shows') // usando Promesas
	  // 	.then(function(shows) {
	  // 		$tvShowsContainer.find('.loader').remove(); //Quita el spiner de load al recibir la data	
	 	// 	renderShows(shows);
	  // 	})

	  if(!localStorage.shows){ //si no existe el localstorage lo contruye
	  	$.ajax('http://api.tvmaze.com/shows') // usando Promesas y localstorage
	  	.then(function(shows) {
	  		$tvShowsContainer.find('.loader').remove(); //Quita el spiner de load al recibir la data	
	 		localStorage.shows = JSON.stringify(shows); //guarda los datos en cache y los comvierte en una cadena
	 		renderShows(shows);
	  	})
	  } else { // si ya existe solo lo consulta
	  	renderShows(JSON.parse(localStorage.shows));// convierte de string a json
	  }
	  
})