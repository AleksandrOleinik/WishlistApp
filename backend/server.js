const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const MongoDB_connection_string = "mongodb+srv://oleinikas20:X7XCZhf4UEpn708R@cluster0.mvhd9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const app = express();
app.use(cors());
app.use(express.json());


//mongoose.connect('mongodb://localhost:27017/wishlistApp', {
    mongoose.connect('mongodb+srv://oleinikas20:X7XCZhf4UEpn708R@cluster0.mvhd9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((error) => console.log('Error connecting to MongoDB', error));


const UserSchema = new mongoose.Schema({
        username:String,
        passwordHash:String,
        name:String,
        wishlists:Array,
        user_id:String
    });
    
const User = mongoose.model('User', UserSchema);
    

const bcrypt = require('bcrypt');




app.post('/view/:user_id', async (req, res) => {
    console.log('Received GET request:', req.params);
    const { user_id } = req.params;

    try {
        // Fetch user by user_id
        const user = await User.findOne({ user_id });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Fetch wishlists assigned to the user
        const wishlists = await Wishlist.find({ user_id });

        res.status(200).json({
            message: 'User information retrieved successfully',
            user: {
                username: user.username,
                name: user.name,
                user_id: user.user_id,
            },
            wishlists,
        });
    } catch (error) {
        console.error('Error fetching user or wishlists:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});






app.post('/signup', async (req, res) => {
    const { username, password, name } = req.body;
    console.log("Received POST request for signup:", req.body);
    if (!username || !password || !name) {
        return res.status(400).json({ error: 'Missing required fields: username, password, or name' });
    }

    try {
        const existingUser = await User.findOne({ name });
        console.log("Existing user:", existingUser);
        if (existingUser) {
            return res.status(400).json({ error: 'Email already taken' });
        }
        const passwordHash = await bcrypt.hash(password, 10);

        const userCount = await User.countDocuments();
        const user_id = String(userCount + 1);

        const newUser = new User({ username, passwordHash, name, user_id });
        const savedUser = await newUser.save();
        console.log(res)
        res.status(201).json({ message: 'User created successfully', user_id: savedUser.user_id });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Failed to create user' });
    }
});


app.post('/login', async (req, res) => {
    console.log('Received POST request for login:', req.body);
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({ error: 'Missing required fields: username or password' });
    }

    try {

        const user = await User.findOne({ name });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }


        const passwordMatch = await bcrypt.compare(password, user.passwordHash);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.status(200).json(user);

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to login' });
    }
});



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
        const { wishlist_id, user_id } = req.query; 
        const query = { 
            ...(wishlist_id && { wishlist_id }), 
            ...(user_id && { user_id }),       
        };

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

app.put('/items/:item_id', async (req, res) => {
    console.log('Received PUT request:', req.body);
    const { item_id } = req.params;
    const { description, link_shop, name, price, photo } = req.body;

    try {
        const updatedItem = await Item.findByIdAndUpdate(
            item_id,
            { description, link_shop, name, price, photo},
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ error: 'Item not found' });
        }
        res.status(200).json({ message: 'Item updated successfully', updatedItem });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update item' });
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
    const { user_id } = req.query; // Extract user_id from query parameters
    try {
        // Find wishlists for the specific user
        const wishlists = await Wishlist.find({ user_id: user_id });
        res.json(wishlists);
    } catch (error) {
        res.status(500).send('Error retrieving wishlists');
    }
});


app.post('/wishlist', async (req, res) => {
    console.log('Received POST request:', req.body);
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
