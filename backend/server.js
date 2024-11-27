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
    price: Number,
    wishlist_id: String,
    user_id: String,
    description: String,
    photo: String,
    link_shop: String
});

const Item = mongoose.model('Item', ItemSchema);

app.get('/items', async (req, res) => {
    try {
        const { wishlist_id } = req.query; // Get the wishlist_id from query params
        const query = wishlist_id ? { wishlist_id } : {}; // Filter by wishlist_id if provided
        const items = await Item.find(query);
        res.json(items);
    } catch (error) {
        res.status(500).send('Error retrieving items');
    }
});

app.post('/items', async (req, res) => {
    console.log('Received POST request:', req.body)
    const { description, link_shop, name, photo, price, user_id, wishlist_id} = req.body;

    // Validate required fields
    if (!name || !price || !wishlist_id || !user_id) {
        return res.status(400).json({ error: 'Missing required fields: name, price, wishlist_id, or user_id' });
    }

    const newItem = new Item({
        name,
        price,
        wishlist_id,
        user_id,
        description,
        photo,
        link_shop
    });

    try {
        const savedItem = await newItem.save();
        res.status(201).json({ message: 'Item created successfully', item: savedItem });
    } catch (error) {
        console.error('Error creating item:', error);
        res.status(500).json({ error: 'Failed to create item' });
    }
});

app.delete('/items/:item_id', async (req, res) => {
    const { item_id } = req.params;
    try {
        const deletedItem = await Item.findByIdAndDelete(item_id);
        if (!deletedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item deleted successfully', deletedItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete item' });
    }
});

const WishlistSchema = new mongoose.Schema({
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    items: { type: Array, required: false },
    wishlist_id: { type: String, required: true },
    link: { type: String, required: false }
});

const Wishlist = mongoose.model('Wishlist', WishlistSchema);

app.get('/wishlists', async (req, res) => {
    try {
        const wishlists = await Wishlist.find({});
        res.json(wishlists);
    } catch (error) {
        res.status(500).send('Error retrieving wishlists');
    }
});

app.post('/wishlist', async (req, res) => {
    const wishlist = new Wishlist({
        user_id: req.body.user_id,
        name: req.body.name,
        wishlist_id: String(req.body.wishlist_id),
    });
    try {
        const newWishlist = await wishlist.save();
        res.status(201).json(newWishlist);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: error.message });
    }
});

app.delete('/wishlist/:wishlist_id', async (req, res) => {
    const { wishlist_id } = req.params;
    try {
        const deletedWishlist = await Wishlist.findOneAndDelete({ wishlist_id });
        if (!deletedWishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }
        res.status(200).json({ message: 'Wishlist deleted successfully', deletedWishlist });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete wishlist' });
    }
});

app.put('/wishlist/:wishlist_id', async (req, res) => {
    const { wishlist_id } = req.params;
    const { name, items, link } = req.body;
    try {
        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { wishlist_id },
            { name, items, link },
            { new: true }
        );
        if (!updatedWishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }
        res.status(200).json({ message: 'Wishlist updated successfully', updatedWishlist });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update wishlist' });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
