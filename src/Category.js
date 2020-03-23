import React from 'react';
import Switch from "react-switch";

class Category extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: this.props.checked
        };
    }

    handleChange() {
        this.props.onChange(this.props.category);
        console.log(this.props.checked);
        this.setState({checked: this.props.checked});
    }

    render() {
        return (
            <div>
            {this.props.category.name}
            <Switch 
            onChange={()=> this.handleChange()} 
            checked={this.state.checked} 
            />
            </div>
        )
    }
}
export default Category;