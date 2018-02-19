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
            data: "happiness_index,forest_area_percent,density,size,bigmac_index,internetusers_percent,corruption_index,tourist_arrivals,size,population"
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
                internetusers_percent: index.internetusers_percent,
                density: index.density,
                corruption_index: index.corruption_index,
                bigmac_index: index.bigmac_index, 
                tourist_arrivals: index.tourist_arrivals,
                size: index.size,
                population: index.population
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
        $('.loading').hide();
    });
}
function scroll(selectDiv, selectButton) {
    var viewportHeight = Math.max(window.innerHeight || 0);
    var marginTop = viewportHeight * 5 / 100;
    var scrollTopTarget = selectDiv.offset().top;
    var scrollTopValue = scrollTopTarget - marginTop;
    $('html').animate({
        scrollTop: scrollTopValue,
    }, 1000);
    
    // if (selectButton !== undefined){
    //     selectButton.addClass("rotate");
    // }
};


$('#firstButton').on('click', function(){
    scroll($('.firstDiv'), $('#firstButton'))
});

$('#secButton').on('click', function () {
    scroll($('.secDiv'), $('#secButton'))
});
$('#thirdButton').on('click', function () {
    scroll($('.thirdDiv'), $('#thirdButton'))
})

$('#fourthButton').on('click', function () {
    // console.log($('.results'))
    $('.results').removeClass('hidden')
    // console.log($('.results'))
    scroll($('.results') )
})




travelSearch.displayCountry = (filterdCountries) => {
    if (filterdCountries.length === 0) {
        $(".flag").append("<h2>Sorry there are no countries with those requirements. Sort Again!</h2>  <button class='reset'>Sort!</button>");

        $('.reset').on('click', function () {
            $('html').animate({
                scrollTop: $('#countryParams').offset().top
            }, 1000);
            $('.flag').empty();
            console.log("This is clicked");
        });
    } else {
        filterdCountries.forEach(function(item){
            console.log(item);
            // event.preventDefault();
            $(".flag").append(`<div class=${item.countryCode}><img  src="images/flags/${item.countryCode}.png"></div><button class='reset'>Sort!</button>`);
            $('.reset').on('click', function () {
                $('html').animate({
                    scrollTop: $('#countryParams').offset().top
                }, 1000);
                $('.flag').empty();
                console.log("This is clicked"); 
            });
            $(`.${item.countryCode}`).on("click", function () {
                $(".pop-up").toggleClass("hidden");
                $(".overlay").toggleClass("greyed");

                
                
                const title = $('<h2>').text(`Your next destination will be ${item.countryName}!`)

                // const population = $('<p>').text(`This country is worth checking out and ${item.population} locals will give you a warm welcome!`)

                const population_n = parseInt(item.population).toLocaleString();
                const population = $('<p>').text(`This country is worth checking out and ${population_n} locals will give you a warm welcome!`)

                const bigmac = parseInt(item.bigmac_index);

                const bigmacInfo = $('<p>').text(`On a two week vacation, you will spend approximately $${bigmac * 4} if you only eat Big Macs!`)

                const density = $('<p>').text(`Per square kilometer there are approximateld ${item.density} other personson. Time to get nice and cozy with the locals!`)

                const tourist = $('<p>').text(`Last year ${item.tourist_arrivals} other people had the same brilliant idea to visit this wonderfull country, so you will not regret this choice!`)

                const size = $('<p>').text(`There are ${item.size} square kilometers for you to discover, wait no longer!`)

                console.log(`${item.countryCode}` === item.countryCode)
                if (`${item.countryCode}` === item.countryCode) {
                    ($('.pop-up').append(title, population, size, density, bigmacInfo, tourist)).show();
                } else {
                    console.log('fuck')
                }
            });
            $(".pop-up").on("click", function () {
                console.log('disapear')
                $(this).toggleClass("hidden").empty();
                $(".overlay").toggleClass("greyed");
            })
        });
        
    };

};

travelSearch.scrollNext = () => {
    $('.toCountryParams').on('change', function () {
        $('html').animate({
            scrollTop: $('#countryParams').offset().top
        }, 1000);
    });
    $('.toSecondQuestion').on('change', function () {
        $('html').animate({
            scrollTop: $('#secondQuestion').offset().top
        }, 1000);
    });
    $('.toThirdQuestion').on('change', function () {
        $('html').animate({
            scrollTop: $('#thirdQuestion').offset().top
        }, 1000);
    });
}

// $('button').on('click', function () {
//     $('html').animate({
//         scrollTop: $('#scrollStop').offset().top
//     }, 1000);
// });

//creates function to launch our app on page load
travelSearch.init = () => {
    travelSearch.filterCountry();
    travelSearch.scrollNext();
}

//document ready
$(function () {
    travelSearch.init();
});