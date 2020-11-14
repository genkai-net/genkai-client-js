let makeSession = () => {
        return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }
;

let getHandler = (obj, prop) => {
    return async (...params) => {
        if (!!obj[prop]) {
            return obj[prop]
        }

        let debug = "";
        if (!!obj.debug) {
            debug = `?p=${params}&fn=${prop}`
        }

        let r = await fetch(`${obj.remote}/${obj.entrypoint}${debug}`, {
            method: "post",
            body: JSON.stringify({
                fn: prop,
                p: params,
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
};

let getHandlerJSON = (obj, prop) => {
    return async (param) => {
        let debug = "";
        if (!!obj.debug) {
            debug = `?p=${params}&fn=${prop}`
        }

        let r = await fetch(`${obj.remote}/${obj.entrypoint}${debug}`, {
            method: "post",
            body: JSON.stringify({
                fn: prop,
                json: JSON.stringify(param)
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
};

let GenkaiClient = (handler) => {
    return (remote, entrypoint, debug) => {
        if (!entrypoint) {
            entrypoint = "__genkai_endpoint"
        }

        let session = entrypoint + makeSession();
        if (typeof sessionStorage !== "undefined") {
            session = sessionStorage.getItem("genkai-session") || session;
            sessionStorage.setItem("genkai-session", session);
        }

        return new Proxy({
            debug,
            remote,
            entrypoint,
            session,
            newSession() {
                sessionStorage.removeItem("genkai-session");
                this.session = entrypoint + makeSession();
                if (typeof sessionStorage !== "undefined") {
                    sessionStorage.setItem("genkai-session", session);
                }
            }
        }, {
            get: handler
        })
    };
}


module.exports = {
    GenkaiClient: GenkaiClient(getHandler),
    GenkaiClientJSON: GenkaiClient(getHandlerJSON)
};
