import { runDoWorker } from './run-worker.js';
import { getPlatformProxy } from 'wrangler';

await runDoWorker();

const { env: { MY_DO: myDo }} = await getPlatformProxy();

const doId = myDo.idFromName('my-do-name');
const doObj = myDo.get(doId);
const doResp = await doObj.fetch('http://0.0.0.0');
const doRespText = await doResp.text();

console.log(`\x1b[32mThe DurableObject response is: "${doRespText}"\n\x1b[0m`);

process.exit(0);
