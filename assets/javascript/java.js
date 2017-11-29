var config = {
    apiKey: "AIzaSyCZYwUg7g4YWX9e-QGzIwTQJawJDg33hBI",
    authDomain: "yiphy-54fb8.firebaseapp.com",
    databaseURL: "https://yiphy-54fb8.firebaseio.com",
    projectId: "yiphy-54fb8",
    storageBucket: "yiphy-54fb8.appspot.com",
    messagingSenderId: "615405965433"
};

firebase.initializeApp(config);

var database = firebase.database();
var connectionsRef = database.ref("/connections");
var connectedRef = database.ref(".info/connected");

connectedRef.on("value", function(snap) {
  if (snap.val()) {

    var con = connectionsRef.push(true);
    con.onDisconnect().remove();
  }

});	

connectionsRef.on("value", function(snap){
	$("#tracker").text("Number of Hungry & Indecisive: " + snap.numChildren());
})

$( document ).ready(function() {
var clientId = "GVzLb3etgppDU-TL0QTdmw";
var clientSecret = "WPZaGbBfqsgJcCxBIZPq6f61Dz38o3IWeBCZK1AywQInXMY2ufU4w9yN5tUHx8nV";
var token = "";
var yelpUrl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search";
var term = "";
var location = "";
var radius = "";
var price = "";
$(document).on("click", "#radius", function(){
		radius = parseInt($(this).val());
	});
$(document).on("click", "#price", function(){
		price = $(this).val();
	})

function yelpToken(){
	$.ajax({
		method: "POST",
		url: "https://cors-anywhere.herokuapp.com/https://api.yelp.com/oauth2/token",
		data: {'grant_type': 'client_credentials', 'client_id': clientId, 'client_secret': clientSecret}
	}).done(function(response3){
		console.log(response3);
		token = "Bearer " + response3.access_token;
		console.log(token);
		term = $("#textinput").val().trim();
		location = $("#textinput2").val().trim();
		$.ajax({
			url: yelpUrl,
			method: "GET",
			headers: {'Authorization': token},
			data: {term: term, location: location, radius: radius, price: price, limit: '10', open_now: true}
		}).done(function(response){
			var resultsYelp = response.businesses;
			var category = $("#textinput").val().trim();
			var apiKey = "HnNAzp85eI02Rb98Lo5C1oOviJp4OHJT";
			var queryURL = "https://api.giphy.com/v1/gifs/search?q=" + category + "&api_key=" + apiKey;
			var display = false;
			var yelpLink = "";
			$.ajax({
				url: queryURL,
				method: "GET"
			}).done(function(response2){
				console.log(resultsYelp)
				var resultsGiphy = response2.data;
				console.log(resultsGiphy);
				$("#textinput").val('');
				$("#textinput2").val('');
				term = "";
				location = "";
				radius = "";
				price = "";
				if (display = true){
					$("#row1").empty();
					$("#row2").empty();
					for(var i = 0; i < 10; ++i){
						var  giphyLinks = $("<a target='_blank'>").attr('href', resultsYelp[i].url).html($("<img>").attr("src", resultsGiphy[i].images.fixed_height.url));
						if( i < 5){
							$("#row1").append(giphyLinks);
						}
						else if (i >= 5){
							$("#row2").append(giphyLinks);
						}

					}
				}
			else if (display = false){
				for(var i = 0; i < 10; ++i){
					var  giphyLinks = $("<a target='_blank'>").attr('href', resultsYelp[i].url).html($("<img>").attr("src", resultsGiphy[i].images.fixed_height.url));
					if( i < 5){
							$("#row1").append(giphyLinks);
						}
					else if (i >= 5){
							$("#row2").append(giphyLinks);
						}
					display = true;
				}
			}
		});
	});
	})
}

	$(document).on("click", "#search", yelpToken);
});
