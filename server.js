const express = require("express")
const app = express()

/*eslint-disable-next-line*/
app.listen(4000, () => { console.log("Server started") })
app.get("/", async (req, res) => {
	res.sendFile (__dirname + "/public/index.html")
})
app.use(express.static("public"))
app.use((req, res) => { res.status(404).send("404: Not found") })
