const http = require('http'); // pull in http module
// url module for parsing url string
const url = require('url');
// querystring module for parsing querystrings from url
const query = require('querystring');
// pull in our custom files
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
  GET: {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getFlowcharts': jsonHandler.getFlowcharts,
    notReal: jsonHandler.notReal,

  },
  HEAD: {
    '/getFlowcharts': jsonHandler.getFlowchartsMeta,
    '/notReal': jsonHandler.notRealMeta,
    notFound: jsonHandler.notFound,
  },
  POST:
    {
      '/addFlowchart': jsonHandler.addFlowchart,
    },

};

// handle POST requests
const handlePost = (request, response, parsedUrl) => {
  // if post is to /addUser (our only POST url)
  if (parsedUrl.pathname === '/addFlowchart') {
    const res = response;

    // uploads come in as a byte stream that we need
    // to reassemble once it's all arrived
    const body = [];

    // if the upload stream errors out, just throw a
    // a bad request and send it back
    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    // on 'data' is for each byte of data that comes in
    // from the upload. We will add it to our byte array.
    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // on end of upload stream.
    request.on('end', () => {
      // combine our byte array (using Buffer.concat)
      // and convert it to a string value (in this instance)
      const bodyString = Buffer.concat(body).toString();
      // since we are getting x-www-form-urlencoded data
      // the format will be the same as querystrings
      // Parse the string into an object by field name
      const bodyParams = query.parse(bodyString);

      // pass to our addFlowchart function
      if (parsedUrl.pathname === '/addFlowchart') { jsonHandler.addFlowchart(request, res, bodyParams); }
    });
  }
};
const onRequest = (request, response) => {
  // parse url into individual parts
  // returns an object of url parts by name
  const parsedUrl = url.parse(request.url);
  if (request.method === 'POST') {
    handlePost(request, response, parsedUrl);
  } else if (urlStruct[request.method][parsedUrl.pathname]) {
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notReal(request, response);
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);
