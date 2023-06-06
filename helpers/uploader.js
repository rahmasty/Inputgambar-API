const { Storage } = require('@google-cloud/storage');
const credFilename = 'animated-bay-386416-ec0c75d4baef.json'
const bucketName = 'popup-class1' 

const storage = new Storage({
  keyFilename: credFilename
});
const bucket = storage.bucket(bucketName);


const upload = (file) => new Promise((resolve, reject) => {
 const { originalname, buffer } = file
 const blob = bucket.file(originalname.replace(/ /g, "_"));
 const blobStream = blob.createWriteStream({
   resumable: false,
 });
 blobStream.on('finish', () => {
   const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
   resolve(publicUrl)
 })
   .on('error', () => {
     reject(`Unable to upload image, something went wrong`)
   })
   .end(buffer)
});


module.exports = {
  upload
}