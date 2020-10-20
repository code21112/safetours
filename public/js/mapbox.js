// /* eslint-disable */

// const locations = JSON.parse(document.getElementById('map').dataset.locations);
// console.log(locations);


export const displayMap = (locations) => {
    // Public token
    // mapboxgl.accessToken = 'pk.eyJ1IjoiY29kZTIxMTEyIiwiYSI6ImNrZzdiNXc1NjA1cTkycm8yY25qYXpyeXUifQ.XsgocSqnkz2Y4_SNL0ikaA';

    mapboxgl.accessToken = 'pk.eyJ1IjoiY29kZTIxMTEyIiwiYSI6ImNrZzdmeWM3ODAzMWEyeW1oaG45ZnQ3ZTUifQ.6YmbiijngwPPjgL78jowIQ';

    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/code21112/ckg893lqj00do19n3nf25sckd',
        center: [locations[0].coordinates[0], locations[0].coordinates[1]],
        zoom: 4,
        // interactive: false
    });

    map.scrollZoom.disable();

    const bounds = new mapboxgl.LngLatBounds();

    locations.forEach(location => {
        // Adding popup
        var popup = new mapboxgl.Popup({
            offset: 30
        })
            // .setLngLat(location.coordinates)
            .setText(
                `Day ${location.day}: ${location.description}`
            );
        // .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
        // .addTo(map);

        // Creating a marker
        const element = document.createElement('div');
        element.className = 'marker';

        // Adding the marker
        new mapboxgl.Marker({
            element,
            anchor: 'bottom'
        })
            .setLngLat(location.coordinates)
            .setPopup(popup)
            .addTo(map);


        // Extending map bounds => including locations
        bounds.extend(location.coordinates);
    });

    map.fitBounds(bounds, {
        padding: {
            top: 200,
            bottom: 150,
            right: 200,
            left: 200
        }
    });

};
