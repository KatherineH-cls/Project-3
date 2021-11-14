// use d3 json to read the json file that was extracted from MongoDB

d3.csv("../Resources/bond_girls_data.csv").then(data=>{
  console.log(data)
  // create variables to store fire coordinates in json file for each state
  // var WA_fires=data[0].fire_coordinates;
  // var SA_fires=data[1].fire_coordinates;
  // var VIC_fires=data[2].fire_coordinates;
  // var NSW_fires=data[3].fire_coordinates;
  // var QLD_fires=data[4].fire_coordinates;
  // var NT_fires=data[5].fire_coordinates;

  // // Define arrays to hold created bushfire location of each respective states which can be passed on to leaflet
  //   var WA_fire=[];
  //   var SA_fire=[];
  //   var VIC_fire = [];
  //   var NSW_fire = [];
  //   var QLD_fire = [];
  //   var NT_fire = [];

  // // Push the bushfire coordinates to its respective variable
  //   WA_fire.push(
  //     L.polygon(WA_fires, {
  //       stroke: false,
  //       fillOpacity: 0.75,
  //       color: "none",
  //       fillColor: "#ff0000",
  //     })
  //   );

  //   SA_fire.push(
  //     L.polygon(SA_fires, {
  //       stroke: false,
  //       fillOpacity: 0.75,
  //       color: "none",
  //       fillColor: "#ff5030",
  //     })
  //   );

  //   VIC_fire.push(
  //     L.polygon(VIC_fires, {
  //       stroke: false,
  //       fillOpacity: 0.75,
  //       color: "none",
  //       fillColor: "#ff7656",
  //     })
  //   );

  //   NSW_fire.push(
  //     L.polygon(NSW_fires, {
  //       stroke: false,
  //       fillOpacity: 0.75,
  //       color: "none",
  //       fillColor: "#ff977b",
  //     })
  //   );

  //   QLD_fire.push(
  //     L.polygon(QLD_fires, {
  //       stroke: false,
  //       fillOpacity: 0.75,
  //       color: "none",
  //       fillColor: "#ffa343",
  //     })
  //   );

  //   NT_fire.push(
  //     L.polygon(NT_fires, {
  //       stroke: false,
  //       fillOpacity: 0.75,
  //       color: "none",
  //       fillColor: "#ff930f",
  //     })
  //   );
  // // Create base layers

  // // Streetmap Layer
  // var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  //   attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  //   tileSize: 512,
  //   maxZoom: 18,
  //   zoomOffset: -1,
  //   id: "mapbox/streets-v11",
  //   accessToken: API_KEY
  // });

  // var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  //   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  //   maxZoom: 18,
  //   id: "dark-v10",
  //   accessToken: API_KEY
  // });

  // // Create separate layer groups for each states
  // var WA_bushfire = L.layerGroup(WA_fire);
  // var SA_bushfire = L.layerGroup(SA_fire);
  // var VIC_bushfire = L.layerGroup(VIC_fire);
  // var NSW_bushfire = L.layerGroup(NSW_fire);
  // var QLD_bushfire = L.layerGroup(QLD_fire);
  // var NT_bushfire = L.layerGroup(NT_fire);

  // // Create a baseMaps object
  // var baseMaps = {
  //   "Street Map": streetmap,
  //   "Dark Map": darkmap
  // };

  // // Create an overlay object
  // var overlayMaps = {
  //   "WA bushfire": WA_bushfire,
  //   "SA bushfire": SA_bushfire,
  //   "VIC bushfire": VIC_bushfire,
  //   "NSW bushfire": NSW_bushfire,
  //   "QLD bushfire": QLD_bushfire,
  //   "NT bushfire": NT_bushfire,
  // };

  // // Define a map object
  // var myMap = L.map("map", {
  //   center: [-25.27, 133.77],
  //   zoom: 4,
  //   layers: [streetmap, WA_bushfire, SA_bushfire, VIC_bushfire, NSW_bushfire, QLD_bushfire, NT_bushfire]
  // });

  // // Pass our map layers into our layer control
  // // Add the layer control to the map
  // L.control.layers(baseMaps, overlayMaps, {
  //   collapsed: false
  // }).addTo(myMap);

  // // add a popup that shows each states' population upon mouseover
  // // create variables to store state area coordinates, state name, and state population
  
  // for (var i=0; i<data.length; i++){
  //   L.polygon(data[i].state_coordinates,{stroke: false,
  //     fillOpacity: 0.0,
  //     color: "black",
  //     fillColor: "white"})
  //     .bindPopup("State: "+ data[i].territory.name + "<br> State Population: "+data[i].territory.population)
  //     .addTo(myMap).on('mouseover', function (e) {this.openPopup()})
  //     .on('mouseout', function (e) {this.closePopup()});
  // }

})