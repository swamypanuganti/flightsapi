const http = require('http');
const express = require('express');
const webServerConfig = require('../config/web-server.js');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
let httpServer;
//for initialize common Objects
async function initialize(commonObjects) {
    const config = commonObjects.config;
    const db = commonObjects.db;
    return new Promise((resolve, reject) => {
        const app = express();
        httpServer = http.createServer(app);
        app.use(morgan('combined'));
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json({ limit: '150mb' }));
        app.use(bodyParser.urlencoded({
            extended: false, limit: '150mb', parameterLimit: 50000
        }));
        app.use(cors());
        const options = {
            explorer: true
        };
        app.post('/flights', (req, res) => {
            const dataObj = req.body;
            const result = createItem(dataObj);
            res.send(result);
        });
        async function createItem(dataObj) {
            const flightsObj = await new db.flights(dataObj);
            const result = await flightsObj.save();
            return result;
        }
        app.get('/flights', (req, res) => {
            db.flights.find()
                .then(result => {
                    res.send(result);
                })
        });
        app.get('/flights/{id}', (req, res) => {
            const id = parseInt(req.params.id, 10);
            db.flights.findOne({ '_id': id })
                .then(result => {
                    res.send(result);
                })
        });
        app.put('/flights/{id}', (req, res) => {
            db.flights.updateOne({ '_id': 1 },{$set:req.body})
                .then(result => {
                    res.send(result);
                })
        });
        app.patch('/flights/id', (req, res) => {
            db.flights.updateOne({ '_id': 1 },{$set:req.body})
                .then(result => {
                    res.send(result);
                })
        });
        app.delete('/flights/id', (req, res) => {
            db.flights.deleteOne({ '_id': 1 })
                .then(result => {
                    res.send(result);
                })
        });
        httpServer.listen(webServerConfig.port)
            .on('listening', () => {
                resolve();
            })
            .on('error', err => {
                reject(err);
            });
    });
}

module.exports.initialize = initialize;

function close() {
    return new Promise((resolve, reject) => {
        httpServer.close((err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    });
}

module.exports.close = close;
