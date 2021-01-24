const body            = document.querySelector("body");
const gallery         = document.getElementById("gallery");
const searchContainer = document.querySelector(".search-container");
const cards           = document.getElementsByClassName("card");
const usersUrl        = "https://randomuser.me/api/?nat=us&results=12";
let data;
let searchArr = [];

//Promise to obtain JSON, I changed nationality of URL to United States
const getJSON = (url) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = () => {
            if(xhr.status === 200) {
                data = JSON.parse(xhr.responseText);
                resolve(data);
            } else {
                reject (Error(xhr.statusText));
            }
        };
        xhr.onerror = () => reject(Error('Error'));
        xhr.send();
    });
}

//Function to re-format phone number to (555) 555-5555
const phoneNumFormat = (numKey) => {
    let cleaned = ('' + numKey).replace(/\D/g, '')
    let match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
    if (match) {
        return `(${match[1]}) ${match[2]}-${match[3]}`
    }
    return numKey;
}

//Function to re-format birthday to mm/dd/yyyy
const birthdayFormat = (birthday) => {
    let cleaned = ('' + birthday).replace(/\D/g, '')
    let match = cleaned.match(/^(\d{4})(\d{2})(\d{2})$/)
    if (match) {
        return `${match[2]}/${match[3]}/${match[1]}`
    }
    return birthday;
}

//Function to toggle between employee cards
const modalHandler = (arr) =>{
    for(let i = 0; i < cards.length; i++){
        //Event Listener for clicking on employee icons
        cards[i].addEventListener('click', (event) =>{
            //Adds modal to DOM
            body.insertAdjacentHTML('beforeend', `
                <div class="modal-container">
                <div class="modal">
                    <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                    <div class="modal-info-container">
                        <img class="modal-img" src="${arr[i].picture.large}" alt="profile picture">
                        <h3 id="name" class="modal-name cap">${arr[i].name.first} ${arr[i].name.last}</h3>
                        <p class="modal-text">${arr[i].email}</p>
                        <p class="modal-text cap">${arr[i].location.city}</p>
                        <hr>
                        <p class="modal-text">${phoneNumFormat(arr[i].cell)}</p>
                        <p class="modal-text">${arr[i].location.street.number} ${arr[i].location.street.name}, ${arr[i].location.city}, ${arr[i].location.state}, ${arr[i].nat} ${arr[i].location.postcode}</p>
                        <p class="modal-text">Birthday: ${birthdayFormat(arr[i].dob.date.slice(0, 10))}</p>
                    </div>
                </div>
                <div class="modal-btn-container">
                    <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                    <button type="button" id="modal-next" class="modal-next btn">Next</button>
                </div>
            </div>
            `)
            //Below is functionality for buttons when toggling between employee cards
            document.getElementById("modal-close-btn").addEventListener('click', () =>{
                document.querySelector(".modal-container").remove();
            });
            
            document.getElementById("modal-next").addEventListener('click', ()=>{
                document.getElementById("modal-close-btn").click();
                if(i === cards.length - 1){
                    cards[0].click();
                } else {
                    cards[i + 1].click();
                };
            });
            document.getElementById("modal-prev").addEventListener('click', ()=>{
                document.getElementById("modal-close-btn").click();
                if(i === 0){
                    cards[cards.length - 1].click();
                } else {
                    cards[i - 1].click();
                };
            });
        });
    };      
};

//Function to add basic employee info to DOM
const generateCard = () => {
    console.log(data.results);
    gallery.innerHTML = null;
    data.results.map(employee => {
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
    //calling modalHandler for event listener that is in it
    modalHandler(data.results);
};

getJSON(usersUrl)
    .then(generateCard)
    .then(searchHandler);
