import React from "react";

const Header = ({Logout, user}) => {
    //console.log(user);
  return (
    <header>
            <button onClick={Logout}>Log out</button>
            <h1>{user.username}</h1>
            
        
    </header>
  );
};


export default Header;
