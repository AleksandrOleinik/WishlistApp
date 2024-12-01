import React, { useState } from 'react';

const Item = (props) => {
    const [isEditing, setIsEditing] = useState(false);
    const baseURL_deploy ="https://wishlistapp-backend.onrender.com"
    const baseURL_deploy2 = "http://localhost:3001"
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
            const response = await fetch(`${baseURL_deploy}/items/${props.id}`, {
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
            const response = await fetch(`${baseURL_deploy}/items/${props.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedItem),
            });

            if (!response.ok) throw new Error('Failed to update item');
            props.refreshItems(props.activeWishlistId); 
            setIsEditing(false); 
        } catch (error) {
            console.error('Error updating item:', error.message);
        }
    };

    const openLink = () => {
        if (props.link_shop) {
            window.open(props.link_shop, '_blank'); 
        } else {
            alert('No link available');
        }
    };
    

    return (
        <div className="wishlist_item">
            {isEditing ? (
                <div className="edit-item">
                    <div className="form-group">
                        <label htmlFor="name">Item Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={updatedItem.name}
                            onChange={handleInputChange}
                            placeholder="Item Name"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="price">Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={updatedItem.price}
                            onChange={handleInputChange}
                            placeholder="Price"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={updatedItem.description}
                            onChange={handleInputChange}
                            placeholder="Description"
                            maxLength="44"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="photo">Image URL</label>
                        <input
                            type="text"
                            id="photo"
                            name="photo"
                            value={updatedItem.photo}
                            onChange={handleInputChange}
                            placeholder="Image URL"
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="link_shop">Link to the shop</label>
                        <input
                            type="text"
                            id="link_shop"
                            name="link_shop"
                            value={updatedItem.link_shop}
                            onChange={handleInputChange}
                            placeholder="Link to the shop"
                        />
                    </div>
                    <button onClick={updateItem} className='edit-item-save'>Save</button>
                    <button onClick={() => setIsEditing(false)} className='edit-item-cancel'>Cancel</button>
                </div>
            ) : (
                <>
                    <h4 className="item_title">{props.name}</h4>
                    {/*<p className="item-user-id">User ID: {props.user_id}</p>*/}
                    {/*<p className="item-wishlist-id">Wishlist ID: {props.wishlist_id}</p>*/}
                    <img src={props.image_link} alt="item_image" className='item_photo'/>
                    <p className="item_price">${props.price}</p>
                    {/*<p className="item_description">{props.description}</p>*/}
                    <div className="item_actions">
                        <button
                            className="action_btn"
                            onClick={() => {
                                deleteItem();
                            }}
                        >
                            🚫
                        </button>
                        <button className="action_btn" onClick={openLink}>🔗</button>
                        <button className="action_btn" onClick={() => setIsEditing(true)}>
                            ✏️
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Item;
