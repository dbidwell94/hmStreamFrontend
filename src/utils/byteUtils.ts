export function base64ToUint8(input: string): Uint8Array {
    return  Uint8Array.from(atob(input), c => c.charCodeAt(0));
}