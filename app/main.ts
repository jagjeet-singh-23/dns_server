import * as dgram from "dgram";
import DNSHeader, { OpCode, ResponseCode, TDNSHeader } from "./dns/header";
import DNSQuestion, {
  DNSRecordClass,
  DNSRecordType,
  IDNSQuestion,
} from "./dns/questions";

const defaultHeader: TDNSHeader = {
  id: 0,
  qr: 0,
  opcode: OpCode.QUERY,
  aa: 0,
  tc: 0,
  rd: 0,
  ra: 0,
  z: 0,
  rcode: ResponseCode.NO_ERROR,
  qdcount: 0,
  ancount: 0,
  nscount: 0,
  arcount: 0,
};

const defaultQuestion: IDNSQuestion = {
  name: "www.google.com",
  type: DNSRecordType.A,
  classCode: DNSRecordClass.IN,
};

const udpSocket: dgram.Socket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1");

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
  try {
    console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}`);

    const header = DNSHeader.write({ ...defaultHeader, qdcount: 1 });
    const question = DNSQuestion.write([defaultQuestion]);

    const response = Buffer.concat([header, question]);
    udpSocket.send(response, remoteAddr.port, remoteAddr.address);
  } catch (e) {
    console.log(`Error sending data: ${e}`);
  }
});
