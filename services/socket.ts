import { io } from "socket.io-client";

const socket = {
  connect(token: string, query: any = {}) {
    const url = process.env.SOCKET_HOST;
    
    return io(url, {
      auth: { token },
      query,
    })
  }
}

export { socket };
