    //Auntoinvocacion
// 20.236554, -97.965143
    (function(){
    const lat = 20.236554;
    const lng = -97.965143;
    const map = L.map('map', {
        center: [lat, lng],
        zoom: 16,
        dragging: true  
    });        
        let marker  
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);        
    
        marker = new L.marker([lat, lng],{
            draggable: false, //Puedes mover
            autoPan: true,
        }).addTo(map);
    
        
      
    })();
    
    