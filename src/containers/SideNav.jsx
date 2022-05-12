import React from 'react';
import { Link } from 'react-router-dom';
import HasRole from '../hoc/HasRole';
import axios from 'axios';
import Cookie from 'js-cookie';
import { logout } from '../api/services/User'
export default class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      active: 'stats',
      user: this.props.user
    }
  }
  componentDidMount() {

  }

  async logout() {
    let result = await logout();
    if (result && result.message === "User Logged Out") {
      localStorage.removeItem('user');
      Cookie.remove('token');
      this.props.history.push("/login");
    }
  }

  render() {
    return (
      <div className="col-sm-3 col-md-2 sidebar">
        <h1 className='sideNavHeading text-center'>Entities</h1>
        <ul className="nav nav-sidebar">
            <Link onClick={() => {this.setState({active:'stats'})}} to="/">
              <li className={`side_nav ${this.state.active == 'stats' ? 'active' : ''}`}>Stats</li>
            </Link>
            <Link onClick={() => {this.setState({active:'categories'})}} to="/categories">
              <li className={`side_nav ${this.state.active == 'categories' ? 'categories' : ''}`}>Categories</li>
            </Link>
            <Link onClick={() => {this.setState({active:'users'})}} to="/users">
              <li className={`side_nav ${this.state.active == 'users' ? 'active' : ''}`}>Users</li>
            </Link>
            <Link onClick={() => {this.setState({active:'special-offers'})}} to="/special_offers">
              <li className={`side_nav ${this.state.active == 'special-offers' ? 'active' : ''}`}>Special Offers</li>
            </Link>
            <Link onClick={() => {this.setState({active:'popular'})}} to="/popular">
              <li className={`side_nav ${this.state.active == 'popular' ? 'active' : ''}`}>Popular</li>
            </Link>
            <Link onClick={() => {this.setState({active:'orders'})}} to="/orders">
              <li className={`side_nav ${this.state.active == 'orders' ? 'active' : ''}`}>Orders</li>
            </Link>
            <Link onClick={() => {this.setState({active:'cover_banner'})}} to="/cover_banner">
              <li className={`side_nav ${this.state.active == 'cover_banner' ? 'active' : ''}`}>Gallery</li>
            </Link>
            <Link onClick={() => {this.setState({active:'items'})}} to="/items">
              <li className={`side_nav ${this.state.active == 'items' ? 'active' : ''}`}>Items</li>
            </Link>
        </ul>
        <div className='text-center' style={{'position':'absolute',}}>
          <span style={{'paddingTop':'3px'}} className="pull-left glyphicon glyphicon-off" aria-hidden="true" onClick={() => this.deleteDeveloper(developer.id, index)}></span>
          <p style={{'paddingLeft': '10px'}} className='pull-left'>
            <span onClick={this.logout} style={{cursor: 'pointer', textDecoration: 'underline'}}>Log Out</span>
          </p>
        </div>
      </div>
    );
  }
}
