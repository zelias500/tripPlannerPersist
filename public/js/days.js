'use strict';
/* global $ mapModule */

var days; 
var currentDay;
var daysModule = (function(){

  
  // Promise.resolve(
  //   $.get("/api/days")
  //   ).then(function(result){

  // });
  // console.log(days);
  var exports = {}
      // days = [{
      //   hotels:      [],
      //   restaurants: [],
      //   activities:  []
      // }],
      // var currentDay;

  function addDay () {
    // days.push({
    //   hotels: [],
    //   restaurants: [],
    //   activities: []
    // });
    $.post("/api/days", function (newDay) {
      days.push(newDay);
      renderDayButtons();
      switchDay(days.length - 1);
    });
  }

  function switchDay (index) {
    var $title = $('#day-title');
    if (index >= days.length) index = days.length - 1;
    $title.children('span').remove();
    $title.prepend('<span>Day ' + (index + 1) + '</span>');
    currentDay = days[index];
    renderDay();
    renderDayButtons();
  }

  function removeCurrentDay () {
    if (days.length === 1) return;
    var index = days.indexOf(currentDay);
    days.splice(index, 1);
    switchDay(index);
  }

  function renderDayButtons () {
    var $daySelect = $('#day-select');
    $daySelect.empty();
    days.forEach(function(day, i){
      $daySelect.append(daySelectHTML(day, i, day === currentDay));
    });
    $daySelect.append('<button class="btn btn-circle day-btn new-day-btn">+</button>');
  }

  function daySelectHTML (day, i, isCurrentDay) {
    return '<button class="btn btn-circle day-btn' + (isCurrentDay ? ' current-day' : '') + '">' + (i + 1) + '</button>';
  }

  exports.addAttraction = function(attraction) {
    if (currentDay[attraction.type].indexOf(attraction) !== -1) return;
    $.post("/api/days/" + currentDay._id + "/add", {type: attraction.type, attractionId: attraction._id}, function (day) {
      days[day.number-1] = day;
      currentDay = days[day.number-1];
      renderDay(currentDay);
      console.log(day)
    });
    // currentDay[attraction.type].push(attraction);
  };

  exports.removeAttraction = function (attraction) {
    $.ajax({
      url: "/api/days/" + currentDay._id + "/remove",
      method: "DELETE",
      data: {type: attraction.type, attractionId: attraction._id},
      success: function(day){
        days[day.number-1] = day;
        currentDay = days[day.number-1];
        renderDay(currentDay);
        console.log(day)
      },
      error: function(error){
        console.error(error.message)
      }


    })
  };

  function renderDay(day) {
    mapModule.eraseMarkers();
    day = day || currentDay;
    Object.keys(day).forEach(function(type){
      var $list = $('#itinerary ul[data-type="' + type + '"]');
      $list.empty();
      if(Array.isArray(day[type])) day[type].forEach(function(attraction){
        $list.append(itineraryHTML(attraction, type));
        // mapModule.drawAttraction(attraction);
      });
    });
  }

  function itineraryHTML (attraction, type) {
    return '<div class="itinerary-item><span class="title>' + attraction.name + '</span><button data-id="' + attraction._id + '" data-type="' + type + '" class="btn btn-xs btn-danger remove btn-circle">x</button></div>';
  }

  $(document).ready(function(){
    $.get("/api/days", function(data){
      days = data;
      if (!days.length) {
        $.post('/api/days', function () {
          switchDay(0)
        });
      } else {
        switchDay(0);
      }
    })
    $('.day-buttons').on('click', '.new-day-btn', addDay);
    $('.day-buttons').on('click', 'button:not(.new-day-btn)', function() {
      switchDay($(this).index());
    });
    $('#day-title').on('click', '.remove', removeCurrentDay);
  });

  return exports;

}());
