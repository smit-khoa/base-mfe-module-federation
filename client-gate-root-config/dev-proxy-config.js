// const proxy = require("./owner");

// function generateProxy({ DEV_PORT, is_production }) {
//   let config = Object();

//   for (const service in proxy) {
//     let ip = proxy[service];
//     const port = DEV_PORT[service];

//     // product có dạng: client_gate_shared_dependency: "client_gate_shared_dependency@./smit-gate-shared-dependency/client_gate_shared_dependency-remote.js"
//     // dev có dạng: client_gate_shared_dependency: "client_gate_shared_dependency@http://localhost:17101/client_gate_shared_dependency-remote.js",

//     config[`smit_gate_${service}`] = is_production
//       ? `smit_gate_${service}@./smit_gate_${service}_remote.js`
//       : `smit_gate_${service}@https://${ip}:${port}/smit_gate_${service}_remote.js`;
//   }

//   return config;
// }

// module.exports = generateProxy;

const proxy = require("./owner");

function generateProxy({ DEV_PORT, is_production }) {
  let config = {
    proxy: {},
    remote: {},
  };

  for (const service in proxy) {
    let ip = proxy[service];
    const port = DEV_PORT[service];

    if (is_production) {
      config.remote[
        `smit_gate_${service}`
      ] = `smit_gate_${service}@./smit_gate_${service}_remote.js`;
    } else {
      config.remote[
        `smit_gate_${service}`
      ] = `smit_gate_${service}@/proxy-${service}/smit_gate_${service}_remote.js`;

      config.proxy[`/proxy-${service}`] = {
        target: `http://${ip}:${port}`,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          [`^/proxy-${service}`]: "",
        },
      };
    }
  }

  return config;
}

module.exports = generateProxy;
