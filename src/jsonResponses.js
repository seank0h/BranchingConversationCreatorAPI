// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const flowcharts = {
  0:
  {
    name:"",
    textbox:{
      0:"",
    }
  }
};

let flowChartsCount = 0;
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

// return user object as JSON
const getFlowcharts = (request, response) => {
  const responseJSON = {
    flowcharts,
  };

  return respondJSON(request, response, 200, responseJSON);
};

const getFlowchartsMeta = (request, response) => {
    
    return respondJSONMeta(request,response,200);
    
};



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
  //New flowchart to add to overall flowchart database
  const newFlowchart = {
    name:body.name,
    textbox:{
      0: body.textbox,
    }
  };
  // default status code to 201 created
  let responseCode = 201;
  flowcharts[flowChartsCount] ={};
  // add or update fields for this user name
  flowcharts[flowChartsCount].name = newFlowchart.name;
  flowCharts[flowChartsCount][name][textbox][body.count] = newFlowchart.textbox;
  console.log(body);
  // if response is created, then set our created message
  // and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
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
const notRealMeta = (request, response) => {
    return respondJSONMeta(request, response, 404)
};

// public exports
module.exports = {
  getFlowcharts,
  getFlowchartsMeta,
  addFlowchart,
  notReal,
  notRealMeta,
};
