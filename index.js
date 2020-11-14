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
    return (remote, entrypoint, config) => {
        if (!entrypoint) {
            entrypoint = "__genkai_endpoint"
        }

        let session = makeSession();
        config = config || {};
        let store = config.storage || sessionStorage;
        if (typeof store !== "undefined") {
            session = store.getItem("genkai-session-" + entrypoint) || session;
            store.setItem("genkai-session-" + entrypoint, session);
        }

        return new Proxy({
            debug: config.debug,
            remote,
            entrypoint,
            session,
            newSession() {
                store.removeItem("genkai-session-" + entrypoint);
                this.session = makeSession();
                if (typeof store !== "undefined") {
                    store.setItem("genkai-session-" + entrypoint, session);
                }
            }
        }, {
            get: handler
        })
    };
};


module.exports = {
    GenkaiClient: GenkaiClient(getHandler),
    GenkaiClientJSON: GenkaiClient(getHandlerJSON)
};
