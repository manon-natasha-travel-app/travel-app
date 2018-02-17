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
        $(".result-container").append("<p>Sorry there are no countries with those requirements. Sort Again!</p> <button>Sort!</button>");
    } else {
        filterdCountries.forEach(function(item){
            // $('body').text(item.countryName);
            console.log(item);
            // event.preventDefault();
            $(".result-container").append(`<img src="images/flags/${item.countryCode}.png">`);
        });
    };

};


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