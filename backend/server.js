const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/wishlistApp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('Error connecting to MongoDB', error));

const ItemSchema = new mongoose.Schema({
    name: String,
    quantity: Number,
    price: Number
});

const Item = mongoose.model('Item', ItemSchema);

app.get('/items', async (req, res) => {
    try {
        const items = await Item.find({});
        res.json(items);
    } catch (error) {
        res.status(500).send('Error retrieving items');
    }
});

const WishlistSchema = new mongoose.Schema({
    _id: String,
    user_id: String,
    name: String,
    items: Array,
    wishlist_id: String,
    link: String
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

app.get('/wishlists', async (req, res) => {
    try {
        const wishlists = await Wishlist.find({});
        res.json(wishlists);
    } catch (error) {
        res.status(500).send('Error retrieving items');
    }
});


app.listen(3001, () => {
    console.log('Server is running on port 3001');
});