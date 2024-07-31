import RPC from "@hyperswarm/rpc";
import b4a from "b4a";
import libKeys from "hyper-cmd-lib-keys";
import HyperDHT from "hyperdht";

export default class Hypercannon {
  //seed needs to be 64 char long
  constructor(seed) {
    // Keep the seed
    if (seed) {
      this.buffer = seed;
    } else {
      this.buffer = libKeys.randomBytes(32).toString("hex");
    }
    // Setup RPC
    this.rpc = new RPC({
      seed: Buffer.from(this.buffer, "hex"),
    });
    // Need to derive a key from HyperDHT for pushing
    this.key = HyperDHT.keyPair(b4a.from(this.buffer, "hex")).publicKey;
  }

  buffKey() {
    return this.buffer;
  }

  async subscribe() {
    // Create server and listen
    this.server = this.rpc.createServer();
    await this.server.listen();
    // Handle ping request
    this.server.respond("ping", (req) => {
      console.log(req.toString());
    });
    this.server.respond("end", (req) => {
      this.stop();
    });
  }

  async push(data) {
    if (!data.name) {
      data.name = "ping";
    }
    this.client = this.rpc.connect(this.key);
    let req = await this.client.request(data.name, Buffer.from(data.content));
    return req; // Added to return the request response
  }

  // This will stop the server
  async stop() {
    await this.server.close();
    await this.rpc.destroy({ force: true });
  }

  // This will stop the client
  async stopClient() {
    await this.rpc.destroy({ force: true });
  }
}
