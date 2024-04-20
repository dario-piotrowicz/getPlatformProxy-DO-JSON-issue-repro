import { Miniflare } from "miniflare";

const mf = new Miniflare({
  workers: [
    {
      modules: true,
      script: `
        export default {
            async fetch(req, env) {
                const myDo = env.MY_DO;
                const doId = myDo.idFromName('my-do-name');
                const doObj = myDo.get(doId);
                const doResp = await doObj.fetch('http://0.0.0.0');
                const doRespText = await doResp.text();
                return new Response('Resp from DO: ' + doRespText);
            }
        }`,
      durableObjects: {
        MY_DO: {
            className: 'MyDurableObject',
            scriptName: 'do-worker',
        }
      }
    },
    {
      modules: true,
      name: "do-worker",
      script: `
        export class MyDurableObject {
            fetch() {
                return new Response('Hello World');
            }
        }

        export default {
            async fetch(request, env, ctx) {
                let id = env.MY_DO.idFromName(new URL(request.url).pathname);
                let stub = env.MY_DO.get(id);
                return await stub.fetch(new URL(request.url));
            },
        };
      `,
    },
  ],
});

const { MY_DO: myDo } = await mf.getBindings();

const doId = myDo.idFromName('my-do-name');
const doObj = myDo.get(doId);
const doResp = await doObj.fetch('http://0.0.0.0');
const doRespText = await doResp.text();

console.log(`\x1b[32mThe DurableObject response is: "${doRespText}"\n\x1b[0m`);

await mf.dispose();
