const express = require('express');
const fs = require('fs'); // Modul za rad s datotekama [cite: 54, 696]
const path = require('path'); // Modul za putanje [cite: 70, 697]

const app = express();
const PORT = process.env.PORT || 3000;

// Postavljamo EJS kao view engine [cite: 362]
app.set('view engine', 'ejs');

// Posluživanje statičkih datoteka iz mape 'public' [cite: 652]
app.use(express.static('public'));

// Ruta za početnu stranicu [cite: 758, 759]
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta za generiranje galerije slika (Zadatak 3) [cite: 712]
app.get('/slike', (req, res) => {
    // Putanja do mape sa slikama unutar public foldera [cite: 713]
    const folderPath = path.join(__dirname, 'public', 'images');
    
    // Čitanje svih datoteka iz te mape [cite: 714]
    const files = fs.readdirSync(folderPath);
    
    // Filtriramo samo slike (.jpg, .png) i pretvaramo ih u objekte [cite: 715, 717]
    const images = files
        .filter(file => file.endsWith('.jpg') || file.endsWith('.png'))
        .map((file, index) => ({
            url: `/images/${file}`,          // URL slike za HTML [cite: 721]
            id: `slika${index + 1}`,         // Jedinstveni ID za lightbox [cite: 722]
            title: `Slika ${index + 1}`      // Naslov slike [cite: 723]
        }));
        
    // Šaljemo niz slika u predložak slike.ejs [cite: 730]
    res.render('slike', { images: images });
});

app.listen(PORT, () => {
    console.log(`Server pokrenut na http://localhost:${PORT}`);
});