import React, { useState } from 'react';

const Wishlist = ({ name, id, onDelete, onEdit, refreshItems,activeWishlistId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newName, setNewName] = useState(name);

    const handleEdit = () => {
        onEdit(id, newName);
        setIsEditing(false);
    };

    const handleSelectWishlist = () => {
        refreshItems(id);
    };
    const isActive = id === activeWishlistId;
    return (
        <div className={`wishlist ${isActive? 'active' : ''}`} onClick={handleSelectWishlist}>
            {!isEditing ? (
                <>
                    <button onClick={() => setIsEditing(true)}>Edit name</button>
                    <h3>{name}</h3>
                    <button onClick={() => onDelete(id)}>Delete</button>
                </>
            ) : (
                <>
                    <button onClick={handleEdit}>Save</button>
                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                    />
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </>
            )}
        </div>
    );
};

export default Wishlist;
