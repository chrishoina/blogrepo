fetch("https://gf641ea24ecc468-moviestream.adb.us-ashburn-1.oraclecloudapps.com/ords/admin/moviestream/summarydetails", {"method":"GET"}).
then(response => response.json()) 
.then(data => {
    const list = data.items;

    list.map((bobby) => {
        const title = bobby.title;
        const year = bobby.year;
        const gross = bobby.gross; 
        const cast =  bobby.cast;
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

