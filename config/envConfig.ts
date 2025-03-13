if(process.env.qpmnEnvBaseUrl === undefined){
  process.env.qpmnEnvBaseUrl = "https://www.demo.com/stage";
}

if(process.env.wooStoreBaseUrl === undefined){
  process.env.wooStoreBaseUrl = "https://stage.demo.com/automationstore1";
}

export const qpmnconfig = {
    QPMN_BASEURL: process.env.qpmnEnvBaseUrl,
    WOO_STORE_BASEURL: process.env.wooStoreBaseUrl,
    QPMN_PROD: "https://www.demo.com",
    
    credentials: {
      username2: "wrong.username@qpp.com",
      password: "test123",
    },
    minTimeout: 2000,
    timeout: 10000,
    maxTimeout: 10000,
  };