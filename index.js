require("dotenv").config()

const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")
const fetch = require("node-fetch")
const pkg = require("./package.json")
const makeEndpoint = require("./app")
const getSettings = require("./settings")

const app = express()

// Support URL-encoded bodies such as those in Slack
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

// Automatically allow cross-origin requests
app.use(cors({ origin: true }))

app.use(express.static("static"))

app.post("/", makeEndpoint("general"))
app.post("/all", makeEndpoint("all"))
app.post("/adult", makeEndpoint("adult"))

app.get("/settings/read", async (req, res) => {
  try {
    const data = await getSettings()
    res.json(data)
  } catch (error) {
    // TODO: fallback on a static version
    res.json(error)
  }
})

app.get("/", (req, res) => {
  res.sendFile(path.join(`${__dirname}/static/index.html`))
})

// Catch-all
app.all("*", (req, res) => {
  res.json({ api: pkg.name, version: pkg.version, description: pkg.description })
})

app.listen(process.env.PORT || 3000, () => console.log("Server is running"))
