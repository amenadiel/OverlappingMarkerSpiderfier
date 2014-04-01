Overlapping Marker Spiderfier,  Google Maps API v3 Library
==========================================================

**This is a fork from @jawj  [Overlapping Marker Spiderfier for Google Maps API v3](https://github.com/jawj/OverlappingMarkerSpiderfier)**

This fork preserves all functionalities. It's mostly original code converted from Coffee (for those of you that, like me, like to experiment with code and don't like to mess with coffee) with verbosity and namespace added to each object so it became clear what each part was doing.

The code was onverted to reflect [jshint](http://www.jshint.com/) best practices and OverlappingMarkerSpiderifier is now loaded as part of the google.maps namespace, so instead of

```js
var Spider= new OverlappingMarkerSpiderifier();
```

it is instanced with

```js
var Spider= new google.maps.OverlappingMarkerSpiderifier();
```

This way, if you're loading Google Maps with AMD such as [RequireJS](http://requirejs.org/) you don't need to white shims to get a return object. Just make sure you load it after Google Maps.

As per default funcionalities, the following is a brief C&P from @jawj  [Overlapping Marker Spiderfier for Google Maps API v3](https://github.com/jawj/OverlappingMarkerSpiderfier)


Ever noticed how, in [Google Earth](http://earth.google.com), marker pins that overlap each other spring apart gracefully when you click them, so you can pick the one you meant? This code makes Google Maps API **version 3** map markers behave in that way (minus the animation). This extension can accomodate numberless markers in an expanding spiral so they don't overlap.

The compiled code has no dependencies beyond Google Maps. And it’s under 3K when compiled out of
[CoffeeScript](http://jashkenas.github.com/coffee-script/), minified with Google’s [Closure Compiler](http://code.google.com/closure/compiler/) and gzipped.

I wrote it as part of the data download feature for [Mappiness](http://www.mappiness.org.uk/maps/).

**There’s now also [a port for the Leaflet maps API](https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet)


### Demo

See the [demo map](http://jawj.github.com/OverlappingMarkerSpiderfier/demo.html) (the data is random: reload the map to reposition the markers).



### How to use

Download [the JS source](http://amenadiel.github.com/OverlappingMarkerSpiderfier/lib/oms.js).

See the [demo map source](https://github.com/jawj/OverlappingMarkerSpiderfier/blob/gh-pages/demo.html),
or follow along here for a slightly simpler usage with commentary.

Create your map like normal:

```sh
     var map = new google.maps.Map(document.getElementById('map_canvas'), {
      mapTypeId: google.maps.MapTypeId.SATELLITE,
      center: new google.maps.LatLng(50, 0), 
      zoom: 6
    });

    var Spider= new google.maps.OverlappingMarkerSpiderifier();
```


Instead of adding click listeners to your markers directly via `google.maps.event.addListener`, add a global listener on the `OverlappingMarkerSpiderfier` instance instead. The listener will be passed the clicked marker as its first argument, and the Google Maps `event` object as its second.


```js
    var InfoWindow = new google.maps.InfoWindow();
    oms.addListener('click', function(marker, event) {
      InfoWindow.setContent(marker.desc);
      InfoWindow.open(map, marker);
    });
```


You can also add listeners on the `spiderfy` and `unspiderfy` events, which will be passed an array of the markers affected. In this example, we observe only the `spiderfy` event, using it to close any open `InfoWindow`:

```sh
    Spider.addListener('spiderfy', function(markers) {
      InfoWindow.close();
    });
```


Finally, tell the `OverlappingMarkerSpiderfier` instance about each marker as you add it, using the `addMarker` method:

```sh
    for (var i = 0; i < window.mapData.length; i ++) {
      var datum = window.mapData[i];
      var loc = new google.maps.LatLng(datum.lat, datum.lon);
      var marker = new google.maps.Marker({
        position: loc,
        title: datum.h,
        map: map
      });
      marker.desc = datum.d;
      Spider.addMarker(marker);  // <-- here
    }
```


 

### Construction && Options

The options given to the constructor are detailed on the original [Overlapping Marker Spiderfier for Google Maps API v3](https://github.com/jawj/OverlappingMarkerSpiderfier).


### Licence


This software is released under the [MIT
licence](http://www.opensource.org/licenses/mit-license.php).

Finally, if you want to say thanks, I am on
[Gittip](https://www.gittip.com/jawj).
