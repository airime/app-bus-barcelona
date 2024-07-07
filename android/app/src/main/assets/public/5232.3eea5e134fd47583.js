"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[5232],{9169:(E,p,d)=>{d.d(p,{N:()=>L,q:()=>h});var v=d(467),C=d(2709);class h{constructor(o){this.southwest=o.southwest,this.center=o.center,this.northeast=o.northeast}contains(o){var c=this;return(0,v.A)(function*(){return(yield C.P.mapBoundsContains({bounds:c,point:o})).contains})()}extend(o){var c=this;return(0,v.A)(function*(){const g=yield C.P.mapBoundsExtend({bounds:c,point:o});return c.southwest=g.bounds.southwest,c.center=g.bounds.center,c.northeast=g.bounds.northeast,c})()}}var L=function(i){return i.Normal="Normal",i.Hybrid="Hybrid",i.Satellite="Satellite",i.Terrain="Terrain",i.None="None",i}(L||{})},2709:(E,p,d)=>{d.d(p,{P:()=>C});const C=(0,d(5083).F3)("CapacitorGoogleMaps",{web:()=>d.e(1190).then(d.bind(d,1190)).then(h=>new h.CapacitorGoogleMapsWeb)});C.addListener("isMapInFocus",h=>{var L;const c=document.elementFromPoint(h.x,h.y),a=(null===(L=null==c?void 0:c.dataset)||void 0===L?void 0:L.internalId)===h.mapId;C.dispatchMapEvent({id:h.mapId,focus:a})})},5232:(E,p,d)=>{d.r(p),d.d(p,{Tab1Page:()=>_});var v=d(6855),C=d(8397),h=d(9381),L=d(2197),i=d(467),o=d(3953),c=d(5083),g=d(9169),a=d(2709);class S extends HTMLElement{constructor(){super()}connectedCallback(){if(this.innerHTML="","ios"==c.Ii.getPlatform()){this.style.overflow="scroll",this.style["-webkit-overflow-scrolling"]="touch";const e=document.createElement("div");e.style.height="200%",this.appendChild(e)}}}customElements.define("capacitor-google-map",S);class P{constructor(e){this.element=null,this.resizeObserver=null,this.handleScrollEvent=()=>this.updateMapBounds(),this.id=e}static create(e,n){return(0,i.A)(function*(){const t=new P(e.id);if(!e.element)throw new Error("container element is required");void 0===e.config.androidLiteMode&&(e.config.androidLiteMode=!1),t.element=e.element,t.element.dataset.internalId=e.id;const r=yield P.getElementBounds(e.element);if(e.config.width=r.width,e.config.height=r.height,e.config.x=r.x,e.config.y=r.y,e.config.devicePixelRatio=window.devicePixelRatio,"android"==c.Ii.getPlatform()&&t.initScrolling(),c.Ii.isNativePlatform()){e.element={};const l=()=>{var m,M;const I=null!==(M=null===(m=t.element)||void 0===m?void 0:m.getBoundingClientRect())&&void 0!==M?M:{};return{x:I.x,y:I.y,width:I.width,height:I.height}},f=()=>{a.P.onDisplay({id:t.id,mapBounds:l()})},y=()=>{a.P.onResize({id:t.id,mapBounds:l()})},w=t.element.closest(".ion-page");"ios"===c.Ii.getPlatform()&&w&&(w.addEventListener("ionViewWillEnter",()=>{setTimeout(()=>{f()},100)}),w.addEventListener("ionViewDidEnter",()=>{setTimeout(()=>{f()},100)}));const k={width:r.width,height:r.height,isHidden:!1};t.resizeObserver=new ResizeObserver(()=>{if(null!=t.element){const m=t.element.getBoundingClientRect(),M=0===m.width&&0===m.height;M||(k.isHidden?"ios"===c.Ii.getPlatform()&&!w&&f():(k.width!==m.width||k.height!==m.height)&&y()),k.width=m.width,k.height=m.height,k.isHidden=M}}),t.resizeObserver.observe(t.element)}if(yield new Promise((l,f)=>{setTimeout((0,i.A)(function*(){try{yield a.P.create(e),l(void 0)}catch(y){f(y)}}),200)}),n){const l=yield a.P.addListener("onMapReady",f=>{f.mapId==t.id&&(n(f),l.remove())})}return t})()}static getElementBounds(e){return(0,i.A)(function*(){return new Promise(n=>{let t=e.getBoundingClientRect();if(0==t.width){let r=0;const l=setInterval(function(){0==t.width&&r<30?(t=e.getBoundingClientRect(),r++):(30==r&&console.warn("Map size could not be determined"),clearInterval(l),n(t))},100)}else n(t)})})()}enableTouch(){var e=this;return(0,i.A)(function*(){return a.P.enableTouch({id:e.id})})()}disableTouch(){var e=this;return(0,i.A)(function*(){return a.P.disableTouch({id:e.id})})()}enableClustering(e){var n=this;return(0,i.A)(function*(){return a.P.enableClustering({id:n.id,minClusterSize:e})})()}disableClustering(){var e=this;return(0,i.A)(function*(){return a.P.disableClustering({id:e.id})})()}addMarker(e){var n=this;return(0,i.A)(function*(){return(yield a.P.addMarker({id:n.id,marker:e})).id})()}addMarkers(e){var n=this;return(0,i.A)(function*(){return(yield a.P.addMarkers({id:n.id,markers:e})).ids})()}removeMarker(e){var n=this;return(0,i.A)(function*(){return a.P.removeMarker({id:n.id,markerId:e})})()}removeMarkers(e){var n=this;return(0,i.A)(function*(){return a.P.removeMarkers({id:n.id,markerIds:e})})()}addPolygons(e){var n=this;return(0,i.A)(function*(){return(yield a.P.addPolygons({id:n.id,polygons:e})).ids})()}addPolylines(e){var n=this;return(0,i.A)(function*(){return(yield a.P.addPolylines({id:n.id,polylines:e})).ids})()}removePolygons(e){var n=this;return(0,i.A)(function*(){return a.P.removePolygons({id:n.id,polygonIds:e})})()}addCircles(e){var n=this;return(0,i.A)(function*(){return(yield a.P.addCircles({id:n.id,circles:e})).ids})()}removeCircles(e){var n=this;return(0,i.A)(function*(){return a.P.removeCircles({id:n.id,circleIds:e})})()}removePolylines(e){var n=this;return(0,i.A)(function*(){return a.P.removePolylines({id:n.id,polylineIds:e})})()}destroy(){var e=this;return(0,i.A)(function*(){var n;return"android"==c.Ii.getPlatform()&&e.disableScrolling(),c.Ii.isNativePlatform()&&(null===(n=e.resizeObserver)||void 0===n||n.disconnect()),e.removeAllMapListeners(),a.P.destroy({id:e.id})})()}setCamera(e){var n=this;return(0,i.A)(function*(){return a.P.setCamera({id:n.id,config:e})})()}getMapType(){var e=this;return(0,i.A)(function*(){const{type:n}=yield a.P.getMapType({id:e.id});return g.N[n]})()}setMapType(e){var n=this;return(0,i.A)(function*(){return a.P.setMapType({id:n.id,mapType:e})})()}enableIndoorMaps(e){var n=this;return(0,i.A)(function*(){return a.P.enableIndoorMaps({id:n.id,enabled:e})})()}enableTrafficLayer(e){var n=this;return(0,i.A)(function*(){return a.P.enableTrafficLayer({id:n.id,enabled:e})})()}enableAccessibilityElements(e){var n=this;return(0,i.A)(function*(){return a.P.enableAccessibilityElements({id:n.id,enabled:e})})()}enableCurrentLocation(e){var n=this;return(0,i.A)(function*(){return a.P.enableCurrentLocation({id:n.id,enabled:e})})()}setPadding(e){var n=this;return(0,i.A)(function*(){return a.P.setPadding({id:n.id,padding:e})})()}getMapBounds(){var e=this;return(0,i.A)(function*(){return new g.q(yield a.P.getMapBounds({id:e.id}))})()}fitBounds(e,n){var t=this;return(0,i.A)(function*(){return a.P.fitBounds({id:t.id,bounds:e,padding:n})})()}initScrolling(){const e=document.getElementsByTagName("ion-content");for(let n=0;n<e.length;n++)e[n].scrollEvents=!0;window.addEventListener("ionScroll",this.handleScrollEvent),window.addEventListener("scroll",this.handleScrollEvent),window.addEventListener("resize",this.handleScrollEvent),screen.orientation?screen.orientation.addEventListener("change",()=>{setTimeout(this.updateMapBounds,500)}):window.addEventListener("orientationchange",()=>{setTimeout(this.updateMapBounds,500)})}disableScrolling(){window.removeEventListener("ionScroll",this.handleScrollEvent),window.removeEventListener("scroll",this.handleScrollEvent),window.removeEventListener("resize",this.handleScrollEvent),screen.orientation?screen.orientation.removeEventListener("change",()=>{setTimeout(this.updateMapBounds,1e3)}):window.removeEventListener("orientationchange",()=>{setTimeout(this.updateMapBounds,1e3)})}updateMapBounds(){if(this.element){const e=this.element.getBoundingClientRect();a.P.onScroll({id:this.id,mapBounds:{x:e.x,y:e.y,width:e.width,height:e.height}})}}setOnCameraIdleListener(e){var n=this;return(0,i.A)(function*(){n.onCameraIdleListener&&n.onCameraIdleListener.remove(),n.onCameraIdleListener=e?yield a.P.addListener("onCameraIdle",n.generateCallback(e)):void 0})()}setOnBoundsChangedListener(e){var n=this;return(0,i.A)(function*(){n.onBoundsChangedListener&&n.onBoundsChangedListener.remove(),n.onBoundsChangedListener=e?yield a.P.addListener("onBoundsChanged",n.generateCallback(e)):void 0})()}setOnCameraMoveStartedListener(e){var n=this;return(0,i.A)(function*(){n.onCameraMoveStartedListener&&n.onCameraMoveStartedListener.remove(),n.onCameraMoveStartedListener=e?yield a.P.addListener("onCameraMoveStarted",n.generateCallback(e)):void 0})()}setOnClusterClickListener(e){var n=this;return(0,i.A)(function*(){n.onClusterClickListener&&n.onClusterClickListener.remove(),n.onClusterClickListener=e?yield a.P.addListener("onClusterClick",n.generateCallback(e)):void 0})()}setOnClusterInfoWindowClickListener(e){var n=this;return(0,i.A)(function*(){n.onClusterInfoWindowClickListener&&n.onClusterInfoWindowClickListener.remove(),n.onClusterInfoWindowClickListener=e?yield a.P.addListener("onClusterInfoWindowClick",n.generateCallback(e)):void 0})()}setOnInfoWindowClickListener(e){var n=this;return(0,i.A)(function*(){n.onInfoWindowClickListener&&n.onInfoWindowClickListener.remove(),n.onInfoWindowClickListener=e?yield a.P.addListener("onInfoWindowClick",n.generateCallback(e)):void 0})()}setOnMapClickListener(e){var n=this;return(0,i.A)(function*(){n.onMapClickListener&&n.onMapClickListener.remove(),n.onMapClickListener=e?yield a.P.addListener("onMapClick",n.generateCallback(e)):void 0})()}setOnPolygonClickListener(e){var n=this;return(0,i.A)(function*(){n.onPolygonClickListener&&n.onPolygonClickListener.remove(),n.onPolygonClickListener=e?yield a.P.addListener("onPolygonClick",n.generateCallback(e)):void 0})()}setOnCircleClickListener(e){var n=this;return(0,i.A)(function*(){n.onCircleClickListener&&n.onCircleClickListener.remove(),n.onCircleClickListener=e?yield a.P.addListener("onCircleClick",n.generateCallback(e)):void 0})()}setOnMarkerClickListener(e){var n=this;return(0,i.A)(function*(){n.onMarkerClickListener&&n.onMarkerClickListener.remove(),n.onMarkerClickListener=e?yield a.P.addListener("onMarkerClick",n.generateCallback(e)):void 0})()}setOnPolylineClickListener(e){var n=this;return(0,i.A)(function*(){n.onPolylineClickListener&&n.onPolylineClickListener.remove(),n.onPolylineClickListener=e?yield a.P.addListener("onPolylineClick",n.generateCallback(e)):void 0})()}setOnMarkerDragStartListener(e){var n=this;return(0,i.A)(function*(){n.onMarkerDragStartListener&&n.onMarkerDragStartListener.remove(),n.onMarkerDragStartListener=e?yield a.P.addListener("onMarkerDragStart",n.generateCallback(e)):void 0})()}setOnMarkerDragListener(e){var n=this;return(0,i.A)(function*(){n.onMarkerDragListener&&n.onMarkerDragListener.remove(),n.onMarkerDragListener=e?yield a.P.addListener("onMarkerDrag",n.generateCallback(e)):void 0})()}setOnMarkerDragEndListener(e){var n=this;return(0,i.A)(function*(){n.onMarkerDragEndListener&&n.onMarkerDragEndListener.remove(),n.onMarkerDragEndListener=e?yield a.P.addListener("onMarkerDragEnd",n.generateCallback(e)):void 0})()}setOnMyLocationButtonClickListener(e){var n=this;return(0,i.A)(function*(){n.onMyLocationButtonClickListener&&n.onMyLocationButtonClickListener.remove(),n.onMyLocationButtonClickListener=e?yield a.P.addListener("onMyLocationButtonClick",n.generateCallback(e)):void 0})()}setOnMyLocationClickListener(e){var n=this;return(0,i.A)(function*(){n.onMyLocationClickListener&&n.onMyLocationClickListener.remove(),n.onMyLocationClickListener=e?yield a.P.addListener("onMyLocationClick",n.generateCallback(e)):void 0})()}removeAllMapListeners(){var e=this;return(0,i.A)(function*(){e.onBoundsChangedListener&&(e.onBoundsChangedListener.remove(),e.onBoundsChangedListener=void 0),e.onCameraIdleListener&&(e.onCameraIdleListener.remove(),e.onCameraIdleListener=void 0),e.onCameraMoveStartedListener&&(e.onCameraMoveStartedListener.remove(),e.onCameraMoveStartedListener=void 0),e.onClusterClickListener&&(e.onClusterClickListener.remove(),e.onClusterClickListener=void 0),e.onClusterInfoWindowClickListener&&(e.onClusterInfoWindowClickListener.remove(),e.onClusterInfoWindowClickListener=void 0),e.onInfoWindowClickListener&&(e.onInfoWindowClickListener.remove(),e.onInfoWindowClickListener=void 0),e.onMapClickListener&&(e.onMapClickListener.remove(),e.onMapClickListener=void 0),e.onPolylineClickListener&&(e.onPolylineClickListener.remove(),e.onPolylineClickListener=void 0),e.onMarkerClickListener&&(e.onMarkerClickListener.remove(),e.onMarkerClickListener=void 0),e.onPolygonClickListener&&(e.onPolygonClickListener.remove(),e.onPolygonClickListener=void 0),e.onCircleClickListener&&(e.onCircleClickListener.remove(),e.onCircleClickListener=void 0),e.onMarkerDragStartListener&&(e.onMarkerDragStartListener.remove(),e.onMarkerDragStartListener=void 0),e.onMarkerDragListener&&(e.onMarkerDragListener.remove(),e.onMarkerDragListener=void 0),e.onMarkerDragEndListener&&(e.onMarkerDragEndListener.remove(),e.onMarkerDragEndListener=void 0),e.onMyLocationButtonClickListener&&(e.onMyLocationButtonClickListener.remove(),e.onMyLocationButtonClickListener=void 0),e.onMyLocationClickListener&&(e.onMyLocationClickListener.remove(),e.onMyLocationClickListener=void 0)})()}generateCallback(e){const n=this.id;return t=>{t.mapId==n&&e(t)}}}const B=(0,c.F3)("Geolocation",{web:()=>d.e(2920).then(d.bind(d,2920)).then(s=>new s.GeolocationWeb)});var b=d(7307),u=function(s){return s[s.BarcelonaCenter=0]="BarcelonaCenter",s[s.BarcelonaCiutatVella=1]="BarcelonaCiutatVella",s[s.BarcelonaEixample=2]="BarcelonaEixample",s[s.BarcelonaSants=3]="BarcelonaSants",s[s.BarcelonaLesCorts=4]="BarcelonaLesCorts",s[s.BarcelonaSarria=5]="BarcelonaSarria",s[s.BarcelonaGracia=6]="BarcelonaGracia",s[s.BarcelonaHorta=7]="BarcelonaHorta",s[s.BarcelonaNouBarris=8]="BarcelonaNouBarris",s[s.BarcelonaStAndreu=9]="BarcelonaStAndreu",s[s.BarcelonaStMarti=10]="BarcelonaStMarti",s}(u||{});const A={[u.BarcelonaCenter]:{lat:41.38719562452725,lng:2.170042343172259},[u.BarcelonaCiutatVella]:{lat:41.380237127671805,lng:2.1752313818505113},[u.BarcelonaEixample]:{lat:41.39399187579082,lng:2.164702064906218},[u.BarcelonaSants]:{lat:41.3761130410205,lng:2.135481397190494},[u.BarcelonaLesCorts]:{lat:41.38712941201426,lng:2.1319819153619943},[u.BarcelonaSarria]:{lat:41.400077619003795,lng:2.1217253149155355},[u.BarcelonaGracia]:{lat:41.40024407130258,lng:2.1576520104487935},[u.BarcelonaHorta]:{lat:41.430657684044306,lng:2.161088512541204},[u.BarcelonaNouBarris]:{lat:41.45157080011613,lng:2.1762483194703726},[u.BarcelonaStAndreu]:{lat:41.43649915403711,lng:2.191662183705322},[u.BarcelonaStMarti]:{lat:41.40354477691881,lng:2.189614654857775}},D=["popover"],T=["map"];let O=(()=>{var s;class e{set latitude(t){this.location.lat=t}set longitude(t){this.location.lat=t}get latitude(){return this.location.lat}get longitude(){return this.location.lng}get markerIsOpen(){return!!this.markerId}closeMarker(){this.markerId=void 0}get markerTitle(){return this.markerId?this.markers[this.markerId].title:void 0}markerInfo(){return"<div>     </div>"}constructor(){this.markers={},this.location=A[u.BarcelonaCenter]}ngOnInit(){}getPosition(){var t=this;return(0,i.A)(function*(){try{let r=yield B.checkPermissions();if(console.log("geoPosPermision: ",r.location,r.coarseLocation),("prompt"===r.location||"prompt"===r.coarseLocation)&&(r=yield B.requestPermissions()),"granted"===r.location||"granted"===r.coarseLocation){const l=yield B.getCurrentPosition({maximumAge:75e3,timeout:25e3});t.location={lat:l.coords.latitude,lng:l.coords.longitude},console.log("NEW location: ",t.location.lat,t.location.lng)}else t.location=A[u.BarcelonaCenter],console.log("Not granted??")}catch(r){console.log("Geolocation error: ",r),t.location=A[u.BarcelonaCenter]}return t.location})()}ngAfterViewInit(){var t;console.debug("OUTER HTML",null===(t=this.mapRef)||void 0===t||null===(t=t.nativeElement)||void 0===t?void 0:t.outerHTML),this.createMap()}createMap(){var t=this;return(0,i.A)(function*(){try{const r=yield t.getPosition();t.newMap=yield P.create({id:b.nV,element:t.mapRef.nativeElement,apiKey:b.oO,config:{center:r,zoom:17,zoomControl:!1,streetViewControl:!1}},l=>{t.mapId=l.mapId,console.log("MAP-ID: ",l)}),console.log("CREATE-MAP CALLED: ",t.location),t.mapInitialActions()}catch(r){throw console.log(r),r}})()}mapInitialActions(){var t=this;return(0,i.A)(function*(){yield t.newMap.disableTouch(),t.newMap.disableScrolling(),"web"!=c.Ii.getPlatform()&&(yield t.newMap.enableIndoorMaps(!1),yield t.newMap.enableAccessibilityElements(!0)),yield t.newMap.enableTrafficLayer(!0).then(()=>{console.log("enableTrafficLayer")}),t.mapRef.nativeElement.classList.add("show-map"),t.newMap.setOnMapClickListener(function(){var r=(0,i.A)(function*(l){t.addMarker(l.latitude,l.longitude)});return function(l){return r.apply(this,arguments)}}()),t.newMap.setOnMarkerClickListener(r=>{console.log("setOnMarkerClickListener",r)}),t.newMap.enableClustering(2),t.newMap.setOnClusterClickListener(r=>{console.log("setOnClusterClickListener",r)}),t.newMap.setOnClusterInfoWindowClickListener(r=>{console.log("setOnClusterInfoWindowClickListener",r)}),t.newMap.setOnInfoWindowClickListener(r=>{console.log("setOnInfoWindowClickListener",r)}),t.newMap.setOnMyLocationButtonClickListener(r=>{console.log("setOnMyLocationButtonClickListener",r)}),t.newMap.setOnMyLocationClickListener(r=>{console.log("setOnMyLocationClickListener",r)}),console.log("marker:",t.location),yield t.addMarker(t.location.lat,t.location.lng)})()}addMarker(t,r){var l=this;return(0,i.A)(function*(){const f={coordinate:{lat:t,lng:r},opacity:1,title:"Hola",snippet:"<div>Aix\xf2 \xe9s una <b>informaci\xf3</b> addicional.</div>"},y=yield l.newMap.addMarker(f);l.markers[y]=f})()}ngOnDestroy(){var t=this;return(0,i.A)(function*(){t.watchId&&(yield B.clearWatch({id:t.watchId})),t.newMap&&(yield t.newMap.destroy())})()}}return(s=e).\u0275fac=function(t){return new(t||s)},s.\u0275cmp=o.VBU({type:s,selectors:[["app-gmap"]],viewQuery:function(t,r){if(1&t&&(o.GBs(D,5),o.GBs(T,5)),2&t){let l;o.mGM(l=o.lsd())&&(r.popover=l.first),o.mGM(l=o.lsd())&&(r.mapRef=l.first)}},inputs:{appId:"appId",latitude:[2,"latitude","latitude",o.Udg],longitude:[2,"longitude","longitude",o.Udg]},standalone:!0,features:[o.GFd,o.aNF],decls:6,vars:4,consts:[["map",""],[3,"latitude","longitude"],["size","cover",3,"didDismiss","is-open"],[1,"ion-padding"]],template:function(t,r){if(1&t){const l=o.RV6();o.nrm(0,"capacitor-google-map",1,0),o.j41(2,"ion-popover",2),o.bIt("didDismiss",function(){return o.eBV(l),o.Njj(r.closeMarker())}),o.j41(3,"ion-content",3)(4,"div"),o.EFF(5),o.k0s()()()}2&t&&(o.Y8G("latitude",r.latitude)("longitude",r.longitude),o.R7$(2),o.Y8G("is-open",r.markerIsOpen),o.R7$(3),o.JRh(r.markerTitle))},dependencies:[v.CF],styles:["capacitor-google-map[_ngcontent-%COMP%]{display:inline-block;width:100%;height:100%;opacity:0;transition:opacity .15s ease-in}capacitor-google-map.show-map[_ngcontent-%COMP%]{opacity:1}"]}),e})(),_=(()=>{var s;class e{constructor(){this.title="Mapa busos Barcelona"}ngOnInit(){}}return(s=e).\u0275fac=function(t){return new(t||s)},s.\u0275cmp=o.VBU({type:s,selectors:[["app-tab1"]],viewQuery:function(t,r){if(1&t&&o.GBs(O,5),2&t){let l;o.mGM(l=o.lsd())&&(r.gMapComponent=l.first)}},standalone:!0,features:[o.aNF],decls:6,vars:3,consts:[["loggedIn","true","userValidated","true"],["id","main-content",1,"ion-page"],[3,"title"],[3,"fullscreen"],["appId","App-Bus-Barcelona"]],template:function(t,r){1&t&&(o.nrm(0,"app-menu",0),o.j41(1,"main",1),o.nrm(2,"app-header",2),o.j41(3,"ion-content",3),o.nrm(4,"app-content-header",2)(5,"app-gmap",4),o.k0s()()),2&t&&(o.R7$(2),o.Y8G("title",r.title),o.R7$(),o.Y8G("fullscreen",!0),o.R7$(),o.Y8G("title",r.title))},dependencies:[C.Z,h.l,L.Q,v.W9,O],styles:["capacitor-google-map[_ngcontent-%COMP%]{display:inline-block;width:275px;height:400px}"]}),e})()}}]);