var express = require('express');
var router = express.Router();

const fs = require('fs');
const path = require('path');

const uploadPath = path.join(__dirname, '../public/uploads');
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath, { recursive: true });
}

const multer  = require('multer')
const storage = multer.diskStorage({
     destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
     },
     filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const hasierakoZatia = file.originalname.split(".")[0].replaceAll(" ", "_");
        const luzapena = file.originalname.split(".")[1];
        const fitxategiIzena = `${hasierakoZatia}-${uniqueSuffix}.${luzapena}`;
        cb(null, fitxategiIzena)
     }
})

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2 MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new Error('PNG fitxategiak bakarrik onartzen dira'));
        } else {
            cb(null, true); 
        }
    }
});

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('form.html');
});

router.post('/', upload.single('avatar'), function (req, res, next) {
    const izena = req.body.izena;

    const codespaceURL = process.env.CODESPACE_NAME 
        ? `https://${process.env.CODESPACE_NAME}-3000.preview.app.github.dev`
        : `${req.protocol}://${req.get('host')}`;

    const url = `${codespaceURL}/uploads/${req.file.filename}`;

    res.status(201).send(`Zure izena: ${izena}. Fitxategia: ${url}`);
})

module.exports = router;
