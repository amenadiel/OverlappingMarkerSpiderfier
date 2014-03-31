/** @preserve OverlappingMarkerSpiderfier
https://github.com/jawj/OverlappingMarkerSpiderfier
Copyright (c) 2011 - 2013 George MacKerron
Released under the MIT licence: http://opensource.org/licenses/mit-license
Note: The Google Maps API v3 must be included *before* this code
 */
var _ref,
	__hasProp = {}.hasOwnProperty,
	__slice = [].slice;

if (((_ref = this.google) !== null ? _ref.maps : void 0) === null) {
	return;
}


var lcH, lcU, p, twoPi, x, _i, _len, _ref1;


twoPi = Math.PI * 2;




google.maps.OverlappingMarkerSpiderfier = function(map, opts) {
	var e, k, v, _j, _len1, _ref2;
	this.map = map;
	if (opts === null) {
		opts = {};
	}
	for (k in opts) {
		if (!__hasProp.call(opts, k)) continue;
		v = opts[k];
		this[k] = v;
	}
	this.projHelper = new this.constructor.ProjHelper(this.map);
	this.initMarkerArrays();
	this.listeners = {};
	_ref2 = ['click', 'zoom_changed', 'maptypeid_changed'];
	for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
		e = _ref2[_j];
		google.maps.event.addListener(this.map, e, (function(_this) {
			return function() {
				return _this.unspiderfy();
			};
		})(this));
	}
};

google.maps.OverlappingMarkerSpiderfier.prototype.legColors = {
	'usual': {},
	'highlighted': {}
};
p = google.maps.OverlappingMarkerSpiderfier.prototype;

_ref1 = [google.maps.OverlappingMarkerSpiderfier, p];
for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
	x = _ref1[_i];
	x.VERSION = '0.3.3';
}


lcU = google.maps.OverlappingMarkerSpiderfier.prototype.legColors.usual;

lcH = google.maps.OverlappingMarkerSpiderfier.prototype.legColors.highlighted;

lcU[google.maps.MapTypeId.HYBRID] = lcU[google.maps.MapTypeId.SATELLITE] = '#fff';

lcH[google.maps.MapTypeId.HYBRID] = lcH[google.maps.MapTypeId.SATELLITE] = '#f00';

lcU[google.maps.MapTypeId.TERRAIN] = lcU[google.maps.MapTypeId.ROADMAP] = '#444';

lcH[google.maps.MapTypeId.TERRAIN] = lcH[google.maps.MapTypeId.ROADMAP] = '#f00';


google.maps.OverlappingMarkerSpiderfier.prototype.keepSpiderfied = true;

google.maps.OverlappingMarkerSpiderfier.prototype.markersWontHide = false;

google.maps.OverlappingMarkerSpiderfier.prototype.markersWontMove = false;

google.maps.OverlappingMarkerSpiderfier.prototype.nearbyDistance = 20;

google.maps.OverlappingMarkerSpiderfier.prototype.circleSpiralSwitchover = 9;

google.maps.OverlappingMarkerSpiderfier.prototype.circleFootSeparation = 23;

google.maps.OverlappingMarkerSpiderfier.prototype.circleStartAngle = twoPi / 12;

google.maps.OverlappingMarkerSpiderfier.prototype.spiralFootSeparation = 26;

google.maps.OverlappingMarkerSpiderfier.prototype.spiralLengthStart = 11;

google.maps.OverlappingMarkerSpiderfier.prototype.spiralLengthFactor = 4;

google.maps.OverlappingMarkerSpiderfier.prototype.spiderfiedZIndex = 1000;

google.maps.OverlappingMarkerSpiderfier.prototype.usualLegZIndex = 10;

google.maps.OverlappingMarkerSpiderfier.prototype.highlightedLegZIndex = 20;

google.maps.OverlappingMarkerSpiderfier.prototype.legWeight = 1.5;


google.maps.OverlappingMarkerSpiderfier.prototype.initMarkerArrays = function() {
	this.markers = [];
	return this.markerListenerRefs = [];
};

google.maps.OverlappingMarkerSpiderfier.prototype.addMarker = function(marker) {
	var listenerRefs;
	if (marker._oms) {
		return this;
	}
	marker._oms = true;
	listenerRefs = [
		google.maps.event.addListener(marker, 'click', (function(_this) {
			return function(event) {
				return _this.spiderListener(marker, event);
			};
		})(this))
	];
	if (!this.markersWontHide) {
		listenerRefs.push(google.maps.event.addListener(marker, 'visible_changed', (function(_this) {
			return function() {
				return _this.markerChangeListener(marker, false);
			};
		})(this)));
	}
	if (!this.markersWontMove) {
		listenerRefs.push(google.maps.event.addListener(marker, 'position_changed', (function(_this) {
			return function() {
				return _this.markerChangeListener(marker, true);
			};
		})(this)));
	}
	this.markerListenerRefs.push(listenerRefs);
	this.markers.push(marker);
	return this;
};

google.maps.OverlappingMarkerSpiderfier.prototype.markerChangeListener = function(marker, positionChanged) {
	if (marker._omsData && (positionChanged || !marker.getVisible()) && !(this.spiderfying || this.unspiderfying)) {
		return this.unspiderfy(positionChanged ? marker : null);
	}
};

google.maps.OverlappingMarkerSpiderfier.prototype.getMarkers = function() {
	return this.markers.slice(0);
};

google.maps.OverlappingMarkerSpiderfier.prototype.removeMarker = function(marker) {
	var i, listenerRef, listenerRefs, _j, _len1;
	if (marker._omsData) {
		this.unspiderfy();
	}
	i = this.arrIndexOf(this.markers, marker);
	if (i < 0) {
		return this;
	}
	listenerRefs = this.markerListenerRefs.splice(i, 1)[0];
	for (_j = 0, _len1 = listenerRefs.length; _j < _len1; _j++) {
		listenerRef = listenerRefs[_j];
		google.maps.event.removeListener(listenerRef);
	}
	delete marker._oms;
	this.markers.splice(i, 1);
	return this;
};

google.maps.OverlappingMarkerSpiderfier.prototype.clearMarkers = function() {
	var i, listenerRef, listenerRefs, marker, _j, _k, _len1, _len2, _ref2;
	this.unspiderfy();
	_ref2 = this.markers;
	for (i = _j = 0, _len1 = _ref2.length; _j < _len1; i = ++_j) {
		marker = _ref2[i];
		listenerRefs = this.markerListenerRefs[i];
		for (_k = 0, _len2 = listenerRefs.length; _k < _len2; _k++) {
			listenerRef = listenerRefs[_k];
			google.maps.event.removeListener(listenerRef);
		}
		delete marker._oms;
	}
	this.initMarkerArrays();
	return this;
};

google.maps.OverlappingMarkerSpiderfier.prototype.addListener = function(event, func) {
	var _base;
	((_base = this.listeners)[event] ? _base[event] : _base[event] = []).push(func);
	return this;
};

google.maps.OverlappingMarkerSpiderfier.prototype.removeListener = function(event, func) {
	var i;
	i = this.arrIndexOf(this.listeners[event], func);
	if (i >= 0) {
		this.listeners[event].splice(i, 1);
	}
	return this;
};

google.maps.OverlappingMarkerSpiderfier.prototype.clearListeners = function(event) {
	this.listeners[event] = [];
	return this;
};

google.maps.OverlappingMarkerSpiderfier.prototype.trigger = function() {
	var args, event, func, _j, _len1, _ref2, _ref3, _results;
	event = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
	_ref3 = (_ref2 = this.listeners[event]) ? _ref2 : [];
	_results = [];
	for (_j = 0, _len1 = _ref3.length; _j < _len1; _j++) {
		func = _ref3[_j];
		_results.push(func.apply(null, args));
	}
	return _results;
};

google.maps.OverlappingMarkerSpiderfier.prototype.generatePtsCircle = function(count, centerPt) {
	var angle, angleStep, circumference, i, legLength, _j, _results;
	circumference = this.circleFootSeparation * (2 + count);
	legLength = circumference / twoPi;
	angleStep = twoPi / count;
	_results = [];
	for (i = _j = 0; 0 <= count ? _j < count : _j > count; i = 0 <= count ? ++_j : --_j) {
		angle = this.circleStartAngle + i * angleStep;
		_results.push(new google.maps.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle)));
	}
	return _results;
};

google.maps.OverlappingMarkerSpiderfier.prototype.generatePtsSpiral = function(count, centerPt) {
	var angle, i, legLength, pt, _j, _results;
	legLength = this.spiralLengthStart;
	angle = 0;
	_results = [];
	for (i = _j = 0; 0 <= count ? _j < count : _j > count; i = 0 <= count ? ++_j : --_j) {
		angle += this.spiralFootSeparation / legLength + i * 0.0005;
		pt = new google.maps.Point(centerPt.x + legLength * Math.cos(angle), centerPt.y + legLength * Math.sin(angle));
		legLength += twoPi * this.spiralLengthFactor / angle;
		_results.push(pt);
	}
	return _results;
};

google.maps.OverlappingMarkerSpiderfier.prototype.spiderListener = function(marker, event) {
	var m, mPt, markerPt, markerSpiderfied, nDist, nearbyMarkerData, nonNearbyMarkers, pxSq, _j, _len1, _ref2;
	markerSpiderfied = marker._omsData != null;
	if (!(markerSpiderfied && this.keepSpiderfied)) {
		this.unspiderfy();
	}
	if (markerSpiderfied || this.map.getStreetView().getVisible() || this.map.getMapTypeId() === 'GoogleEarthAPI') {
		return this.trigger('click', marker, event);
	} else {
		nearbyMarkerData = [];
		nonNearbyMarkers = [];
		nDist = this.nearbyDistance;
		pxSq = nDist * nDist;
		markerPt = this.llToPt(marker.position);
		_ref2 = this.markers;
		for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
			m = _ref2[_j];
			if (!(m.map && m.getVisible())) {
				continue;
			}
			mPt = this.llToPt(m.position);
			if (this.ptDistanceSq(mPt, markerPt) < pxSq) {
				nearbyMarkerData.push({
					marker: m,
					markerPt: mPt
				});
			} else {
				nonNearbyMarkers.push(m);
			}
		}
		if (nearbyMarkerData.length === 1) {
			return this.trigger('click', marker, event);
		} else {
			return this.spiderfy(nearbyMarkerData, nonNearbyMarkers);
		}
	}
};

google.maps.OverlappingMarkerSpiderfier.prototype.markersNearMarker = function(marker, firstOnly) {
	var m, mPt, markerPt, markers, nDist, pxSq, _j, _len1, _ref2, _ref3, _ref4;
	if (firstOnly === null) {
		firstOnly = false;
	}
	if (this.projHelper.getProjection() === null) {
		throw "Must wait for 'idle' event on map before calling markersNearMarker";
	}
	nDist = this.nearbyDistance;
	pxSq = nDist * nDist;
	markerPt = this.llToPt(marker.position);
	markers = [];
	_ref2 = this.markers;
	for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
		m = _ref2[_j];
		if (m === marker || (m.map === null) || !m.getVisible()) {
			continue;
		}
		mPt = this.llToPt((_ref3 = (_ref4 = m._omsData) ? _ref4.usualPosition : void 0) ? _ref3 : m.position);
		if (this.ptDistanceSq(mPt, markerPt) < pxSq) {
			markers.push(m);
			if (firstOnly) {
				break;
			}
		}
	}
	return markers;
};

google.maps.OverlappingMarkerSpiderfier.prototype.markersNearAnyOtherMarker = function() {
	var i, i1, i2, m, m1, m1Data, m2, m2Data, mData, nDist, pxSq, _j, _k, _l, _len1, _len2, _len3, _ref2, _ref3, _ref4, _results;
	if (this.projHelper.getProjection() === null) {
		throw "Must wait for 'idle' event on map before calling markersNearAnyOtherMarker";
	}
	nDist = this.nearbyDistance;
	pxSq = nDist * nDist;
	mData = (function() {
		var _j, _len1, _ref2, _ref3, _ref4, _results;
		_ref2 = this.markers;
		_results = [];
		for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
			m = _ref2[_j];
			_results.push({
				pt: this.llToPt((_ref3 = (_ref4 = m._omsData) ? _ref4.usualPosition : void 0) ? _ref3 : m.position),
				willSpiderfy: false
			});
		}
		return _results;
	}).call(this);
	_ref2 = this.markers;
	for (i1 = _j = 0, _len1 = _ref2.length; _j < _len1; i1 = ++_j) {
		m1 = _ref2[i1];
		if (!(m1.map && m1.getVisible())) {
			continue;
		}
		m1Data = mData[i1];
		if (m1Data.willSpiderfy) {
			continue;
		}
		_ref3 = this.markers;
		for (i2 = _k = 0, _len2 = _ref3.length; _k < _len2; i2 = ++_k) {
			m2 = _ref3[i2];
			if (i2 === i1) {
				continue;
			}
			if (!(m2.map && m2.getVisible())) {
				continue;
			}
			m2Data = mData[i2];
			if (i2 < i1 && !m2Data.willSpiderfy) {
				continue;
			}
			if (this.ptDistanceSq(m1Data.pt, m2Data.pt) < pxSq) {
				m1Data.willSpiderfy = m2Data.willSpiderfy = true;
				break;
			}
		}
	}
	_ref4 = this.markers;
	_results = [];
	for (i = _l = 0, _len3 = _ref4.length; _l < _len3; i = ++_l) {
		m = _ref4[i];
		if (mData[i].willSpiderfy) {
			_results.push(m);
		}
	}
	return _results;
};

google.maps.OverlappingMarkerSpiderfier.prototype.makeHighlightListenerFuncs = function(marker) {
	return {
		highlight: (function(_this) {
			return function() {
				return marker._omsData.leg.setOptions({
					strokeColor: _this.legColors.highlighted[_this.map.mapTypeId],
					zIndex: _this.highlightedLegZIndex
				});
			};
		})(this),
		unhighlight: (function(_this) {
			return function() {
				return marker._omsData.leg.setOptions({
					strokeColor: _this.legColors.usual[_this.map.mapTypeId],
					zIndex: _this.usualLegZIndex
				});
			};
		})(this)
	};
};

google.maps.OverlappingMarkerSpiderfier.prototype.spiderfy = function(markerData, nonNearbyMarkers) {
	var bodyPt, footLl, footPt, footPts, highlightListenerFuncs, leg, marker, md, nearestMarkerDatum, numFeet, spiderfiedMarkers;
	this.spiderfying = true;
	numFeet = markerData.length;
	bodyPt = this.ptAverage((function() {
		var _j, _len1, _results;
		_results = [];
		for (_j = 0, _len1 = markerData.length; _j < _len1; _j++) {
			md = markerData[_j];
			_results.push(md.markerPt);
		}
		return _results;
	})());
	footPts = numFeet >= this.circleSpiralSwitchover ? this.generatePtsSpiral(numFeet, bodyPt).reverse() : this.generatePtsCircle(numFeet, bodyPt);
	spiderfiedMarkers = (function() {
		var _j, _len1, _results;
		_results = [];
		for (_j = 0, _len1 = footPts.length; _j < _len1; _j++) {
			footPt = footPts[_j];
			footLl = this.ptToLl(footPt);
			nearestMarkerDatum = this.minExtract(markerData, (function(_this) {
				return function(md) {
					return _this.ptDistanceSq(md.markerPt, footPt);
				};
			})(this));
			marker = nearestMarkerDatum.marker;
			try {
				leg = new google.maps.Polyline({
					map: this.map,
					path: [marker.position, footLl],
					strokeColor: this.legColors.usual[this.map.mapTypeId],
					strokeWeight: this.legWeight,
					zIndex: this.usualLegZIndex
				});
				marker._omsData = {
					usualPosition: marker.position,
					leg: leg
				};
				if (this.legColors.highlighted[this.map.mapTypeId] !== this.legColors.usual[this.map.mapTypeId]) {
					highlightListenerFuncs = this.makeHighlightListenerFuncs(marker);
					marker._omsData.hightlightListeners = {
						highlight: google.maps.event.addListener(marker, 'mouseover', highlightListenerFuncs.highlight),
						unhighlight: google.maps.event.addListener(marker, 'mouseout', highlightListenerFuncs.unhighlight)
					};
				}
				marker.setPosition(footLl);
				marker.setZIndex(Math.round(this.spiderfiedZIndex + footPt.y));
				_results.push(marker);
			} catch (e) {
				console.log('Non valid point', e);
			}
		}
		return _results;
	}).call(this);
	delete this.spiderfying;
	this.spiderfied = true;
	return this.trigger('spiderfy', spiderfiedMarkers, nonNearbyMarkers);
};

google.maps.OverlappingMarkerSpiderfier.prototype.unspiderfy = function(markerNotToMove) {
	var listeners, marker, nonNearbyMarkers, unspiderfiedMarkers, _j, _len1, _ref2;
	if (markerNotToMove === null) {
		markerNotToMove = null;
	}
	if (this.spiderfied === null) {
		return this;
	}
	this.unspiderfying = true;
	unspiderfiedMarkers = [];
	nonNearbyMarkers = [];
	_ref2 = this.markers;
	for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
		marker = _ref2[_j];
		if (marker._omsData) {
			marker._omsData.leg.setMap(null);
			if (marker !== markerNotToMove) {
				marker.setPosition(marker._omsData.usualPosition);
			}
			marker.setZIndex(null);
			listeners = marker._omsData.hightlightListeners;
			if (listeners) {
				google.maps.event.removeListener(listeners.highlight);
				google.maps.event.removeListener(listeners.unhighlight);
			}
			delete marker._omsData;
			unspiderfiedMarkers.push(marker);
		} else {
			nonNearbyMarkers.push(marker);
		}
	}
	delete this.unspiderfying;
	delete this.spiderfied;
	this.trigger('unspiderfy', unspiderfiedMarkers, nonNearbyMarkers);
	return this;
};

google.maps.OverlappingMarkerSpiderfier.prototype.ptDistanceSq = function(pt1, pt2) {
	var dx, dy;
	if (!pt1 || !pt2) return 0;
	dx = pt1.x - pt2.x;
	dy = pt1.y - pt2.y;
	return dx * dx + dy * dy;
};

google.maps.OverlappingMarkerSpiderfier.prototype.ptAverage = function(pts) {
	var numPts, pt, sumX, sumY, _j, _len1;
	sumX = sumY = 0;
	for (_j = 0, _len1 = pts.length; _j < _len1; _j++) {
		pt = pts[_j];
		if (!pt) continue;
		sumX += pt.x;
		sumY += pt.y;
	}
	numPts = pts.length;
	return new google.maps.Point(sumX / numPts, sumY / numPts);
};

google.maps.OverlappingMarkerSpiderfier.prototype.llToPt = function(ll) {
	return this.projHelper.getProjection().fromLatLngToDivPixel(ll);
};

google.maps.OverlappingMarkerSpiderfier.prototype.ptToLl = function(pt) {
	return this.projHelper.getProjection().fromDivPixelToLatLng(pt);
};

google.maps.OverlappingMarkerSpiderfier.prototype.minExtract = function(set, func) {
	var bestIndex, bestVal, index, item, val, _j, _len1;
	for (index = _j = 0, _len1 = set.length; _j < _len1; index = ++_j) {
		item = set[index];
		val = func(item);
		if ((typeof bestIndex === "undefined" || bestIndex === null) || val < bestVal) {
			bestVal = val;
			bestIndex = index;
		}
	}
	return set.splice(bestIndex, 1)[0];
};

google.maps.OverlappingMarkerSpiderfier.prototype.arrIndexOf = function(arr, obj) {
	var i, o, _j, _len1;
	if (arr.indexOf) {
		return arr.indexOf(obj);
	}
	for (i = _j = 0, _len1 = arr.length; _j < _len1; i = ++_j) {
		o = arr[i];
		if (o === obj) {
			return i;
		}
	}
	return -1;
};

google.maps.OverlappingMarkerSpiderfier.ProjHelper = function(map) {
	return this.setMap(map);
};

google.maps.OverlappingMarkerSpiderfier.ProjHelper.prototype = new google.maps.OverlayView();

google.maps.OverlappingMarkerSpiderfier.ProjHelper.prototype.draw = function() {};