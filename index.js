let makeSession = ()=>{
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
;

let getHandler = (obj,prop)=>{
    return async(...params)=>{
      let r = await fetch(`${obj.remote}/${obj.entrypoint}`, {
        method: "post",
        body: JSON.stringify({
          fn: prop,
          p: params
        }),
        headers: {
          "genkai-session": obj.session
        }
      });

      let response = await r.json();
      if (!!response.e) {
        throw Error(response.e)
      }

      if (!!response.r && response.r.length === 1) {
        return response.r[0]
      }

      return response.r
    }
  }
;

let GenkaiClient = (remote, entrypoint)=>{
  if (!entrypoint) {
    entrypoint = "__genkai_endpoint"
  }

  let session = entrypoint + makeSession();
  if (typeof sessionStorage !== "undefined") {
    session = sessionStorage.getItem("genkai-session") || session;
    sessionStorage.setItem("genkai-session", session);
  }

  return new Proxy({
    remote,
    entrypoint,
    session,
    newSession () {
      sessionStorage.removeItem("genkai-session");
      this.session = entrypoint + makeSession();
      if (typeof sessionStorage !== "undefined") {
        sessionStorage.setItem("genkai-session", session);
      }
    }
  },{
    get: getHandler
  })
};


module.exports = {
    GenkaiClient
};
