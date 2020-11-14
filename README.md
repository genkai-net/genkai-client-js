# genkai-client-js
Javascript client for https://github.com/genkai-net/genkai-server-go

Usage
```javascript
import {GenkaiClient, GenkaiClientJSON} from "genkai-client";

let app = GenkaiClient("http://localhost:9302");
let response = await app.join("hello", "world");
console.log(response);
```

Returns
```javascript
"hello:world"
```

See: https://github.com/genkai-net/genkai-server-go for more documentation and samples.