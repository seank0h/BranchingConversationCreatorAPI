//Flowchart object
const flowcharts = {
  1:
  {
    name: '',
    textbox: [],
  },
};

//Variables to hold flowcharts count and textbox counts for each flowchart
let flowChartsCount = 0;
let textBoxCount = 0;
// function to respond with a json object
// takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.write(JSON.stringify(object));
  response.end();
};

// function to respond without json body
// takes request, response and status code
const respondJSONMeta = (request, response, status) => {
  const headers = {
    'Content-Type': 'application/json',
  };
  response.writeHead(status, headers);
  response.end();
};

// return flowchart object as JSON
const getFlowcharts = (request, response) => {
  const responseJSON = {
    flowcharts,
    textBoxCount,
    flowChartsCount,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getFlowchartsMeta = (request, response) => respondJSONMeta(request, response, 200);


// function to add a user from a POST body
const addFlowchart = (request, response, body) => {
  // default json message
  const responseJSON = {
    message: 'Name required.',
  };

  // check to make sure we have both fields
  // We might want more validation than just checking if they exist
  // This could easily be abused with invalid types (such as booleans, numbers, etc)
  // If either are missing, send back an error message as a 400 badRequest
  if (!body.name) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }
  // New flowchart to add to overall flowchart database
  const newFlowchart = {
    //Setting Variables equal to the sent body
    name: body.name,
    textbox: body.text,
    textBoxCount: body.textBoxCount
  };
  textBoxCount = body.textBoxCount;
  // default status code to 201 created
  const responseCode = 201;
  //Adding and Updating Fields to Flowchart
  flowcharts[flowChartsCount] = {};
  flowcharts[flowChartsCount].textbox = {};
  //Splitting Text from the text boxes with commas
  let individualTextBox = newFlowchart.textbox.split(',');
  // add or update fields for this user name
  flowcharts[flowChartsCount].name = newFlowchart.name;
  for(let i =0; i<body.textBoxCount; i ++)
  {
    //Adding text from individual text boxes to one index
    flowcharts[flowChartsCount].textbox[i] =individualTextBox[i];
    console.dir(flowcharts[flowChartsCount].textbox[i]);
  }

  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    flowChartsCount++;
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respondJSONMeta(request, response, responseCode);
};

const notReal = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found',
    id: 'notReal',
  };

  return respondJSON(request, response, 404, responseJSON);
};
const notRealMeta = (request, response) => respondJSONMeta(request, response, 404);

// public exports
module.exports = {
  getFlowcharts,
  getFlowchartsMeta,
  addFlowchart,
  notReal,
  notRealMeta,
};
