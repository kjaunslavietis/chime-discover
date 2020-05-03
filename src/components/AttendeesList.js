import React from 'react';
import { ListGroup  } from 'react-bootstrap';

class AttendeesList extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {
        let attendeesListCard = this.props.attendeesList.map((item, key) =>
            <ListGroup.Item>
                {item.name}
            </ListGroup.Item>
        );

        return (
            <ListGroup className="attendees-list" variant="flush">
                {attendeesListCard}
            </ListGroup>
        );
    }
}

export default AttendeesList;