import React, { Component } from "react";
import axios from "axios";
import get from "lodash/get";

import { Loader } from "../Loader";
import { OrderCard } from "./OrderCard";
import { cloneDeep } from "lodash";
import { connect } from 'react-redux';

class Orders extends Component {
  state = { orders: [], loading: false, currentModelData: null };

  get restaurantId() {
    return get(this.props.match, "params.id");
  }
  async componentDidMount() {
    try {
      this.setState({ loading: true });
      const reqUrl = this.restaurantId ? "/orders/restaurant/" +this.restaurantId : "/orders";
      const response = await axios("/api"+reqUrl);
      this.setState({ orders: response.data, loading: false });
    } catch (e) {
      console.error(e);
      this.setState({ loading: false });
    }
  }

  onOrderStatusChange = async (orderId, status, index) => {
    try {
      const response = await axios.put(`/api/orders/${orderId}`, { status });
      const orders = cloneDeep(this.state.orders);
      orders[index] = response.data;
      this.setState({ orders });
    } catch (e) {
      console.error(e);
    }
  };

  render() {
    const { loading, orders, currentModelData } = this.state;

    if (orders.length === 0 && !loading)
      return <div className="center">No Orders Found.</div>;

    return (
      <div className="container" style={{ width: "100%" }}>
        <div className="row">
          <div className="landing-copy col s12 center-align">
            {loading ? (
              <Loader />
            ) : (
              <div className="row">
                {orders.map((rest, index) => (
                  <OrderCard
                    key={rest._id}
                    order={rest}
                    role={this.props.user.role}
                    onStatusChange={status =>
                      this.onOrderStatusChange(rest._id, status, index)
                    }
                    setCurrentModelData={data => this.setState({currentModelData: data}) }
                  />
                ))}

                  
              </div>
            )}
          </div>
        </div>
        <div id="modal1" className="modal">
          <div className="modal-content">
            <h4>Order History</h4>
              <ul>
                {(currentModelData && currentModelData.status_history && currentModelData.status_history.length > 0) && currentModelData.status_history.map((history, i) => (<li key={i}> {history.date} - {history.status}</li>))}
              </ul>
          </div>
          <div className="modal-footer">
            <a href="#!" className="modal-close waves-effect waves-green btn-flat" onClick={()=> this.setState({currentModelData: null})}>Close</a>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {})(Orders);
