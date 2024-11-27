import React from 'react';

const Item = (props, refreshItems, activeWishlistId) => {

    const deleteItem = async () => {
        try {
            const response = await fetch(`http://localhost:3001/items/${props.id}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete item');

        } catch (error) {
            console.error('Error deleting item:', error.message);
        }
    };

    return (
        <div className="wishlist-item">
            <h4 className="item-title">{props.name}</h4>
            <p className="item-price">Price: ${props.price}</p>
            <p className="item-description">Description: {props.description}</p>
            <p className="item-user-id">User ID: {props.user_id}</p>
            <p className="item-wishlist-id">Wishlist ID: {props.wishlist_id}</p>
            <img src={props.image_link} alt="item_image" />
            <div className="item-actions">
                <button className="action-btn" onClick={()=>{deleteItem();
                                                            props.refreshItems(props.activeWishlistId);}}>🚫</button>
                <button className="action-btn">🔗</button>
                <button className="action-btn">✏️</button>
            </div>
        </div>
    );
};

export default Item;