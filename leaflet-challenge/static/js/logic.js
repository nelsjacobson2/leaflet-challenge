// Create a map instance
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2,
  });
  
  // Base map layers
  var streetMap = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
  });
  var satelliteMap = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    attribution: 'Map data &copy; <a href="https://www.arcgis.com/">ArcGIS</a>',
    maxZoom: 18,
  });
  
  // Overlay layers
  var earthquakes = L.layerGroup().addTo(myMap);
  
  // URL for the earthquake data in GeoJSON format
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  
  // Fetch the earthquake data using D3
  d3.json(url).then(function (data) {
    // Loop through the earthquake data
    data.features.forEach(function (earthquake) {
      // Extract the necessary properties from the data
      var magnitude = earthquake.properties.mag;
      var depth = earthquake.geometry.coordinates[2];
      var latitude = earthquake.geometry.coordinates[1];
      var longitude = earthquake.geometry.coordinates[0];
  
      // Create a marker with size and color based on magnitude and depth
      var marker = L.circleMarker([latitude, longitude], {
        radius: magnitude * 3,
        fillColor: getColor(depth),
        color: "#000",
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.8,
      })
        .bindPopup(
          "Magnitude: " + magnitude +
          "<br>Location: " + earthquake.properties.place +
          "<br>Depth: " + depth + " km"
        );
  
      // Add the marker to the earthquakes layer
      marker.addTo(earthquakes);
    });
  });
  
  // Create a legend control
  var legend = L.control({ position: "bottomright" });
  
  // Define the legend content
  legend.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");
    var depths = [0, 10, 30, 50];
    var labels = [];
  
    for (var i = 0; i < depths.length; i++) {
      div.innerHTML +=
        '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + ' km<br>' : '+ km');
    }
  
    return div;
  };
  
  // Add the legend to the map
  legend.addTo(myMap);
  
  // Define base map layers
  var baseMaps = {
    "Street Map": streetMap,
    "Satellite Map": satelliteMap,
  };
  
  // Define overlay map layers
  var overlayMaps = {
    "Earthquakes": earthquakes,
  };
  
  // Add layer controls to the map
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);
  
  function getColor(depth) {
    if (depth < 10) {
      return "#00FF00"; // Green
    } else if (depth < 30) {
      return "#FFFF00"; // Yellow
    } else if (depth < 50) {
      return "#FFA500"; // Orange
    } else {
      return "#FF0000"; // Red
    }
  }
  