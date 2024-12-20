import { DNSRecordClass, DNSRecordType } from "./questions";

export interface IDNSAnswer {
  name: string;
  type: DNSRecordType;
  classCode: DNSRecordClass;
  ttl: number;
  data: string;
};

class DNSAnswer {
  static write(answers: IDNSAnswer[]) {
    return Buffer.concat(
      answers.map(answer => {
        const { name, classCode, type, ttl, data } = answer;

        const buffer = Buffer.alloc(10);

        const str = name
          .split(".")
          .map(label => `${String.fromCharCode(label.length)}${label}`)
          .join("");

        buffer.writeInt16BE(type, 0);
        buffer.writeInt16BE(classCode, 2);
        buffer.writeInt16BE(ttl, 4);
        buffer.writeInt16BE(data.length, 8);

        return Buffer.concat([
          Buffer.from(str + "\0", "binary"),
          buffer,
          Buffer.from(data, "binary")
        ]);
      })
    )
  }
};

export default DNSAnswer;
