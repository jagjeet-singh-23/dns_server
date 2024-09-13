export enum OpCode {
  QUERY = 0,
  IQUERY = 1,
  STATUS = 2,
}

export enum ResponseCode {
  NO_ERROR = 0,
  FORMAT_ERROR = 1,
  SERVER_FAILURE = 2,
  NAME_ERROR = 3,
  NOTIMP = 4,
  REFUSED = 5,
}

export interface TDNSHeader {
  id: number;
  qr: number;
  opcode: OpCode;
  aa: number;
  tc: number;
  rd: number;
  ra: number;
  z: number;
  rcode: ResponseCode;
  qdcount: number;
  ancount: number;
  nscount: number;
  arcount: number;
}

class DNSHeader {
  static write(values: TDNSHeader) {
    const header = Buffer.alloc(12);
    const flags =
      (values.qr << 15) |
      (values.opcode << 11) |
      (values.aa << 10) |
      (values.tc << 9) |
      (values.rd << 8) |
      (values.ra << 7) |
      (values.z << 4) |
      values.rcode;

    header.writeInt16BE(values.id, 0);
    header.writeInt16BE(flags, 2);
    header.writeInt16BE(values.qdcount, 4);
    header.writeInt16BE(values.ancount, 6);
    header.writeInt16BE(values.nscount, 8);
    header.writeInt16BE(values.arcount, 10);

    return header;
  }
}

export default DNSHeader;
