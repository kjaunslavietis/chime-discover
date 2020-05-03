import { DropdownButton } from 'react-bootstrap';
import React from 'react';

import './InputDevices.scss';

class InputDevices extends React.Component {
    constructor(props) {
        super(props);

    }

    handleClick(id) {
        console.log(`You selected: ${id}`);

    }

    render() {
        //TODO
        // let inputDevices = this.props.devices.map((item, key) =>
        //     <Dropdown.Item href="#/action-1"></Dropdown.Item>

        // );

        // return (
        //     <DropdownButton id="dropdown-basic-button" title="Audio output">
        //         {inputDevices}
        //     </DropdownButton>
        // );
        return null;
    }
  }

  export default InputDevices;