import * as PropTypes from "prop-types";
import React from "react";
import classNames from "classnames";

export function OrderCard(props) {
  const statusList = [
    "placed",
    "cancelled",
    "processing",
    "in_route",
    "delivered",
    "received"
  ];
  const actions = {
    user: [
      "cancelled",
      "received"
    ],
    owner: [
      "processing",
      "in_route",
      "delivered"
    ]
  };

  const { _meals, _restaurant, status, total_amount } = props.order;
  
  let nextStatus = "";
  if(props.role === 'user') {
    (status === statusList[4]) ?  nextStatus = statusList[5] : nextStatus = (status === statusList[5]) ? "" : statusList[1];
  }
  if(props.role === 'owner') {
    switch (status) {
      case statusList[0]:
        nextStatus = statusList[2]
        break;
      case statusList[2]:
        nextStatus = statusList[3]
        break;
      case statusList[3]:
        nextStatus = statusList[4]
        break;
      default:
        nextStatus = ""
        break;
    }
  }
  const btnClass = classNames({
    btn: true,
    'darken-4': true,
    'disabled': actions[props.role] && actions[props.role].indexOf(nextStatus) === -1,
    'red': nextStatus === "cancelled",
    'blue': nextStatus !== "cancelled"
  });
  return (
    <div className="col s4 m4">
      <div className="card blue-grey darken-1">
        <div className="card-content white-text">
          <span className="card-title">{_restaurant.name} {props.role}</span>
          <p>{_restaurant.description}</p>
        </div>
        <div class="card-content">
          {_meals.map((meal, i) => (<p key={i}><a>{meal.name}</a></p>))}
          <p></p>
        </div>
        <div className="card-action" style={{ fontWeight: 700 }}>
            <a>Total amt: {total_amount}</a>
            <a>Status: {status}</a>
          </div>
        <div className="card-panel teal darken-1">
          {(nextStatus && status !== "cancelled") && (<button className={btnClass} style={{marginRight: "20px"}} onClick={() => props.onStatusChange(nextStatus)}>{nextStatus}</button>)}
          <button data-target="modal1" className="btn modal-trigger blue" style={{marginLeft: "20px"}} onClick={()=> props.setCurrentModelData(props.order)}>Order History</button>

        </div>
      </div>
    </div>
  );
}

OrderCard.propTypes = { order: PropTypes.any };
