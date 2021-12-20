const axios = require("axios");
const async = require("async");

/* FUNCTION USAGE
findServer is a function which that determines the availability of a given list of servers
and then returns an available server with the lowest priority number.

REQUEST JSON OBJECT MOCKUP
[{
  "url": "http://doesNotExist.boldtech.co",
  "priority": 1
}, {
  "url": "http://boldtech.co",
  "priority": 7
}, {
  "url": "http://offline.boldtech.co",
  "priority": 2
}, {
  "url": "http://google.com",
  "priority": 4
}] */

exports.findServer = async (req, res, next) => {

  //INTIALISING THE INITIAL VARIABLES
  var requestData = req.body;
  var maxPriority = requestData[0].priority;
  console.log(maxPriority);
  var maxPriorityIndex = 0;
  console.log(requestData);

  //Initialise an array of pending promises serving http request to all urls
  var promises = requestData.map((urlData) => {
    return axios.get(urlData.url, {}, { timeout: 5 });
  });

  //REQUEST HANDLER CHECKS SERVER AVAILABILITY 
  this.requestHandler(promises, requestData, function (resolvedServerList) {
    //CHECK IF ANY SERVER IS ONLINE OR NOT AND RETURNS STATUS ACCORDINGLY
    if (resolvedServerList.length > 0) {
      res.status(200).json({
        success: true,
        result: resolvedServerList[0],
      });
    } else {
      res.status(200).json({
        success: true,
        message: "All servers are offline",
        result: []
    });
    }
  });
};

// RequestHandler RETURNS AN ARRAY OF ACTIVE SERVERS
exports.requestHandler = async (promises, requestData, callback) => {
  var resolvedServerList = [];

  //RESOLVES PROMISES AND CHECK THE STATUS CODE OF RESPONSE
  async.forEachOf(
    promises,
    function (eachUserName, index, cb) {
      promises[index]
        .then((result) => {
          if (result.status >= 200 && result.status <= 209) {
            resolvedServerList.push(requestData[index]);
          }
          cb();
        })
        .catch((error) => {
          //console.log(error);
          cb();
        });
    },
    function (err, result) {
      if (err) {
        cb();
      } else {
        //SORTING OF ACTIVE SERVERS IS DONE ON THE BASIS OF PRIORITY
        resolvedServerList = resolvedServerList.sort((a, b) => {
          return a.priority - b.priority;
        });
        if (resolvedServerList.length == 0) {
          callback([]);
        } else {
          callback(resolvedServerList);
        }
      }
    }
  );
};
