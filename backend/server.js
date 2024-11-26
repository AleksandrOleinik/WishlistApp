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
    user_id: { type: String, required: true },
    name: { type: String, required: true },
    items: { type: Array, required: false },
    wishlist_id: { type: String, required: true },
    link: { type: String, required: false },
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


app.post('/wishlist', async (req, res) => {
    console.log('Received request for POST/wishlist');
    console.log(req.body);
    const wishlist = new Wishlist({
        user_id: req.body.user_id,
        name: req.body.name,
        wishlist_id: String(req.body.wishlist_id),
        
    });
    try {
        console.log((wishlist));
        const newWishlist = await wishlist.save();
        res.status(201).json(newWishlist);
    } catch (error) {
        console.error('Error creating wishlist:', error.message, error);
        res.status(400).json({ error: error.message });
    }
});


app.delete('/wishlist/:wishlist_id', async (req, res) => {
    console.log(`Received request to DELETE /wishlist/${req.params.wishlist_id}`);
    const { wishlist_id } = req.params;

    try {
        // Assuming you have a Mongoose model `Wishlist`
        const deletedWishlist = await Wishlist.findOneAndDelete({ wishlist_id });

        if (!deletedWishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        res.status(200).json({ message: 'Wishlist deleted successfully', deletedWishlist });
    } catch (error) {
        console.error('Error deleting wishlist:', error.message, error);
        res.status(500).json({ error: 'Failed to delete wishlist' });
    }
});


app.put('/wishlist/:wishlist_id', async (req, res) => {
    console.log(`Received request to PUT /wishlist/${req.params.wishlist_id}`);
    const { wishlist_id } = req.params; // Extract the wishlist ID from the URL
    const { name, items, link } = req.body; // Extract fields to update from the request body

    try {
        // Find and update the wishlist by its ID
        const updatedWishlist = await Wishlist.findOneAndUpdate(
            { wishlist_id }, // Find wishlist by ID
            { name, items, link }, // Update these fields (undefined fields won't be updated)
            { new: true } // Return the updated document
        );

        if (!updatedWishlist) {
            return res.status(404).json({ error: 'Wishlist not found' });
        }

        res.status(200).json({ message: 'Wishlist updated successfully', updatedWishlist });
    } catch (error) {
        console.error('Error updating wishlist:', error.message, error);
        res.status(500).json({ error: 'Failed to update wishlist' });
    }
});



const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});