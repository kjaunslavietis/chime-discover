import { DropdownButton } from 'react-bootstrap';
import React from 'react';

import './OutputDevices.scss';

class OutputDevices extends React.Component {
    constructor(props) {
        super(props);

    }

    handleClick(id) {
        console.log(`You selected: ${id}`);
    }

    render() {
        //TODO
        // let outputDevices = this.props.devices.map((item, key) =>
        //     <Dropdown.Item href="#/action-1"></Dropdown.Item>

        // );

        // return (
        //     <DropdownButton id="dropdown-basic-button" title="Audio output">
        //         {outputDevices}
        //     </DropdownButton>
        // );
        return null;
    }
  }

  export default OutputDevices;