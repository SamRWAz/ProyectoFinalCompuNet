const path = require("path")
const fs = require("fs")

 
const dbPath = path.join(__dirname, "../..", 'database', 'db.json')


const DBConnection = {
    readDB: () => {
	const data = fs.readFileSync(dbPath, 'utf-8')
	return JSON.parse(data)
    }, 

    writeDB: (data) => {
	fs.writeFileSync(dbPath, JSON.stringify(data, null, 2))
    }
}

module.exports = DBConnection


