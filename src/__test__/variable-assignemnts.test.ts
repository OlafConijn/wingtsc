import ts from "typescript";
import { createCompilerHostFromWing } from "..";

describe("When parsing variable assignment", () => {
  const source = `
bring cloud;

let n1 = 1;
let b1 = true;
let s1 = "string";
let o1 = {};

let var n2 = 1;
let var b2 = true;
let var s2 = "string";
let var o2 = {};

let n3 : num = 1;
let b3 : bool = true;
let s3 : str = "string";
let o3 : any = {};

let n4 : num? = 1;
let b4 : bool? = true;
let s4 : str? = "string";
let o4 : any? = {};

let bucket = new cloud.Bucket() as "mybucket" in scope;

let a = [1, 2, 3]; // Array<num> inferred
let b = new Array(["apple", "banana", "orange"]); // maybe allowed?
let c = new Array<str>(["apple", "banana", "orange"]); //not supported yet by parser?
let d = { "apple", "banana", "orange" }; // Set<str> inferred
let e = { "apples": 3, "bananas": 4 }; // Map<num> inferred


`;

  const host = createCompilerHostFromWing(source);

  it("then creates compiler host", () => {
    expect(host).toBeDefined();
    expect(host.sourceFile).toBeDefined();
    expect(host.program).toBeDefined();
    expect(host.typeChecker).toBeDefined();
  });

  it("then can emit typescript", () => {
    const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
    const typescript = printer.printFile(host.sourceFile).trim();
    expect(typescript).toMatchInlineSnapshot(`
"import * as cloud from "@winglang/sdk";
const n1 = 1;
const b1 = true;
const s1 = "string";
const o1 = {} as Record<string, any>;
let n2 = 1;
let b2 = true;
let s2 = "string";
let o2 = {} as Record<string, any>;
const n3: number = 1;
const b3: boolean = true;
const s3: string = "string";
const o3: any = {} as Record<string, any>;
const n4: number | undefined = 1;
const b4: boolean | undefined = true;
const s4: string | undefined = "string";
const o4: any | undefined = {} as Record<string, any>;
const bucket = new cloud.Bucket(scope, "mybucket");
const a = [1, 2, 3]; // Array<num> inferred
const b = new Array(...["apple", "banana", "orange"]); // maybe allowed?
const c = new Array(...["apple", "banana", "orange"]); //not supported yet by parser?
const d = new Set(...["apple", "banana", "orange"]); // Set<str> inferred
const e = {
    "apples": 3, "bananas": 4
} as Record<string, any>; // Map<num> inferred"
`);
  });

  it("then can emit javascript", () => {
    let javascript = "";
    host.program.emit(undefined, (filename, text) => {
      javascript = text;
    });
    expect(javascript).toMatchInlineSnapshot(`
"import * as cloud from "@winglang/sdk";
const n1 = 1;
const b1 = true;
const s1 = "string";
const o1 = {};
let n2 = 1;
let b2 = true;
let s2 = "string";
let o2 = {};
const n3 = 1;
const b3 = true;
const s3 = "string";
const o3 = {};
const n4 = 1;
const b4 = true;
const s4 = "string";
const o4 = {};
const bucket = new cloud.Bucket(scope, "mybucket");
const a = [1, 2, 3]; // Array<num> inferred
const b = new Array(...["apple", "banana", "orange"]); // maybe allowed?
const c = new Array(...["apple", "banana", "orange"]); //not supported yet by parser?
const d = new Set(...["apple", "banana", "orange"]); // Set<str> inferred
const e = {
    "apples": 3, "bananas": 4
}; // Map<num> inferred
"
`);
  });
  it("then can analyze types", () => {
    let typed = getVariableTypes(host.sourceFile, host.typeChecker);
    expect(typed).toMatchInlineSnapshot(`
"variable n1          : type 1
variable b1          : type true
variable s1          : type "\\"string\\""
variable o1          : type Record<string, any>
variable n2          : type number
variable b2          : type boolean
variable s2          : type string
variable o2          : type Record<string, any>
variable n3          : type number
variable b3          : type boolean
variable s3          : type string
variable o3          : type any
variable n4          : type number
variable b4          : type boolean
variable s4          : type string
variable o4          : type any
variable bucket      : type any
variable a           : type number[]
variable b           : type string[]
variable c           : type string[]
variable d           : type Set<string>
variable e           : type Record<string, any>
"
`);
  });
});

export const getVariableTypes = (
  node: ts.Node,
  typeChecker: ts.TypeChecker
) => {
  let result = "";
  ts.forEachChild(node, (child) => {
    result += getVariableTypes(child, typeChecker);
    if (ts.isVariableDeclaration(child) && ts.isIdentifier(child.name)) {
      const type = typeChecker.getTypeAtLocation(child);
      const typeName = typeChecker.typeToString(type);
      result += `variable ${child.name.text.padEnd(12)}: type ${typeName}\n`;
    }
  });
  return result;
};
