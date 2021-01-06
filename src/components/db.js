const sampleChatRooms = [
    {   name: "room 1", 
        id: 1,
        date: new Date('2019-01-01T01:01:01'),
        lastMessageText: "Last message sent was this message and I want to make it very long",
        lastMessageSender: "A test sender",
        read: false
    },
    {   name: "room 2", 
        id: 212312,
        date: new Date('2020-02-02T02:02:02'),
        lastMessageText: "Short Message",
        lastMessageSender: "Short sender",
        read: false
    },
    {   name: "room 2", 
        id: 212312,
        date: new Date('2021-01-01T02:02:02'),
        lastMessageText: "Short Message",
        lastMessageSender: "Short sender",
        read: false
    },
    {   name: "room 2", 
        id: 212312,
        date: new Date('2020-02-02T02:02:02'),
        lastMessageText: "Short Message",
        lastMessageSender: "Short sender",
        read: false
    },
    {   name: "room 2", 
        id: 212312,
        date: new Date('2020-02-02T02:02:02'),
        lastMessageText: "Short Message",
        lastMessageSender: "Short sender",
        read: false
    },
    {   name: "room 2", 
        id: 212312,
        date: new Date('2020-02-02T02:02:02'),
        lastMessageText: "Short Message",
        lastMessageSender: "Short sender",
        read: false
    },
    {   name: "room 2", 
        id: 212312,
        date: new Date('2020-02-02T02:02:02'),
        lastMessageText: "Short Message",
        lastMessageSender: "Short sender",
        read: false
    },
    {   name: "room 2", 
        id: 212312,
        date: new Date('2020-02-02T02:02:02'),
        lastMessageText: "Short Message",
        lastMessageSender: "Short sender",
        read: false
    },
    {   name: "room 2", 
        id: 212312,
        date: new Date('2020-02-02T02:02:02'),
        lastMessageText: "Short Message",
        lastMessageSender: "Short sender",
        read: false
    }
]

const sampleChatContents = [
    {
        name: "room 1",
        date: new Date('2019-01-01T01:01:01'),
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
    },
    {
        name: "room 2",
        date: new Date('2021-01-01T02:02:02'),
        messages: [
            {
                sender: "send1",
                body: "room 2 test message 1",
            },
            {
                sender: "send2",
                body: "room 2 test message 2",
            },
        ]
    },
    {
        name: "room 2",
        date: new Date('2020-02-02T02:02:02'),
        messages: [
        ]
    },
    {
        name: "room 2",
        date: new Date('2020-02-02T02:02:02'),
        messages: [
        ]
    },
    {
        name: "room 2",
        date: new Date('2020-02-02T02:02:02'),
        messages: [
        ]
    },
    {
        name: "room 2",
        date: new Date('2020-02-02T02:02:02'),
        messages: [
        ]
    },
    {
        name: "room 2",
        date: new Date('2020-02-02T02:02:02'),
        messages: [
        ]
    },
    {
        name: "room 2",
        date: new Date('2020-02-02T02:02:02'),
        messages: [
        ]
    },
    {
        name: "room 2",
        date: new Date('2020-02-02T02:02:02'),
        messages: [
        ]
    },
    {
        name: "room 2",
        date: new Date('2020-02-02T02:02:02'),
        messages: [
        ]
    },

]

const db = {
    sampleChatRooms,
    sampleChatContents
}


export { db as default }
