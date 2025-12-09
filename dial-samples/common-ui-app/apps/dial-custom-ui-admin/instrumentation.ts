export async function register() {
  const orig = global.fetch;

  global.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url =
      typeof input === "string" ? input :
      input instanceof URL ? input.toString() :
      (input as Request).url;

    const method = init?.method ?? (input as Request)?.method ?? "GET";
    console.log("[SSR fetch]", method, url);

    try {
      const res = await orig(input as any, init);
      console.log("[SSR fetch][done]", method, url, res.status);
      return res;
    } catch (e) {
      console.error("[SSR fetch][err]", method, url, e);
      throw e;
    }
  };
}
