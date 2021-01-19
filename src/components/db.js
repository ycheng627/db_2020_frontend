const sampleChatRooms = [
    {   name: "room 1", 
        id: "room 1",
        last_send_date: new Date('2019-01-01T01:01:01'),
        last_read_date: new Date('2018-01-01T01:01:01'),
        last_message: "Last message sent was this message and I want to make it very long",
        last_sender: "A test sender",
        read: false
    },
    {   name: "room 2", 
        id: "room 2",
        last_send_date: new Date('2020-02-02T02:02:02'),
        last_read_date: new Date('2019-01-01T01:01:01'),
        last_message: "Short Message",
        last_sender: "Short sender",
        read: false
    }
]

const sampleChatContents = [
    {
        name: "room 1",
        id: "room 1",
        emoji: 0,
        date: new Date('2019-01-01T01:01:01'),
        people: ["test1", "test2", "test3", "test4"],
        messages: [
            {
                sender: "send1",
                body: "test message 1 is much much much much much much much much much much much much much much much much much much much much much much much much much much much longer",
            },
            {
                sender: "send2",
                body: "test message s is much much much much much much much much much much much much much much much much much much much much much much much much much much much longer",
            },
            {
                sender: "send3",
                body: "test message 3",
            },
            {
                sender: "send4",
                body: "test message 4",
            },
            {
                sender: "send5",
                body: "test message 5",
            },{
                sender: "send1",
                body: "test message 1 is much much much much much much much much much much much much much much much much much much much much much much much much much much much longer",
            },
            {
                sender: "send2",
                body: "test message s is much much much much much much much much much much much much much much much much much much much much much much much much much much much longer",
            },
            {
                sender: "send3",
                body: "test message 3",
            },
            {
                sender: "send4",
                body: "test message 4",
            },
            {
                sender: "send5",
                body: "test message 5",
            },{
                sender: "send1",
                body: "test message 1 is much much much much much much much much much much much much much much much much much much much much much much much much much much much longer",
            },
            {
                sender: "send2",
                body: "test message s is much much much much much much much much much much much much much much much much much much much much much much much much much much much longer",
            },
            {
                sender: "send3",
                body: "test message 3",
            },
            {
                sender: "send4",
                body: "test message 4",
            },
            {
                sender: "send5",
                body: "test message 5",
            }
        ]
    },
    {
        name: "room 2",
        date: new Date('2020-02-02T02:02:02'),
        id: "room 2",
        emoji: 1,
        people: ["test1", "test2", "test3", "test4"],
        messages: [
            {
                sender: "send1",
                body: "room 2 test message 1",
            },
            {
                sender: "send2",
                body: "room 2 test message 2",
            },
            {
                sender: "send3",
                body: "room 2 test message 3",
            },
            {
                sender: "send4",
                body: "room 2 test message 4",
            },
            {
                sender: "send5",
                body: "test message 5",
            }
        ]
    }
]

const db = {
    sampleChatRooms,
    sampleChatContents
}


export { db as default }
