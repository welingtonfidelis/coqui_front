import { io } from "socket.io-client";
import { LOCAL_STORAGE_ENUM } from "../components/enums/localStorage";

const socket = {
  connect(query: any = {}) {
    const url = process.env.SOCKET_HOST;
    
    return io(url, {
      auth: { token: localStorage.getItem(LOCAL_STORAGE_ENUM.TOKEN) },
      query,
    })
  }
}

export { socket };
