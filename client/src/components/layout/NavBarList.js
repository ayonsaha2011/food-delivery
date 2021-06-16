import { Link } from "react-router-dom";
import * as PropTypes from "prop-types";
import React from "react";

export function NavBarList(props) {
  const isOwner = props.user.role === 'owner';
  return (
    <React.Fragment>
      {isOwner && (<li>
        <Link to="/restaurants/create">Create Restaurants And Meals</Link>
      </li>)}

      <li>
        <Link to="/restaurants">{isOwner ? 'My' : 'All'} Restaurants</Link>
      </li>
      {!isOwner && (<li>
        <Link to="/orders">Orders</Link>
      </li>)}
      <li>
        <b>Hey there,</b> {(props.user.name || "").split(" ")[0]}
      </li>
      <li>
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
        <a onClick={props.onClick}>Logout</a>
      </li>
    </React.Fragment>
  );
}

NavBarList.propTypes = {
  user: PropTypes.any,
  onClick: PropTypes.func
};
