//empty object
const travelSearch = {}

// const userDuration = $("#duration").val();
// console.log(userDuration);

// const userHappiness = $("#happinessValue").val();
// console.log(userHappiness);

//first get user value and then make the ajax request

travelSearch.filterCountry = () => {

    $("form").on("submit", function (event) {
        event.preventDefault();
        userHappiness = $("input[name=happinessValue]").val();
        console.log(userHappiness);

        userForest = $("input[name=forestValue]").val();
        console.log(userForest);

        userInternet = $("input[name=internetValue]").val();
        console.log(userInternet);


        // userInputs = userHappiness, userForest, userInternet;
        travelSearch.getCountry(userHappiness);
    })
}

//function to get the location data from the api 

travelSearch.getCountry = (userInputs) => {
    $.ajax({
        url: "http://inqstatsapi.inqubu.com",
        dataType: "json",
        method: "GET",
        data: {
            api_key: "9524b504493adb49",
            format: "json",
            cmd: "getWorldData",
            data: "happiness_index,forest_area_percent,density,size,bigmac_index,internetusers_percent,corruption_index,fifa"
        }
    }).then(function (res) {
        console.log(res);

        //simplify my array
        const mappedCountries = res.map(function(index){
            return {
                countryName: index.countryName,
                countryCode: index.countryCode,
                happiness_index: index.happiness_index,
                forest_area_percent: index.forest_area_percent,
                density: index.density,
                corruption_index: index.corruption_index,
                bigmac_index: index.bigmac_index,
                internetusers_percent: index.internetusers_percent
            }
        });
        console.log(mappedCountries);

        const filterdCountries = mappedCountries.filter(function(item){
            return item.internetusers_percent < (userInternet + 25) && item.internetusers_percent > (userInternet - 25);
        }).filter(function (item) {
            return item.forest_area_percent < (userForest + 15) && item.forest_area_percent > (userForest - 15);
        }).filter(function(item) {
            return item.happiness_index < (userHappiness + 500) && item.happiness_index > (userHappiness - 500);
        });

        travelSearch.displayCountry(filterdCountries);
        console.log(filterdCountries);
    });
}




travelSearch.displayCountry = (filterdCountries) => {
    if(filterdCountries.length === 0) {
        $(".result-flags").append("<h2>Sorry there are no countries with those requirements. Sort Again!</h2> <button>Sort!</button>");
    } else {
        filterdCountries.forEach(function(item){
            console.log(item);
            // event.preventDefault();
            $(".flag").append(`<div class=${item.countryCode}><img  src="images/flags/${item.countryCode}.png"></div>`); 

            $(`.${item.countryCode}`).on("click", function () {
                $(".pop-up").toggleClass("hidden");
                $(".overlay").toggleClass("greyed");
                
                const title = $('<h2>').text(`Your next destination should be ${item.countryName}`)
                
                const bigmac = parseInt(item.bigmac_index);
                
                const info = $('<p>').text(`You will spend approximately $${bigmac * 4} on a two week vacation if you only eat Big Macs`)
                
                if (`${item.countryCode}` === item.countryCode) {
                    ($('.pop-up').append(title, info)).show();
                } else {
    
                }
            });
            $(".pop-up").on("click", function(){
                $(this).toggleClass("hidden");
                $(".overlay").toggleClass("greyed");
            })
        });
    };

};

$('.reset').on('click', function(){
    $('form').empty("result-container");
});


$('button').on('click', function () {
    $('html').animate({
        scrollTop: $('#scrollStop').offset().top
    }, 1000);
});

//creates function to launch our app on page load
travelSearch.init = () => {
    travelSearch.filterCountry();
}

//document ready
$(function () {
    travelSearch.init();
});