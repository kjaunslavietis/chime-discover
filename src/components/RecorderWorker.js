import { initMp3MediaEncoder } from 'mp3-mediarecorder/worker';
 
initMp3MediaEncoder({ vmsgWasmUrl: `${process.env.PUBLIC_URL}/vmsgwasm.file` });