const ordsApi = "http://localhost:8080/ords/ordstest/api/example/api/";

// This next one is just an example using query parameters. I just chose a random employee number: 
// const filteredOrdsApi = 'http://localhost:8080/ords/ordstest/api/example/api/?q={"empno":"7876"}';

const myList = document.querySelector("ul");

fetch(ordsApi).then((response) => {
    if (!response.ok) {
        throw new Error(`HTTP error, status = ${response.status}`);
    }
    return response.json();
}).then((data) => {
    for (const item of data.items) {``
        const listItem = document.createElement("p");

        const empnoElement = document.createElement("strong");
        empnoElement.textContent = item.empno;

        const enameElement = document.createElement("strong");
        enameElement.textContent = `${item.ename}`;
        
        const dnameElement = document.createElement("strong");
        dnameElement.textContent = `${item.dname}`;

        const jobElement = document.createElement("strong");
        jobElement.textContent = `${item.job}`;
        
        listItem.append(`Employee number `, empnoElement, ` was hired on ${item.hiredate}.`, ` Their last name is `, enameElement, ` and they work as a `, jobElement, ` in the `, dnameElement, ` department.`
            );
            myList.appendChild(listItem);
        }
    })
    .catch((error) => {
        const p = document.createElement("p");
        p.appendChild(document.createTextNode(`Error: ${error.message}`));
        document.body.insertBefore(p, myList);
    });
