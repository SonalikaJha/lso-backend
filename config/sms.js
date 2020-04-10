const msg91 = require("msg91")("315210A5N1aQpXs5e2e8edfP1", "LSOCRM", "4");


// Mobile No can be a single number, list or csv string

// msg91.send(mobileNo, "MESSAGE", function(err, response){
//     console.log(err);
//     console.log(response);
// });

module.exports = msg91;
