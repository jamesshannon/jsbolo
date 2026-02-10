/**
 * Network protocol using JSON (Phase 2)
 * TODO: Optimize with Protocol Buffers in Phase 4
 */
// Encoding/Decoding helpers
export function encodeClientMessage(message) {
    return JSON.stringify(message);
}
export function decodeClientMessage(data) {
    return JSON.parse(data);
}
export function encodeServerMessage(message) {
    return JSON.stringify(message);
}
export function decodeServerMessage(data) {
    return JSON.parse(data);
}
//# sourceMappingURL=network-protocol.js.map