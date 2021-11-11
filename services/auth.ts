import { EventEmitter } from "events";
import Router from "next/router";

let eventEmitter: EventEmitter = null;

export const startEventEmitter = (emitter: EventEmitter) => {
  eventEmitter = emitter;
};

interface HandleUnauthorizedInterface {
  statusCode: number;
}

export const handleUnauthorized = (props: HandleUnauthorizedInterface) => {
  if (props.statusCode && props.statusCode === 401) {
    if(!eventEmitter) {
      Router.replace("/");

      return "Token inválido ou expirado. Por favor, faça o login novamente.";
    }

    eventEmitter.emit("refresh_token_modal:open");

    return "Token expirado, por favor, faça o login novamente."
  }
};
