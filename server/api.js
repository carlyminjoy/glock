const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://carly:charles2013@cluster0-cq98e.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { 
    useNewUrlParser: true,
    useUnifiedTopology: true
});

var api = (app) => {

    app.get("/api/leaderboard", (req, res) => {
        client.connect(err => {
            if (err) return res.status(500).send('Error while connecting!');

            const collection = client.db("glock").collection("games");
            if (!collection) return res.status(404).send('Could not find collection!');

            collection.find().toArray(function(err, games) {
                if (err) return res.status(404).send('No results!');

                res.status(200).send(games);
            })

            client.close();
        })
    })

    app.post("/api/games", (req, res) => {
        console.log('req', req);

        client.connect(err => {
            if (err) return res.status(500).send('Error while connecting!');

            const collection = client.db("glock").collection("games");
            if (!collection) return res.status(404).send('Could not find collection!');

            collection.insertOne({
                round: req.body.round,
                winner: req.body.winner,
                loser: req.body.loser,
                mode: req.body.mode
            })

            res.status(200);
            client.close();
        })
    })
}
  
module.exports = api;