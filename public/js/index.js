const socket = io();

socket.on('connect', () => {
    console.log('Connected to server');

    socket.emit('createMessage', {
        to: 'jen@example.com',
        text: 'Hey. This is Augustas.'
    });
});

socket.on('disconnect', () => {
    console.log('Disconnected from server');
});

socket.on('newMessage', (email) => {
    console.log('New message', email);
});