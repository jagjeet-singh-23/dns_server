export enum DNSRecordType {
  A = 1,
  NS = 2,
  CNAME = 5,
}
export enum DNSRecordClass {
  IN = 1,
  CH = 3,
  HS = 4,
}

export interface IDNSQuestion {
  name: string;
  type: DNSRecordType;
  classCode: DNSRecordClass;
}

class DNSQuestion {
  static write(questions: IDNSQuestion[]) {
    return Buffer.concat(
      questions.map((question) => {
        const { name, type, classCode } = question;

        const str = name
          .split(".")
          .map((label) => `${String.fromCharCode(label.length)}${label}`)
          .join("");

        const typeAndClass = Buffer.alloc(4);
        typeAndClass.writeInt16BE(type, 0);
        typeAndClass.writeInt16BE(classCode, 2);

        return Buffer.concat([Buffer.from(str + "\0", "binary"), typeAndClass]);
      }),
    );
  }
}

export default DNSQuestion;
