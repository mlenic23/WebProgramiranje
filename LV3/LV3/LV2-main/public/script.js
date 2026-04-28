//Zadatak 1.
let sviFilmovi = [];  

document.addEventListener('DOMContentLoaded', () => { 
    fetch('movies.csv') 
        .then(res => res.text()) 
        .then(csv => {
            const rezultat = Papa.parse(csv, {
                header: true,  
                skipEmptyLines: true 
            });

            sviFilmovi = rezultat.data.map(film => ({ //map prolazi kroz svaki redak
                naslov: film.Naslov, 
                zanr: film.Zanr,
                godina: Number(film.Godina),
                trajanje: Number(film.Trajanje_min), 
                ocjena: Number(film.Ocjena)
            }));

            prikaziTablicu(sviFilmovi); 
        })
        .catch(err => console.error('Greška...', err)); 
});

function prikaziTablicu(podaci) { 
    const tbody = document.querySelector('#filmovi-tablica tbody'); 

    tbody.innerHTML = '';  

    podaci.forEach(film => { 
        const row = document.createElement('tr');  //za svaki stvara novi prazan redak
        row.innerHTML = `
            <td>${film.naslov}</td> 
            <td>${film.godina}</td>
            <td>${film.zanr}</td>
            <td>${film.trajanje} min</td>
            <td>${film.ocjena}</td>
            <td><button class="add-to-cart" onclick="dodajUKosaricu('${film.naslov.replace(/'/g, "\\'")}')">Dodaj</button></td>

        `; 
        tbody.appendChild(row); 
    });
}

//Zadatak 2.
const searchInput = document.querySelector('#search-title');  
const genreSelect = document.querySelector('#filter-genre');
const yearFromInput = document.querySelector('#year-from');
const yearToInput = document.querySelector('#year-to');
const ratingInput = document.querySelector('#filter-rating');
const ratingValueDisplay = document.querySelector('#rating-value');
const resetBtn = document.querySelector('#reset-filters');

function primijeniFiltere() { 
    const searchTxt = searchInput.value.toLowerCase(); 
    const odabraniZanr = genreSelect.value; 
    const godinaOd = parseInt(yearFromInput.value) || 0; 
    const godinaDo = parseInt(yearToInput.value) || 2000;
    const minOcjena = parseFloat(ratingInput.value); 

    ratingValueDisplay.innerText = minOcjena; 

    const filtriraniFilmovi = sviFilmovi.filter(film => { 
        const podudaraSeNaslov = film.naslov.toLowerCase().includes(searchTxt); 
        const podudaraSeZanr = odabraniZanr === 'all' || film.zanr.includes(odabraniZanr); 
        const podudaraSeGodina = film.godina >= godinaOd && film.godina <= godinaDo; 
        const podudaraSeOcjena = film.ocjena >= minOcjena; 

        return podudaraSeNaslov && podudaraSeZanr && podudaraSeGodina && podudaraSeOcjena; 
    });

    prikaziTablicu(filtriraniFilmovi); 
}

searchInput.addEventListener('input', primijeniFiltere);
genreSelect.addEventListener('change', primijeniFiltere);
yearFromInput.addEventListener('input', primijeniFiltere);
yearToInput.addEventListener('input', primijeniFiltere);
ratingInput.addEventListener('input', primijeniFiltere);

//reset button
resetBtn.addEventListener('click', () => {
    searchInput.value = ''; 
    genreSelect.value = 'all'; 
    yearFromInput.value = '';
    yearToInput.value = '';  
    ratingInput.value = 0;  
    ratingValueDisplay.innerText = '0';
    prikaziTablicu(sviFilmovi); 
});


//Zadatak 3.
let kosarica = [];

function dodajUKosaricu(naslovFilma) { 
    if (kosarica.includes(naslovFilma)) {
        alert("Film je već u košarici!"); 
        return;
    }
    
    kosarica.push(naslovFilma); 
    osvjeziKosaricu();
}

function osvjeziKosaricu() {
    const lista = document.querySelector('#cart-items-list'); 
    const brojac = document.querySelector('#cart-count');
    const praznaPoruka = document.querySelector('#cart-empty-msg');
    
    brojac.innerText = kosarica.length;
    lista.innerHTML = '';

    if (kosarica.length === 0) {
        praznaPoruka.style.display = 'block';  
    } else {
        praznaPoruka.style.display = 'none';
        kosarica.forEach((film, index) => {
            const li = document.createElement('li'); 
            li.innerHTML = `
                <span>${film}</span>
                <button class="remove-btn" onclick="ukloniIzKosarice(${index})">Ukloni</button> 
            `; 
            lista.appendChild(li);
        });
    }
}

function ukloniIzKosarice(index) {
    kosarica.splice(index, 1); 
    osvjeziKosaricu();
}

document.querySelector('#view-cart-btn').addEventListener('click', () => {
    document.querySelector('#cart-section').style.display = 'block';
}); 

document.querySelector('#close-cart').addEventListener('click', () => {
    document.querySelector('#cart-section').style.display = 'none';
}); 

document.querySelector('#confirm-purchase').addEventListener('click', () => {
    if (kosarica.length === 0) {
        alert("Košarica je prazna!");
        return; //ne dopušta potvrdu ako je košarica prazna
    }
    
    const broj = kosarica.length; 
    const poruka = `Uspješno ste dodali ${broj} ${broj === 1 ? 'film' : (broj < 5 ? 'filma' : 'filmova')} u svoju košaricu za vikend maraton!`;
    
    alert(poruka); 
    

    kosarica = []; 
    osvjeziKosaricu();
    document.querySelector('#cart-section').style.display = 'none'; 
});