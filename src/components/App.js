import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const topic = "/foo";

export default () => {
  const [state, setState] = useState("not ready");

  useEffect(() => {
    var clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);

    var host = "ws://localhost:3000";

    // var options = {
    //   keepalive: 10,
    //   clientId: clientId,
    //   protocolId: "MQTT",
    //   protocolVersion: 4,
    //   clean: true,
    //   reconnectPeriod: 1000,
    //   connectTimeout: 30 * 1000,
    //   will: {
    //     topic: "WillMsg",
    //     payload: "Connection Closed abnormally..!",
    //     qos: 0,
    //     retain: false,
    //   },
    //   username: "demo",
    //   password: "demo",
    //   rejectUnauthorized: false,
    // };

    var client = mqtt.connect(host);

    client.on("error", function (err) {
      console.log(err);
      client.end();
    });

    client.on("connect", function () {
      console.log("客户端连接到服务器成功! id:" + clientId);
      setState("ready");
    });

    client.subscribe(topic, { qos: 0 });

    // client.publish("topic", "wss secure connection demo...!", {
    //   qos: 0,
    //   retain: false,
    // });

    client.on("message", function (topic, message, packet) {
      console.log(
        "Received Message:= " + message.toString() + "\nOn topic:= " + topic
      );
    });

    client.on("close", function () {
      console.log(clientId + " disconnected");
      setState("not ready");
    });
  }, []);

  if (state !== "ready") return <div>Connecting...</div>;
  return <div>Hello MQTT!</div>;
};
