import React from "react";

const Header = ({Logout, user,baseURL_view_deploy}) => {
    //console.log(user);
  return (
    <header>
            <button onClick={Logout}>Log out</button>
            {baseURL_view_deploy ? (
                <p>Share with a friend: {`${baseURL_view_deploy}/view/${user.user_id}`}</p>
              ) : ('')}
            <h1>{user.username}</h1>
            
        
    </header>
  );
};


export default Header;
