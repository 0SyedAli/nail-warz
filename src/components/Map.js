// components/Map.js
import { useEffect } from "react";

const Map = () => {
  useEffect(() => {
    const initAutocomplete = () => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: {
          lat: -33.8688,
          lng: 151.2195,
        },
        zoom: 13,
        mapTypeId: "roadmap",
      });

      const input = document.getElementById("pac-input");
      const searchBox = new google.maps.places.SearchBox(input);

      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      map.addListener("bounds_changed", () => {
        searchBox.setBounds(map.getBounds());
      });

      let markers = [];

      searchBox.addListener("places_changed", () => {
        const places = searchBox.getPlaces();

        if (places.length === 0) {
          return;
        }

        markers.forEach((marker) => {
          marker.setMap(null);
        });
        markers = [];

        const bounds = new google.maps.LatLngBounds();

        places.forEach((place) => {
          if (!place.geometry || !place.geometry.location) {
            console.log("Returned place contains no geometry");
            return;
          }

          const icon = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25),
          };

          markers.push(
            new google.maps.Marker({
              map,
              icon,
              title: place.name,
              position: place.geometry.location,
            })
          );
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location);
          }
        });
        map.fitBounds(bounds);
      });
    };

    // Load Google Maps script dynamically
    const script = document.createElement("script");
    // script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyCXf-3r_0uMjpEzwZKA_MfIVBMbCY8xAlo&callback=initAutocomplete&libraries=places&v=weekly`;
    script.async = true;
    script.onload = () => {
      if (window.google) {
        initAutocomplete();
      }
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div>
      <input
        id="pac-input"
        type="text"
        placeholder="Enter a location"
        style={{ width: "400px", height: "30px", margin: "10px" }}
      />
      <div id="map" style={{ height: "500px", width: "100%" }}></div>
    </div>
  );
};

export default Map;
