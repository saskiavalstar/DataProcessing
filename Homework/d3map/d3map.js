d3.json("tel_data.json", function(error, data) {
if (error) throw error;
data_set = {};
    data.forEach(function(d) {
        // create dictionary for country codes
        var dict_country = {};
        for (var i = 0; i < country_codes.length; i++){
            dict_country[country_codes[i][2]] = country_codes[i][1];
        }
        //console.log(dict_country)

        // initialize variables from json file
//        console.log(dict_country[d.country])
        var country_code = dict_country[d.country];
        var country_value = +d.telephone_lines;

        if (country_value > 0 && country_value <= 1000){
            var fill_value = "LOW";
        }

        else if (country_value > 1000 && country_value <= 2000000){
            fill_value = "MEDIUM";
        }

        else if(country_value > 2000000 && country_value <= 10000000){
            fill_value = "HIGH"
        }

        else if(country_value > 10000000){
            fill_value = "SUPERHIGH"
        }

        for (var i = 0; i < country_codes.length; i++){
            var land = country_code;
            data_set[land] = {fillKey: fill_value, telephonelines: country_value, name: country_codes[i][2]};
        }
    });
   console.log(data_set);

//    $("#container1").datamap({
//        scope: 'world',
//        geography_config: {
//        borderColor: 'rgba(255,255,255,0.3)',
//        highlightBorderColor: 'rgba(0,0,0,0.6)',
//        popupTemplate: _.template([
//            '<div class="hoverinfo">',
//            '<% if (data.land) { %> <strong><%= data.land %></strong><br/><% } %>',
//            '<% if (data.telephonelines) { %>',
//            'Main telephone lines <%= data.telephones %><br/> <% } %>',
//            '<%= geography.properties.name %>',
//            '</div>'
//        ].join('') )
//        },
//        fills: {
//            defaultFill: '#ffffd4',
//            LOW: '#fed98e',
//            MEDIUM: '#fe9929',
//            HIGH: '#d95f0e',
//            SUPERHIGH: '#993404'
//        },
//
//    data: data_set
//
//});

var map = new Datamap({
        element: document.getElementById('container1'),
        fills: {
            defaultFill: '#ffffd4',
            LOW: '#fed98e',
            MEDIUM: '#fe9929',
            HIGH: '#d95f0e',
            SUPERHIGH: '#993404'
        },

        data: data_set

    });

    // Draw a legend for this map
    map.legend();

});


