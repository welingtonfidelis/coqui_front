import { EventEmitter } from "events";
import Router from "next/router";

let eventEmitter: EventEmitter = null;

export const startEventEmitter = (emitter: EventEmitter) => {
  eventEmitter = emitter;
};

export const handleUnauthorized = (statusCode: number) => {
  if (statusCode && statusCode === 401) {
    if (eventEmitter) {
      eventEmitter.emit("socket:disconnect", {});
    }

    Router.replace("/");

    return "Token inválido ou expirado. Por favor, faça o login novamente.";
  }
};
