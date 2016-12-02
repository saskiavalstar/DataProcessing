d3.json("tel_data.json", function(error, data) {
if (error) throw error;
data_set = {};
    data.forEach(function(d) {
        // create dictionary for country codes
        var dict_country = {};
        for (var i = 0; i < country_codes.length; i++){
            dict_country[country_codes[i][2]] = country_codes[i][1];
        }

        // initialize variables from json file
        var country_code = dict_country[d.country];
        var country_value = +d.telephone_lines;

        // create variables with colors to fill for each range of values
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

        // create structure with country code with object for whole dataset
        for (var i = 0; i < country_codes.length; i++){
            var land = country_code;
            data_set[land] = {fillKey: fill_value, telephonelines: country_value, name: country_codes[i][2]};
        }
    });

    // draw map
    $("#container1").datamap({
        scope: 'world',
        geography_config: {
        borderColor: 'rgba(200,200,200,0.3)',
        highlightBorderColor: 'rgba(0,0,0,0.6)',
        popupTemplate: _.template([
            '<div class="hoverinfo">',
            '<% if (data.land) { %> <strong><%= data.land %></strong><br/><% } %>',
            '<% if (data.telephonelines) { %>',
            'Main telephone lines: <%= data.telephonelines %><br/> <% } %>',
            '<%= geography.properties.name %>',
            '</div>'
        ].join('') )
        },
        fills: {
            defaultFill: '#ffffff',
            LOW: '#fed98e',
            MEDIUM: '#fe9929',
            HIGH: '#d95f0e',
            SUPERHIGH: '#993404'
        },

    data: data_set

    });
});
// Ik heb geprobeerd hiermee de legenda te maken (de hooverfunctie zou ik later nog
// implementeren), maar helaas werkte de hele kaart daardoor niet meer. Ik vermoed
// dat het aan mijn scripts ligt die blijkbaar 'new Datamap' niet ondersteund, maar
// het lukte mij niet om dit zelf op te lossen.
//
//var map = new Datamap({
//        element: document.getElementById('container1'),
//        fills: {
//            defaultFill: '#ffffd4',
//            LOW: '#fed98e',
//            MEDIUM: '#fe9929',
//            HIGH: '#d95f0e',
//            SUPERHIGH: '#993404'
//        },
//
//        data: data_set
//
//    });
//
//    // Draw a legend for this map
//    map.legend();




