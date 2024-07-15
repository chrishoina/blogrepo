const uri = 'http://localhost:8080/ords/ordstest/api/example/api/';
const initDetails = {
    method: 'get',
    headers: {
        "Content-Type": "application/json; charset=utf-8"
    },
    mode: "cors"
}

function GetData() {

    fetch( uri, initDetails )
        .then( response =>
        {
            if ( response.status !== 200 )
            {
                console.log( 'Looks like there was a problem. Status Code: ' +
                    response.status );
                return;
            }

            console.log( response.headers.get( "Content-Type" ) );
            return response.json();
        }
        )
        .then( myJson =>
        {
            console.log( JSON.stringify( myJson ) );
        } )
        .catch( err =>
        {
            console.log( 'Fetch Error :-S', err );
        } );
}

<html>
<body>
   <h2>Using the <i> fetch() browser method </i> to fetch data from API</h2>
   <div id = "output"> </div> 
   <button onclick = "fetchData()"> Fetch API to get data </button>
   <script>
      let output = document.getElementById('output');
      function fetchData() {
         fetch('https://dummyjson.com/products/1')
         .then(response => response.json())
         .then(data => {
            output.innerHTML += "id = " + data.id + "<br/>";
            output.innerHTML += "brand = " + data.brand + "<br/>";
            output.innerHTML += "category = " + data.category + "<br/>";
            output.innerHTML += "price = " + data.price + "<br/>";
            output.innerHTML += "rating = " + data.rating + "<br/>";
            output.innerHTML += "stock = " + data.stock + "<br/>";
         })
      }
   </script>
</body>
</html>
