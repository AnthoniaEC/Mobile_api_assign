const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')

const app = express()
const PORT = 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())


mongoose.connect("YOUR_MONGO_URI_HERE")
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.log(err))

// Schema & Model
const kittySchema = new mongoose.Schema({
    name: String
})

const Kitten = mongoose.model('Cat', kittySchema)

//  CREATE 
app.post("/api/submit-cat", async (req, res) => {
    try {
        const kitty = new Kitten({
            name: req.body.catName
        })

        await kitty.save()

        res.json({
            msg: "Cat created successfully",
            data: kitty
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

//  READ 
app.get("/api/cats", async (req, res) => {
    try {
        const cats = await Kitten.find()
        res.json(cats)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// ✅ READ ONE (GET by ID)
app.get("/api/cats/:id", async (req, res) => {
    try {
        const cat = await Kitten.findById(req.params.id)
        res.json(cat)
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// UPDATE 
app.put("/api/cats/:id", async (req, res) => {
    try {
        const updatedCat = await Kitten.findByIdAndUpdate(
            req.params.id,
            { name: req.body.catName },
            { new: true }
        )

        res.json({
            msg: "Cat updated",
            data: updatedCat
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// DELETE

app.delete("/api/cats/:id", async (req, res) => {
    try {
        await Kitten.findByIdAndDelete(req.params.id)

        res.json({
            msg: "Cat deleted successfully"
        })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
})

// SERVER STATUS
app.get("/api/server/status", (req, res) => {
    res.json({ msg: "Server is up and ready" })
})

app.listen(PORT, () => {
    console.log("API is listening on Port:", PORT)
})