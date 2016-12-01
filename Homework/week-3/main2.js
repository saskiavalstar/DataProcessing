// Saskia Valstar
// 11423404

window.onload = function() {
// get data from textarea in html-file
var obj = document.getElementById("data").value
// parse to JSON
var obj_parsed = JSON.parse(obj);

// create and fill dictionary for country codes
var dict_country = {};
for (var i = 0; i < country_codes.length; i++){
    dict_country[country_codes[i][2]] = country_codes[i][0];
}

// iterate over the data
for (var i = 0; i < obj_parsed.length; i++){
    // create variables
    var country = obj_parsed.telephone_use[i].country;
    var tel_lines = obj_parsed.telephone_use[i].telephone_lines;
    var id = dict_country[country];

    // different colors for different values
    if (0 <= tel_lines <= 1000){
        // fill in with another color
        changeColor("id", "#e0f3db");
    }
    else if (1000 < tel_lines <= 1000000){
        changeColor("id","#a8ddb5");
    }
    else if (tel_lines > 1000000){
        changeColor("id", "#43a2ca");
    }
}

// to show that the changeColor function works
changeColor("port", "#e0f3db");
changeColor("hu", "#a8ddb5");
changeColor("cz", "#43a2ca")
}

/* changeColor takes a path ID and a color (hex value)
   and changes that path's fill color */
function changeColor(id, color) {
  var myElement = document.getElementById(id);
  myElement.style.color = color;
}

