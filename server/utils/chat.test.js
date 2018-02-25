const expect = require("expect");
const Chat = require("./chat").Chat;

describe('Chat', () => {
    let chat;

    beforeEach(() => {
        chat = new Chat();
        chat.users = [{
            id: '1',
            name: 'Mike',
            room: 'Node Course'
        }, {
            id: '2',
            name: 'Jen',
            room: 'React Course'
        }, {
            id: '3',
            name: 'Julie',
            room: 'Node Course'
        }];
    });

    it('should add new user', () => {
        const chat = new Chat();
        const user = {
            id: '123',
            name: 'Augustas',
            room: 'The Office Fans'
        };
        const resUser = chat.addUser(user.id, user.name, user.room);

        expect(chat.users).toEqual([user]);
    });

    it('should remove a user', () => {
        chat.removeUser('1');
        expect(chat.users.length).toBe(2);
    });

    it('should not remove a user', () => {
        chat.removeUser('999');
        expect(chat.users.length).toBe(3);
    });

    it('should find a user', () => {
        const user = chat.getUser('1');
        expect(user).toEqual(chat.users[0]);
    });

    it('should not find a user', () => {
        const user = chat.getUser('-1');
        expect(user).toBeFalsy();
    });

    it('should return correct names for same room', () => {
        const nodeUserList = chat.getUserList('Node Course');
        expect(nodeUserList).toEqual(['Mike', 'Julie']);

        const reactUserList = chat.getUserList('React Course');
        expect(reactUserList).toEqual(['Jen']);
    });
});