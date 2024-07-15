fetch('https://gf641ea24ecc468-moviestream23ai.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/movie/'
, {"method":"GET"}).
then(response => response.json()) 
.then(data => {
    const list = data.items;

    list.map((item) => {
        const title = item.title;
        const year = item.year;
        const gross = item.gross; 
        const cast =  item.cast;
        const movieEntries = `<ul>
        <li><b>Movie Title:</b> ${title}</li>
        <li><b>Year Released:</b> ${year}</li>
        <li><b>Gross Revenue:</b> ${gross}</li>
        <li><b>Cast:</b> ${cast}</li>
        </ul>
    `
        document.querySelector('.movies').innerHTML += movieEntries;
        console.log(item)
    })
}).catch(err => {console.log(err);
})

