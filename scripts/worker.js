const ports = [];

onconnect = function (e) {
  const port = e.ports[0];
  ports.push(port);

  e.source.addEventListener("message", (event) => {
    ports.forEach((otherPort) => {
      if (otherPort !== port) {
        otherPort.postMessage(event.data);
      }
    });
  });

  e.source.start();
};
