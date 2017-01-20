var r = require('rethinkdb');
var dotenv = require('dotenv');

dotenv.load();

var connection;

// Connect
var connect = function() {
    r.connect({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        db: process.env.DB_NAME
    }, function(error, conn) {
        if (error) throw error;
        connection = conn;
        createDatabase();
    });
}

// Create the database
var createDatabase = function() {
    r.dbCreate(process.env.DB_NAME).run(connection, function(error, result) {
        if (error) console.log(error);
        if ((result != null) && (result.dbs_created === 1)) {
            console.log(`Database ${process.env.DB_NAME} created`);
        }
        else {
            console.log(`Error: Database ${process.env.DB_NAME} not created`);
        }
        createTableUser()
    })
}

// Create the table User
var createTableUser = function() {
    r.db(process.env.DB_NAME).tableCreate('User').run(connection, function(error, result) {
        if (error) console.log(error);
    
        if ((result != null) && (result.tables_created === 1)) {
            console.log('Table `User` created');
        }
        else {
            console.log('Error: Table `User` not created');
        }
        createCollectionTable()
    });
}

// Create the table Collections
var createCollectionTable = function() {
    r.db(process.env.DB_NAME).tableCreate('Collection').run(connection, function(error, result) {
        if (error) console.log(error);
    
        if ((result != null) && (result.tables_created === 1)) {
            console.log('Table `Collection` created');
        }
        else {
            console.log('Error: Table `Collection` not created');
        }
        connection.close();
        process.exit();
    });
}

connect();