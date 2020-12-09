/**
 * @jest-environment jsdom
 */

import {base64ToUint8} from './byteUtils';

describe("src/utils/byteUtils.ts", () => {
    it("Can convert a base64 string into a Uint64 array", () => {

        
        const base64String = btoa("this is a test string");
        const arr = base64ToUint8(base64String);
        expect(arr).toBeInstanceOf(Uint8Array);
    })
})