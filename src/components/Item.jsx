import React from 'react';

const Item = (props) => {
    return (
        <div className="wishlist-item">
            <h4 className="item-title">{props.name}</h4>
            <p className="item-price">Price: ${props.price}</p>
            <p className="item-description">Description: {props.description}</p>
            <p className="item-user-id">User ID: {props.user_id}</p>
            <p className="item-wishlist-id">Wishlist ID: {props.wishlist_id}</p>
            <img src={props.image_link} alt="item_image" />
            <div className="item-actions">
                <button className="action-btn">🔗</button>
                <button className="action-btn">✏️</button>
            </div>
        </div>
    );
};

export default Item;