// import "./App.css";
// import Axios from "axios";
// import {useEffect, useState } from "react";
 
// function App() {
//   fetch("http://localhost:8080/ords/ordstest/api/example/api/").then(res => {res.json().then(data => {console.log(data.items);})});

//   fetch("http://localhost:8080/ords/ordstest/api/example/api/").then(
//   res => {
//     res.json().then(
//       data => {
//         console.log(data.items);
//         if (data.items.length > 0) {

//           var temp = "";
//           data.items.forEach((itemData) => {
//             temp += "<tr>";
//             temp += "<td>" + itemData.ename + "</td>";
//             temp += "<td>" + itemData.dname + "</td>";
//             temp += "<td>" + itemData.job + "</td></tr>";
//           });
//           document.getElementById('data').innerHTML = temp;
//         }
//       }
//     )
//   }
// )
//   return (
//     <div className="App">
//       <button>Retrieve data.</button>
//     </div>
//   );
// }

// export default App;
// http://localhost:8080/ords/ordstest/api/example/api/

fetch('https://fakestoreapi.com/products')
            .then(res=>res.json())
            .then(json=>console.log(json))