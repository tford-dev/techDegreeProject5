//Function to append search results to DOM as well as add a button to redirect user to all 12 employees
const generateSearch = () => {
    gallery.innerHTML = null;
    searchArr.map(employee => {
        gallery.insertAdjacentHTML('beforeend', `
            <div class="card">
                <div class="card-img-container">
                    <img class="card-img" src=${employee.picture.large} alt="profile picture">
                </div>
                <div class="card-info-container">
                    <h3 id="name" class="card-name cap">${employee.name.first} ${employee.name.last}</h3>
                    <p class="card-text">${employee.email}</p>
                    <p class="card-text cap">${employee.location.city}, ${employee.location.state}</p>
                </div>
            </div>
        `);
    });
    gallery.insertAdjacentHTML('beforeend', `<button id="view-all">View All Employees</button>`);
    document.getElementById("view-all").addEventListener("click", (event)=>{
        generateCard();
        event.target.remove();
    });
    modalHandler(searchArr);
}

//Function to handle logic for search bar
const searchHandler = () =>{
    //Adds search bar to DOM
    searchContainer.insertAdjacentHTML('beforeend', `
        <form action="#" method="get">
            <input type="search" id="search-input" class="search-input" placeholder="Search...">
            <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>
    `);
    const searchInput = document.getElementById("search-input");
    const searchSubmit = document.getElementById("search-submit");
    searchSubmit.addEventListener("click", (event)=>{
        event.preventDefault();
        //Empties Array
        searchArr.length = 0;
        //Uses info from JSON data to create a string for each object so the user can search by name, location, or birthday
        const dataString = data.results.map((x)=>
            `${x.name.first} ${x.name.last} ${x.location.city} ${x.cell} ${x.location.street.number} ${x.location.street.name} ${x.location.state} ${x.nat} ${x.location.postcode} ${x.dob.date}`
        );
        //Pushes search results to searchArr array by using index of dataString in data.results array
        for(let j = 0; j < dataString.length; j++){
            if(dataString[j].toLowerCase().indexOf(searchInput.value.toLowerCase()) !== -1){
                searchArr.push(data.results[j]);
            }
        }
        if(searchArr.length === 0 || searchInput.value.length === 0 || searchInput.value === " "){
            alert("Sorry, no results found");
        } else {
            generateSearch();
        }
        //Resets searchbar text
        searchInput.value = "";
    })
}