const express = require('express');
const Multer = require('multer');
const util = require('util');
const app = express();
const router = express.Router();
const { upload } = require('./helpers/uploader');
const { Photo } = require('./models')

const port = 8080;

router.post('/photos', async function (req, res) {

  let processFile = Multer({
    storage: Multer.memoryStorage(),
  }).single("image");
  
  let parseFile = util.promisify(processFile);
  await parseFile(req, res)
  // upload to GCS
  const url = await upload(req.file);
  // save to DB
  const photo = Photo.build({url: url, caption: req.body})

  photo
    .save()
    .then((_) => {
      res.status(200).send({
        message: 'photo successfully uploaded'
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err
      });
    });
 
  res.status(200).send({
    message: 'file successfully parsed'
  });
});

router.get('/photos', async function (req, res) {
  const photos = await Photo.findAll();
  res.status(200).send({
    data: photos
  });
});

router.get('/ping', function (req, res) {
  res.status(200).send({
    message: 'pong'
  });
});


app.use(router);


app.listen(port, () => {
  console.log(`App listening on port ${port}`)
});


/* const express = require('express');
const app = express();
const router = express.Router();
const Multer = require('multer');
const util = require('util');
const { upload } = require('./helpers/uploader');

// upload to GCS
router.post('/photos', async function (req, res) {
  const url = await upload(req.file);

  let processFile = Multer({
    storage: Multer.memoryStorage(),
  }).single('image');

  let parseFile = util.promisify(processFile);
  await parseFile(req, res);

  // save to DB
  const photo = Photo.build({ url: url, caption: req.caption });

  photo
    .save()
    .then((_) => {
      res.status(200).send({
        message: 'photo successfully uploaded',
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: err,
      });
    });
});

const port = 3000;

router.get('/ping', function (req, res) {
  res.status(200).send({
    message: 'pong',
  });
});

app.use(router);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
}); */
