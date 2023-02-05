import ts from "typescript";
import { createCompilerHostFromWing } from "..";

describe("When parsing control flow statements", () => {
  const source = `

bring cloud;

let var result = 0;
if (true) {
  result = 1;
} elif false {
  result = -1;
} else {
  result = 1;
}
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
let result = 0;
if (true) {
    result = 1;
}
else if (true) {
    result = -1;
}
else {
    result = 1;
}"
`);
  });

  it("then can emit javascript", () => {
    let javascript = "";
    host.program.emit(undefined, (filename, text) => {
      javascript = text;
    });
    expect(javascript).toMatchInlineSnapshot(`
"let result = 0;
if (true) {
    result = 1;
}
else if (true) {
    result = -1;
}
else {
    result = 1;
}
"
`);
  });
  it("then can analyze types", () => {
    let typed = getVariableTypes(host.sourceFile, host.typeChecker);
    expect(typed).toMatchInlineSnapshot(`
"variable result      : type number
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
