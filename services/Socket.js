import io from 'socket.io';
import { v4 as uuidV4 } from 'uuid';
import JWT from 'jsonwebtoken';
import { Users } from '../models';

const { JWT_SECRET } = process.env;

class Socket {
  static users = new Set();

  static init(server) {
    this.socket = io(server, {
      cors: {
        origin: '*',
      },
    });
    this.socket.on('connect', this.handleConnect);
  }

  static handleConnect = (client) => {
    try {
      const { authorization = '' } = client.handshake.headers;
      const { userId } = JWT.verify(authorization.replace('Bearer ', ''), JWT_SECRET);
      client.join(`user_${userId}`);

      this.users.add(userId);
      this.socket.emit('userConnect', {
        users: [...this.users],
      });

      client.on('typing', (data) => {
        const { friendId } = data;
        this.emitUser(friendId, 'typing', { friendId: userId });
      });

      client.on('disconnect', async () => {
        this.users.delete(userId);
        this.socket.emit('userConnect', {
          users: [...this.users],
        });
        await Users.update({
          lastLogin: new Date(),
        }, {
          where: { id: userId },
        });
      });
    } catch (e) {

    }
  };

  static handleSendMessage = (client) => (data) => {
    const user = client.handshake.headers['x-user'];

    const { friend } = data;

    this.socket.to(`user_${friend}`).emit('newMessage', {
      ...data,
      user,
      id: uuidV4(),
      createAt: new Date(),
    });
    client.emit('newMessage', {
      ...data,
      user,
      id: uuidV4(),
      createAt: new Date(),
    });
  };

  static emitUser(user, event, data = {}) {
    this.socket.to(`user_${user}`).emit(event, data);
  }
}

export default Socket;
