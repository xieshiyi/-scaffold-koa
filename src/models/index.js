const mongoose = require('mongoose')
const { mongoUri, mongoOptions } = require('../../config')

mongoose.Promise = global.Promise

const conn = mongoose.createConnection(`${mongoUri}`, mongoOptions)

console.log('=======初始化 models 完毕=======')

const db = {};

const log = require('./log')

const models = [
    log
]

for (model of models) {
    const newSchema = new mongoose.Schema(typeof model.schema === 'function' && model.schema(mongoose.Schema) || model.schema, { collection: model.name });
    db[model.name] = conn.model(model.name, newSchema);
}

module.exports = db;
