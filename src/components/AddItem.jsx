import React, { useState } from 'react';
import axios from 'axios';

const AddItem = ({ user_id, activeWishlistId, refreshItems }) => {
    const baseURL_deploy ="https://wishlistapp-backend.onrender.com"
    const baseURL_deploy2 = "http://localhost:3001"
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
    
            const response = await axios.post(`${baseURL_deploy}/items`, newItem);
            console.log('Item added:', response.data);
    
            setIsAdding(false);
            setFormData({ pwishlist_id: '',
                name: '',
                photo: '',
                price: '',
                description: '',
                user_id: '',
                link_shop: ''});
            refreshItems(activeWishlistId)//this is new line
        } catch (error) {
            console.error('Error adding item:', error);
        }
    };
    
    return (
        <div className="add_item">
            {!isAdding ? (
                <button onClick={() => setIsAdding(true)} className='add_item_btn'>Add Item</button>
            ) : (
                <form onSubmit={(e) => {
                    handleAddItem(e);
                    refreshItems(activeWishlistId);
                }} className="add_item_form">
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
                            maxLength={20}
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
                        <button type="submit"className='add_item_submit'>Submit</button>
                        <button type="button" onClick={() => setIsAdding(false)} className='add_item_cancel'>Cancel</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AddItem;
