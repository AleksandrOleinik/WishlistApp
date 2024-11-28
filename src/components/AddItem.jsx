import React, { useState } from 'react';
import axios from 'axios';

const AddItem = ({ user_id, activeWishlistId, refreshItems }) => {
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        wishlist_id: '',
        name: '',
        photo: '',
        price: '',
        description: '',
        user_id: '',
        link_shop: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleAddItem = async (e) => {
        e.preventDefault();
        
        // Ensure user_id and wishlist_id are correctly passed
        if (!user_id || !activeWishlistId) {
            console.error('Missing user_id or activeWishlistId');
            return;
        }
    
        try {
            const newItem = {
                ...formData,
                user_id,
                wishlist_id: activeWishlistId
            };
            console.log(user_id, activeWishlistId);
            console.log('New Item:', newItem);
    
            const response = await axios.post('http://localhost:3001/items', newItem);
            console.log('Item added:', response.data);
    
            setIsAdding(false);
            setFormData({ pwishlist_id: '',
                name: '',
                photo: '',
                price: '',
                description: '',
                user_id: '',
                link_shop: ''});
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };
    
    return (
        <div className="add-item">
            {!isAdding ? (
                <button onClick={() => setIsAdding(true)}>Add Item</button>
            ) : (
                <form onSubmit={(e) => {
                    handleAddItem(e);
                    refreshItems(activeWishlistId);
                }} className="add-item-form">
                    <label>
                        Picture Link:
                        <input
                            type="text"
                            name="photo"
                            value={formData.photo}
                            onChange={handleInputChange}
                            placeholder="Enter picture link"
                            required
                        />
                    </label>
                    <label>
                        Name:
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter item name"
                            required
                        />
                    </label>
                    <label>
                        Price:
                        <input
                            type="number"
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            placeholder="Enter item price"
                            required
                        />
                    </label>
                    <label>
                        Description:
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Enter item description"
                            required
                        />
                    </label>
                    <label>
                        Link To the Shop:
                        <textarea
                            name="link_shop"
                            value={formData.link_shop}
                            onChange={handleInputChange}
                            placeholder="Enter link to the shop"
                            required
                        />
                    </label>
                    <div>
                        <button type="submit">Submit</button>
                        <button type="button" onClick={() => setIsAdding(false)}>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddItem;
