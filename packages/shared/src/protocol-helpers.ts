/**
 * Helper functions for Protocol Buffer encoding/decoding
 */

import * as proto from './generated/protocol.js';

// Re-export the generated types
export {proto};

/**
 * Encode a client message to binary
 */
export function encodeClientMessage(message: proto.jsbolo.IClientMessage): Uint8Array {
  const msg = proto.jsbolo.ClientMessage.create(message);
  return proto.jsbolo.ClientMessage.encode(msg).finish();
}

/**
 * Decode a server message from binary
 */
export function decodeServerMessage(data: Uint8Array): proto.jsbolo.IServerMessage {
  return proto.jsbolo.ServerMessage.decode(data);
}

/**
 * Encode a server message to binary
 */
export function encodeServerMessage(message: proto.jsbolo.IServerMessage): Uint8Array {
  const msg = proto.jsbolo.ServerMessage.create(message);
  return proto.jsbolo.ServerMessage.encode(msg).finish();
}

/**
 * Decode a client message from binary
 */
export function decodeClientMessage(data: Uint8Array): proto.jsbolo.IClientMessage {
  return proto.jsbolo.ClientMessage.decode(data);
}
