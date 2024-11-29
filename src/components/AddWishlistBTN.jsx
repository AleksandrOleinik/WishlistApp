import React,{useState} from "react";


const AddWishlistBTN = ({user_id, onFormSubmit}) => { 

    const [isEditing, setIsEditing] = useState(false);
    const [inputText, setInputText] = useState("Add");
    const generateUniqueId = () => {
        return `${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setIsEditing(false);

        const newWishlist = {
            user_id: user_id,
            name: inputText,
            wishlist_id: generateUniqueId(),
        };

        try {
            const response = await fetch('http://localhost:3001/wishlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newWishlist),
            });

            if (!response.ok) {
                throw new Error('Failed to create wishlist');
            }

            const result = await response.json();
            console.log('Wishlist created successfully:', result);

            setInputText("Add");
            onFormSubmit(); // Notify parent or refresh wishlists
        } catch (error) {
            console.error('Error creating wishlist:', error.message);
        }
    };

    const handleInputChange = (e) => {
        setInputText(e.target.value);
    };

    return (
        !isEditing ? (
        <button className="wishlist_add_button" onClick={() => setIsEditing(true)}>
            {inputText}
        </button>
    ) : (
        <form onSubmit={handleFormSubmit} className="wishlist_form">
            <input
                type="text"
                onChange={handleInputChange}
                placeholder="Wishlist name"
                autoFocus
                className="wishlist_input"
            />
            <button type="submit" className="wishlist-ok-button">
                OK
            </button>
        </form>
    )
    );
  };




export default AddWishlistBTN;