import React, { useState } from 'react';

const Item = (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedItem, setUpdatedItem] = useState({
        description: props.description,
        link_shop: props.link_shop,
        name: props.name,
        price: props.price,
        photo: props.image_link,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedItem((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const deleteItem = async () => {
        try {
            const response = await fetch(`http://localhost:3001/items/${props.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete item');
            props.refreshItems(props.activeWishlistId);
        } catch (error) {
            console.error('Error deleting item:', error.message);
        }
    };

    const updateItem = async () => {
        try {
            const response = await fetch(`http://localhost:3001/items/${props.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (!response.ok) throw new Error('Failed to update item');
            props.refreshItems(props.activeWishlistId); // Refresh items after update
            setIsEditing(false); // Exit editing mode
        } catch (error) {
            console.error('Error updating item:', error.message);
        }
    };

    const openLink = () => {
        if (props.link_shop) {
            window.open(props.link_shop, '_blank'); // Opens the link in a new tab
        } else {
            alert('No link available');
        }
    };
    

    return (
        <div className="wishlist-item">
            {isEditing ? (
                <div className="edit-item">
                    <input
                        type="text"
                        name="name"
                        value={updatedItem.name}
                        onChange={handleInputChange}
                        placeholder="Item Name"
                    />
                    <input
                        type="number"
                        name="price"
                        value={updatedItem.price}
                        onChange={handleInputChange}
                        placeholder="Price"
                    />
                    <textarea
                        name="description"
                        value={updatedItem.description}
                        onChange={handleInputChange}
                        placeholder="Description"
                    />
                    <input
                        type="text"
                        name="photo"
                        value={updatedItem.photo}
                        onChange={handleInputChange}
                        placeholder="Image URL"
                    />
                    <input
                        type="text"
                        name="link_shop"
                        value={updatedItem.link_shop}
                        onChange={handleInputChange}
                        placeholder="Link to the shop"
                    />
                    <button onClick={updateItem}>Save</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
            ) : (
                <>
                    <h4 className="item-title">{props.name}</h4>
                    <p className="item-price">Price: ${props.price}</p>
                    <p className="item-description">Description: {props.description}</p>
                    <p className="item-user-id">User ID: {props.user_id}</p>
                    <p className="item-wishlist-id">Wishlist ID: {props.wishlist_id}</p>
                    <img src={props.image_link} alt="item_image" />
                    <div className="item-actions">
                        <button
                            className="action-btn"
                            onClick={() => {
                                deleteItem();
                            }}
                        >
                            🚫
                        </button>
                        <button className="action-btn" onClick={openLink}>🔗</button>
                        <button className="action-btn" onClick={() => setIsEditing(true)}>
                            ✏️
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Item;
