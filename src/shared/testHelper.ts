import {MutableRefObject, RefObject} from 'react';

export type IVideoOptions = {
    durationInSeconds?: number,
    startTimeOffset?: number
}

export type ISourceBufferOptions = {
    bufferedLength?: number,
    start: number,
    end: number
}

export type IMockHTMLVideoElement = {
    currentTime: number
}

export type IMockSourceBuffer = {
    buffered: TimeRanges,
    remove: (start: number, end: number) => void
}

export function createMockedVidRef(options?: IVideoOptions) : RefObject<HTMLVideoElement> {
    return {
        current: {
            currentTime: options ? options.durationInSeconds || 0 : 0
        } as HTMLVideoElement
    }
}

export function createMockSourceBuffer(options: ISourceBufferOptions) : MutableRefObject<SourceBuffer> {
    return {
        current : {
            buffered: {
                length: 2,
                end: (indx: number) => options.end,
                start: (indx: number) => options.start
            },
            remove: jest.fn((start, end) => {})
        } as unknown as SourceBuffer
    }
}