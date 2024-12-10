var express = require('express');
var router = express.Router();

const multer  = require('multer')
const storage = multer.diskStorage({
     destination: (req, file, cb) => {
        cb(null, 'public/uploads/')
     },
     filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const hasierakoZatia = file.originalname.split(".")[0];
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
        if ((file.mimetype != 'image/png') && (file.mimetype != 'image/jpeg')) {
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
    const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

    res.send(`Zure izena: ${izena}. Fitxategia: ${url}`);
    res.status(201);
})

module.exports = router;
