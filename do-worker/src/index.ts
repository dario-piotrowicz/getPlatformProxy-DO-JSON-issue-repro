export interface Env {
	MY_DO: DurableObjectNamespace;
}

export class MyDurableObject {
	fetch(): Response {
		return new Response('Hello World');
	}
}

export default {
	/**
	 * This is the standard fetch handler for a Cloudflare Worker
	 *
	 * @param request - The request submitted to the Worker from the client
	 * @param env - The interface to reference bindings declared in wrangler.toml
	 * @param ctx - The execution context of the Worker
	 * @returns The response to be sent back to the client
	 */
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		let id = env.MY_DO.idFromName(new URL(request.url).pathname);

		let stub = env.MY_DO.get(id);

		return await stub.fetch(new URL(request.url));
	},
};
