var map = null;
var ui = null;
var marker = null;
var circle = null;
var mapa = null;

function traerMapa(){
    // Initialize the platform object:
    var platform = new H.service.Platform({
        'apikey': '-B7w5GAg76dnnvUtq_1ZFT8yjnsrYUn2O8Jll-OLXec'
    });
    
    // Obtain the default map types from the platform object
    var maptypes = platform.createDefaultLayers();
    
    // Instantiate (and display) a map object:
    map = new H.Map(
        document.getElementById('mapContainer'),
        maptypes.vector.normal.map,
        {
            zoom: 16,
            center: { lat: -31.44233, lng: -64.19324 }
        });
    
    // Enable the event system on the map instance:
    var mapEvents = new H.mapevents.MapEvents(map);
    
    // Add event listener:
    map.addEventListener('tap', function(evt) {
        // Log 'tap' and 'mouse' events:
        console.log(evt.type, evt.currentPointer.type); 
    });
    
    // Instantiate the default behavior, providing the mapEvents object:
    var behavior = new H.mapevents.Behavior(mapEvents);
    
    // Create an icon, an object holding the latitude and longitude, and a marker:
    coords = { lat: -31.44233, lng: -64.19324},
    marker = new H.map.Marker(coords);

    // Add the marker to the map and center the map at the location of the marker:
    map.addObject(marker);
    map.setCenter(coords);
    
    // Create the default UI:
    ui = H.ui.UI.createDefault(map, maptypes);
    
    // Instantiate a circle object (using the default style):
    circle = new H.map.Circle({lat: -31.44233, lng: -64.19324}, 100);
    
    // Add the circle to the map:
    map.addObject(circle);

    $("#btnMapa").prop('disabled', true);
}

function traerApi(){

    $.ajax({
        url:"https://nhorenstein.com/Coordenada/GetConPunto",
        type: "GET",
        success: function(result){
            if(result.ok){
                swal({
                    title:"Acción realizada",
                    text: "Será redirigido a la ubicación de nuestra API.",
                    icon:"success"
                });
                marker = new H.map.Marker({lng: result.return.longitud, lat:result.return.latitud});
                circle = new H.map.Circle({lng: result.return.longitud, lat:result.return.latitud}, 100);
                console.log(map)
                map.addObject(marker);
                console.log(result.return.longitud)
                console.log(result.return.latitud)
                map.setCenter({lng: result.return.longitud, lat:result.return.latitud});
                map.addObject(circle);
            }
            else{
                swal({
                    title:"Búsqueda Incorrecta",
                    text: "Error Inesperado",
                    icon:"error"
                });
                marker = new H.map.Marker({lng:-64.19324, lat:-31.44233});
                circle = new H.map.Circle({lat: -31.44233, lng: -64.19324}, 100);
                map.addObject(marker);
                map.setCenter({lng:-64.19324, lat:-31.44233});
                map.addObject(circle);
            }
        }
    }); 
}

function usarMarcador(marker, coords, zoom){
    map.addObject(marker);
    map.setCenter(coords);
    map.setZoom(zoom ? zoom :16);
}

function buscarCoord() {

    let lat = document.getElementById('inlineFormInputGroupUsername').value;
    let lng = document.getElementById('inlineFormInputGroupUsername2').value;

    if (lat === "" || lng === "" ) {
        swal('Error', 'Sera redireccionado a la ubicación por defecto', 'error'), traerApi();
    }
    else {
        swal({
            title:"Búsqueda Correcta",
            text: "Será dirigido a la ubicación deseada.",
            icon:"success"
        });
        usarMarcador(marker, coords, 5);
        
        coords = { lat, lng }
        marker = new H.map.Marker(coords);
        map.addObject(marker);
        map.setCenter(coords);     
    }
    clearText();
}

function clearText(){
    document.getElementById('inlineFormInputGroupUsername').value = "";
    document.getElementById('inlineFormInputGroupUsername2').value = "";
}

function borrarMarcadores(){
    if(marker !== null){
        map.removeObject(marker),traerApi();
    }
}

