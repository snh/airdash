import ReadsbProto from "./readsb.proto";
import { load as loadProto } from "protobufjs";
import { default as axios } from 'axios';

export default class ReadsbClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
    this.axios = axios.create({
      baseURL: this.baseUrl,
    });
  }

  async request(config, pb = null) {
    const requestConfig = {
      ...config,
    };

    if (pb) {
      requestConfig.responseType = 'arraybuffer';
    }

    const { stack } = new Error();
    try {
      const result = await this.axios.request(requestConfig);
      if (pb) {
        return pb.decode(Buffer.from(result.data, 'binary'));
      }
      return result;
    } catch (err) {
      err.stack = stack;
      throw err;
    }
  }

  get(url, config = {}, pb = null) {
    return this.request({
      ...config,
      method: 'get',
      url,
    }, pb);
  }

  async getAircraft() {
    const pb = ReadsbProto.AircraftsUpdate;
    const data = await this.get('radar/data/aircraft.pb', {}, pb);
    return data;
  }

  async getStats() {
    const pb = ReadsbProto.Statistics;
    const data = await this.get('radar/data/stats.pb', {}, pb);
    return data;
  }

  async getReceiver() {
    const pb = ReadsbProto.Receiver;
    const data = await this.get('radar/data/receiver.pb', {}, pb);
    return data;
  }
}
