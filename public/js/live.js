var markerArr =[]
var map;
//find obj with correct name
//push lat/lon
function drawLocation (location, opts) {
  if (typeof opts !== 'object') {
      opts = {}
  }
  opts.position = new google.maps.LatLng(location[0], location[1]);
  opts.map = map;
  var marker = new google.maps.Marker(opts);
  markerArr.push(marker);
}
function initialize_gmaps() {
    // initialize new google maps LatLng object
    var myLatlng = new google.maps.LatLng(40.705786,-74.007672);
    // set the map options hash
    var mapOptions = {
        center: myLatlng,
        zoom: 13,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    // get the maps div's HTML obj
    var map_canvas_obj = document.getElementById("map-canvas");
    // initialize a new Google Map with the options
    map = new google.maps.Map(map_canvas_obj, mapOptions);
    // Add the marker to the map
    var marker = new google.maps.Marker({
        position: myLatlng,
        title:"Hello World!"
    });

}

$(document).ready(function() {
    initialize_gmaps();
});


function setItem (section, name) {
	$(".list-" + section).append("<div class='itinerary-item'><span class='title'>" + name + "</span><button class='btn btn-xs btn-danger remove btn-circle'>x</button></div>");
}

function clearSection (section){
	$(".list-" + section).empty();
}

var days = [];

function removeItem (name, day){
	for (var key in days[day]){
		for (var i = 0; i < days[day][key].length; i++){
			if(days[day][key][i].name === name) {
				days[day][key].splice(i, 1);
			}
		}
	}
}

function drawAll(day){
	for(var section in day){
		for(var i = 0; i < day[section].length; i++){
			drawLocation(day[section][i].place[0].location, day[section][i].image);
		}
	}
}

$(document).ready(function(){
	var currentDay = 0;

	var Day = function(){
		this.hotel=[], 
		this.restaurant=[], 
		this.todo=[]
		//this.markerArr = []
	}
	var one = new Day;
	days.push(one);


	$('.hotel-select, .restaurant-select, .todo-select').on('click', function (){
		var $section = $(this).attr('class').split(' ')[0].slice(0, -7);
		var $item = $(this).siblings('select').children(':selected').text();
		//days[currentDay][""+ $section].push(""+$item);
		setItem($section, $item);


		all_hotels.forEach(function(hotel) {
			if (hotel.name === $item){
				hotel.image = {
            icon: '/images/lodging_0star.png'
        };
				days[currentDay][""+ $section].push(hotel);
			}
		})
		all_restaurants.forEach(function(rest){
			if (rest.name === $item){
				rest.image = {
            icon: '/images/restaurant.png'
        }
				days[currentDay][""+ $section].push(rest);
			}
		})
		all_things_to_do.forEach(function(todo){
			if (todo.name === $item){
				todo.image = {
            icon: '/images/star-3.png'
        }
				days[currentDay][""+ $section].push(todo);
			}
		})

		drawAll(days[currentDay]);

	});


	$('.list-group').on('click', '.remove', function(){
		var len = $(this).parent().text().length;
		console.log("before: ", days[currentDay]);
		removeItem($(this).parent().text().slice(0, len-1), currentDay);
		$(this).parent().remove();
		console.log("after: ", days[currentDay]);

		markerArr.forEach(function (mark){
			mark.setMap(null);
		})
		markerArr = [];
		drawAll(days[currentDay]);

	})

	$('.add-day').on('click', function(){
		var lastSibNum = $(this).siblings().length - 1;
		var nextVal = Number($($(this).siblings()[lastSibNum]).text()) + 1;
		$('.add-day').before('<button class="btn btn-circle day-btn">' + nextVal + '</button>');
		var newDay = new Day;
		days.push(newDay);
	})

	$(".day-buttons").on('click', 'button:not(.add-day, .current-day)', function () {

		//remove previous days marker
		markerArr.forEach(function (mark){
			mark.setMap(null);
		})
		markerArr = [];


		$('.current-day').removeClass('current-day');


		$(this).addClass('current-day');
		currentDay = Number($(this).text()) - 1;

		//render stuff for current day
		clearSection("group");
		for(var key in days[currentDay]){
			for(var i = 0; i < days[currentDay][key].length; i++){
				setItem(key, days[currentDay][key][i].name);
			}
		}

		drawAll(days[currentDay]);
	});



})


