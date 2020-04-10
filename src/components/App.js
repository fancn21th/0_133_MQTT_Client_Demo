import React, { useEffect, useState } from "react";
import mqtt from "mqtt";

const topic = "/foo";

export default () => {
  const [state, setState] = useState("not ready");
  const [client, setClient] = useState(null);
  const [clientId, setClientId] = useState(null);

  useEffect(() => {
    if (client) {
      client.on("error", function(err) {
        console.log(err);
        client.end();
      });

      client.on("connect", function() {
        console.log("client connected:" + clientId);
        setState("ready");
      });

      client.subscribe("topic", { qos: 0 });

      client.publish("topic", "wss secure connection demo...!", {
        qos: 0,
        retain: false
      });

      client.on("message", function(topic, message, packet) {
        console.log([topic, message].join("===>"));
      });

      client.on("close", function() {
        console.log(clientId + " disconnected");
      });
    }
  }, [client]);

  useEffect(() => {
    setClientId(
      "mqttjs_" +
        Math.random()
          .toString(16)
          .substr(2, 8)
    );

    var host = "ws://localhost:3000";

    var options = {
      keepalive: 10,
      clientId: clientId,
      protocolId: "MQTT",
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: "WillMsg",
        payload: "Connection Closed abnormally..!",
        qos: 0,
        retain: false
      },
      username: "demo",
      password: "demo",
      rejectUnauthorized: false
    };

    setClient(mqtt.connect(host, options));
  }, []);

  const onSend = () => {
    if (client)
      client.publish("topic", "blah blah.......", {
        qos: 0,
        retain: false
      });
  };

  if (state !== "ready") return <h1>Connecting...</h1>;
  return (
    <div>
      <h1>Hello MQTT!</h1>
      <button onClick={onSend}>Send another message</button>
    </div>
  );
};
