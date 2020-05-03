class AttendeeService {
    constructor() {
        this.mockAttendees = [
            {
                id: "1",
                attendeeId: "1",
                attendeeName: "Karl"
            },
            {
                id: "2",
                attendeeId: "2",
                attendeeName: "Ben"
            },
            {
                id: "3",
                attendeeId: "3",
                attendeeName: "Kate"
            },
            {
                id: "4",
                attendeeId: "4",
                attendeeName: "Paula"
            },
            {
                id: "5",
                attendeeId: "5",
                attendeeName: "Sergio"
            },
            {
                id: "6",
                attendeeId: "6",
                attendeeName: "Douglas"
            },
            {
                id: "7",
                attendeeId: "7",
                attendeeName: "Priyesh"
            },
            {
                id: "8",
                attendeeId: "8",
                attendeeName: "Subodh"
            },
            {
                id: "9",
                attendeeId: "9",
                attendeeName: "Wei"
            },
            {
                id: "10",
                attendeeId: "10",
                attendeeName: "Priyanka"
            },
            {
                id: "11",
                attendeeId: "11",
                attendeeName: "Afanasenko"
            },
            {
                id: "12",
                attendeeId: "12",
                attendeeName: "Ahmed"
            },
          ]
    }

    getAttendeesForRoom(roomId) {
        this.shuffleArray(this.mockAttendees);
        let from = Math.floor((Math.random() * this.mockAttendees.length) + 0);
        let to = Math.floor((Math.random() * this.mockAttendees.length) + from);
        return this.mockAttendees.slice(from, to);
    }

    shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }
}

export default AttendeeService;
