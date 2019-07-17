const amazon = require('amazon-product-api');
const client = amazon.createClient({
  awsId: "AKIAICW76V7ZIZKF5IOA",
  awsSecret: process.env.AWS_SECRET,
  awsTag: "itscheese-20"
});

function amazonSearch(req, res){
    const keywords = req.query.keywords;
    client.itemSearch({
        keywords : keywords,
        responseGroup: 'ItemAttributes,Images'
    }, function(err, results, response) {
      if (err) {
        console.log(err);
      } else {
        res.status(200).json(results);
      }
    });
}

module.exports = {
   amazon : amazonSearch 
}

