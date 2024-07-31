import Hypercannon from "./index.js";

// Usage example:
let dataSender = new Hypercannon();
console.log(dataSender.buffKey());
await dataSender.subscribe(); // Ensure subscription is set up

let receiver = new Hypercannon(dataSender.buffKey());
await receiver.push({ name: "ping", content: "lol" }); // Now push data
await receiver.push({ content: "more" }); // Now push data

dataSender.stop();
receiver.stopClient();
// await receiver.push({ name: "ping", content: "lol" }); // Won't work because closed
