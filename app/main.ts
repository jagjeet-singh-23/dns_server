import * as dgram from "dgram";
import DNSHeader, { OpCode, ResponseCode, TDNSHeader } from "./dns/header";
import DNSQuestion, {
  DNSRecordClass,
  DNSRecordType,
  IDNSQuestion,
} from "./dns/questions";
import DNSAnswer, { IDNSAnswer } from "./dns/answer";

const defaultHeader: TDNSHeader = {
  id: 1234,
  qr: 1,
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

const defaultAnswer: IDNSAnswer = {
  name: "www.google.com",
  type: DNSRecordType.A,
  classCode: DNSRecordClass.IN,
  ttl: 60,
  data: "\0x8\0x8\0x8\0x8",
};

const udpSocket: dgram.Socket = dgram.createSocket("udp4");
udpSocket.bind(2053, "127.0.0.1");

udpSocket.on("message", (data: Buffer, remoteAddr: dgram.RemoteInfo) => {
  try {
    console.log(`Received data from ${remoteAddr.address}:${remoteAddr.port}`);
    const header = DNSHeader.write({ ...defaultHeader, qdcount: 1, ancount: 1 });
    const question = DNSQuestion.write([defaultQuestion]);
    const answer = DNSAnswer.write([defaultAnswer]);

    const response = Buffer.concat([header, question, answer]);
    udpSocket.send(response, remoteAddr.port, remoteAddr.address);
  } catch (e) {
    console.log(`Error sending data: ${e}`);
  }
});
