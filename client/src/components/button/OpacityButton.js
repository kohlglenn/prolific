import React, { Component } from "react";


class OpacityButton extends Component {
    state ={
        hovered: false
    };

    componentDidMount() {
    }

render() {

return (
        <div 
        className={`${this.state.hovered ? 'opacity-50' : 'opacity-100'} inline-block`}
        onMouseEnter={(e) => this.setState({...this.state, hovered: true})}
        onMouseLeave={(e) => this.setState({...this.state, hovered: false})}>
            {this.props.children}
        </div>
    );
  }
}

export default OpacityButton;