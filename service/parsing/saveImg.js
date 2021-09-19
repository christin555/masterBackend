const fs = require("fs");
const axios = require("axios");

module.exports = {
    saveImg: (img, path) => axios({
        method: "get",
        url: encodeURI(decodeURI(img)),
        responseType: "stream",
        maxRedirects: 500
    }).then(function (response) {
        response.data.pipe(fs.createWriteStream(path));
    }).catch(error => {
       // console.log(error);
    })
};


