const axios = require("axios");
const async = require("async");

exports.findServer = async (req, res, next) => {
  var data = req.body;
  var maxPriority = data[0].priority;
  var maxPriorityIndex = 0;
  var newData = [];
  var promises = data.map((urlData) => {
    return axios.get(urlData.url,{},{timeout:5});
  });
  async.forEachOf(
    promises,
    function (eachUserName, index, cb) {
      promises[index]
        .then((result) => {
          if (result.status == 200) {
            newData.push(data[index]);
          }
          cb();
        })
        .catch((error) => {
          console.log(error);
          cb();
        });
    },
    function (err, result) {
      if (err) {
        cb();
      } else {
        newData = newData.sort((a, b) => {
          return a.priority - b.priority;
        });
        if(newData.length == 0 ){
          res.status(200).json({
            success: true,
            message:"All servers are offLine",
            result: [],
          });
        }else{
          res.status(200).json({
            success: true,
            result: newData[0],
          });
        }
      }
    }
  );
};
