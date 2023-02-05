import Parser, { SyntaxNode } from "tree-sitter";
import ts, { Expression, factory, Identifier } from "typescript";
import { libraryDefinitionAsString } from "./wingsdk";

const Wing = require("@winglang/tree-sitter-wing");
const parser = new Parser() as Parser;
parser.setLanguage(Wing);

function convertNode<T extends ts.Node>(
  wingNode: Parser.SyntaxNode,
  opts: { required: true; setPos?: boolean; array?: false }
): T;
function convertNode(
  wingNode: Parser.SyntaxNode,
  opts: { required: true; setPos?: boolean; array?: false }
): ts.Node;
function convertNode<T extends ts.Node>(
  wingNode: Parser.SyntaxNode,
  opts: { required: false; setPos?: boolean; array?: false }
): T | undefined;
function convertNode(
  wingNode: Parser.SyntaxNode,
  opts: { required: true; setPos?: boolean; array?: false }
): ts.Node | undefined;
function convertNode<T extends ts.Node>(
  wingNode: Parser.SyntaxNode,
  opts: { required: true; setPos?: boolean; array: true }
): T[];
function convertNode(
  wingNode: Parser.SyntaxNode,
  opts: { required: true; setPos?: boolean; array: true }
): ts.Node[];
function convertNode<T extends ts.Node>(
  wingNode: Parser.SyntaxNode,
  opts: { required: false; setPos?: boolean; array: true }
): T[] | undefined;
function convertNode(
  wingNode: Parser.SyntaxNode,
  opts: { required: false; setPos?: boolean; array: true }
): ts.Node[] | undefined;

function convertNode(
  wingNode: Parser.SyntaxNode,
  opts: { required: boolean; setPos?: boolean; array?: boolean }
): ts.Node | ts.Node[] | undefined {
  if (!!opts.array) {
    return wingNode.namedChildren
      .map((x) => convertNode(x, { required: false, setPos: opts.setPos }))
      .filter((x) => x !== undefined) as ts.Node[];
  }

  const tsNode = createTsNode(wingNode);
  if (!tsNode && opts.required) {
    throw new Error(
      `unable to convert required node {type: ${wingNode.type}, text: ${wingNode.text}}`
    );
  }
  if (tsNode && wingNode && opts.setPos !== false) {
    setPos(tsNode, wingNode);
  }
  return tsNode;
}

const createTsNode = (node: Parser.SyntaxNode): ts.Node | undefined => {
  if (!node) return undefined;
  switch (node.type) {
    case "source": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "block": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "identifier":
    case "reference": {
      return factory.createIdentifier(node.text);
    }

    case "custom_type": {
      const { fieldsNode, objectNode } = node as any as Record<
        string,
        SyntaxNode
      >;

      const split = node.text.split(".");
      const first = factory.createIdentifier(split[0]);
      setPos(first, node, { pos: 0, end: -1 * (split[1].length + 1) });
      const second = factory.createIdentifier(split[1]);
      setPos(second, node, { pos: split[0].length + 1, end: 0 });
      return factory.createPropertyAccessExpression(first, second);
    }

    case "nested_identifier": {
      const { objectNode, propertyNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "short_import_statement": {
      //const { aliasNode, module_nameNode } = (node as any as Record<string, SyntaxNode>);
      const moduleName = node.namedChild(0);
      if (moduleName?.text !== "cloud")
        throw new Error("only bring cloud is supported");
      const identifier = factory.createIdentifier("cloud");
      setPos(identifier, moduleName);
      const namespaceImport = factory.createNamespaceImport(identifier);
      setPos(namespaceImport, moduleName);
      const importClause = factory.createImportClause(
        false,
        undefined,
        namespaceImport
      );
      setPos(importClause, node);

      const moduleSpecifier = factory.createStringLiteral("@winglang/sdk");
      // setPos(moduleSpecifier, node);

      return factory.createImportDeclaration(
        undefined,
        importClause,
        moduleSpecifier,
        undefined
      );
    }

    case "struct_definition": {
      const { nameNode } = node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "struct_field": {
      const { nameNode, typeNode } = node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "enum_definition": {
      const { enum_nameNode } = node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "return_statement": {
      const { expressionNode } = node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "variable_assignment_statement": {
      const { nameNode, valueNode } = node as any as Record<string, SyntaxNode>;
      return factory.createExpressionStatement(
        factory.createBinaryExpression(
          convertNode<Identifier>(nameNode, { required: true, array: false }),
          factory.createToken(ts.SyntaxKind.EqualsToken),
          convertNode<Expression>(valueNode, { required: true })
        )
      );
    }

    case "expression_statement": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "class_definition": {
      const { implementationNode, nameNode, parentNode } =
        node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "class_implementation": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "class_member": {
      const { access_modifierNode, nameNode, reassignableNode, typeNode } =
        node as any as Record<string, SyntaxNode>;

      return factory.createPropertyDeclaration(
        undefined,
        convertNode<Identifier>(nameNode, { required: true }),
        undefined,
        convertNode(typeNode, { required: false }),
        undefined
      );
    }

    case "inflight_class_member": {
      const { access_modifierNode, nameNode, phase_modifierNode, typeNode } =
        node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "resource_definition": {
      const { implementationNode, nameNode, parentNode } =
        node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "resource_implementation": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "for_in_loop": {
      const { blockNode, iterableNode, iteratorNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "while_statement": {
      const { blockNode, conditionNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "if_statement": {
      //todo: this seems broken
      let { blockNode, conditionNode, elif_blockNode, else_blockNode } =
        node as any as Record<string, SyntaxNode>;
      let elif_conditionNode: SyntaxNode | undefined = undefined;
      let elif_bloc_blockNode: SyntaxNode | undefined = undefined;

      const childTypes = node.children.map((x) => x.type);
      if (childTypes[0] == "if" && childTypes[3] == "else") {
        else_blockNode = node.children[4];
      } else if (childTypes[0] == "if" && childTypes[3] == "elif_block") {
        let { conditionNode: _conditionNode, blockNode: _blockNode } = (node.children[3] ??
          {}) as any as Record<string, SyntaxNode>;
        elif_conditionNode = _conditionNode;
        elif_bloc_blockNode = _blockNode;

        if (childTypes[4] == "else") {
          else_blockNode = node.children[5];
        }
      }

      const elseStatement = else_blockNode
        ? factory.createBlock(
            convertNode(else_blockNode, {
              required: true,
              setPos: true,
              array: true,
            }),
            true
          )
        : undefined;

      if (elseStatement) setPos(elseStatement, else_blockNode);

      const elseIfStatement = elif_conditionNode
        ? factory.createIfStatement(
            removeOutermostParenthesis(convertNode(elif_conditionNode!, { required: true, setPos: true })),
            factory.createBlock(
              convertNode(elif_bloc_blockNode!, {
                required: true,
                setPos: true,
                array: true,
              }),
              true
            ),
            elseStatement
          )
        : undefined;
      
        if (elseIfStatement) setPos(elseIfStatement, node.children[3]);

      return factory.createIfStatement(
        removeOutermostParenthesis(convertNode(conditionNode, { required: true, setPos: true })),
        factory.createBlock(
          convertNode(blockNode, { required: true, setPos: true, array: true }),
          true
        ),
        elseIfStatement ? elseIfStatement : elseStatement
      );
    }

    case "elif_block": {
      const { blockNode, conditionNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "duration": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "seconds": {
      const { valueNode } = node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "minutes": {
      const { valueNode } = node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "hours": {
      const { valueNode } = node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "bool":
      return node.text ? factory.createTrue() : factory.createFalse();
    case "number":
      return factory.createNumericLiteral(node.text);
    case "string":
      return factory.createStringLiteral(node.text);

    case "template_substitution": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "call": {
      const { argsNode, callerNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "positional_argument": {
      const text = node.text;
      if (text[0] === '"' && text[text.length - 1] === '"') {
        return factory.createStringLiteral(text.substring(1, text.length - 2));
      }
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "keyword_argument": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "new_expression": {
      const { argsNode, classNode, idNode, scopeNode } = node as any as Record<
        string,
        SyntaxNode
      >;

      let parameters = [] as ts.Expression[];

      if (idNode || scopeNode) {
        if (scopeNode) {
          const convertedScopeNode = convertNode<Expression>(scopeNode, {
            required: true,
            setPos: false,
          });
          setPos(convertedScopeNode, scopeNode, { pos: 3, end: 0 });
          parameters.push(convertedScopeNode);
        }
        if (idNode) {
          const convertedIdNode = convertNode<Expression>(idNode, {
            required: true,
            setPos: false,
          });
          setPos(convertedIdNode, idNode, { pos: 3, end: 0 });
          parameters.push(convertedIdNode);
        }
      }

      return factory.createNewExpression(
        convertNode(classNode, { required: true, setPos: true }),
        undefined,
        parameters
      );
    }

    case "new_object_id": {
      //as "mybucket"
      return factory.createStringLiteral(node.text.substring(4, -1));
    }

    case "new_object_scope": {
      return factory.createIdentifier(node.text.substring(3));
    }

    case "function_type": {
      const { inflightNode, parameter_typesNode, return_typeNode } =
        node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "parameter_type_list": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "optional": {
      switch (node.text) {
        case "num?":
          return factory.createUnionTypeNode([
            factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
            factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
          ]);
        case "bool?":
          return factory.createUnionTypeNode([
            factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword),
            factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
          ]);
        case "str?":
          return factory.createUnionTypeNode([
            factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword),
            factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
          ]);
        case "any?":
          return factory.createUnionTypeNode([
            factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
            factory.createKeywordTypeNode(ts.SyntaxKind.UndefinedKeyword),
          ]);
        default:
          console.error(`unknown builtin_type: ${node.text}`);
      }
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }
    case "builtin_type": {
      switch (node.text) {
        case "num":
          return factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword);
        case "bool":
          return factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword);
        case "str":
          return factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword);
        case "any":
          return factory.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword);
        case "void":
          return factory.createKeywordTypeNode(ts.SyntaxKind.VoidKeyword);
        default:
          console.error(`unknown builtin_type: ${node.text}`);
      }
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "constructor": {
      const { blockNode, parameter_listNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "function_definition": {
      const {
        access_modifierNode,
        blockNode,
        nameNode,
        parameter_listNode,
        return_typeNode,
        typeNode,
      } = node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "inflight_function_definition": {
      const {
        access_modifierNode,
        blockNode,
        nameNode,
        parameter_listNode,
        phase_modifierNode,
        return_typeNode,
        typeNode,
      } = node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "access_modifier": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "parameter_definition": {
      const { nameNode, reassignableNode, typeNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "parameter_list": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "immutable_container_type": {
      const { collection_typeNode, type_parameterNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "mutable_container_type": {
      const { collection_typeNode, type_parameterNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "unary_expression": {
      const text = node.text;
      if (text[0] === "-")
        return factory.createPrefixUnaryExpression(
          ts.SyntaxKind.MinusToken,
          factory.createNumericLiteral(text.substring(1))
        );

      const { argNode, opNode } = node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "binary_expression": {
      const { leftNode, opNode, rightNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "preflight_closure": {
      const { blockNode, parameter_listNode, return_typeNode, typeNode } =
        node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "inflight_closure": {
      const { blockNode, parameter_listNode, return_typeNode, typeNode } =
        node as any as Record<string, SyntaxNode>;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "await_expression": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "defer_expression": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "parenthesized_expression": {
      const expression = node.children[1]; //not a named node?
      return factory.createParenthesizedExpression(convertNode(expression, {
        required: true,
        setPos: true,
      }));
    }

    case "array_literal": {
      const { elementNode, typeNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "set_literal": {
      const { elementNode, typeNode } = node as any as Record<
        string,
        SyntaxNode
      >;

      if (elementNode === undefined && typeNode === undefined) {
        return factory.createObjectLiteralExpression([], false);
      }
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "map_literal": {
      const { memberNode, typeNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      if (!memberNode && !typeNode) {
        return factory.createObjectLiteralExpression([], false);
      }
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "struct_literal": {
      const { fieldsNode, typeNode } = node as any as Record<
        string,
        SyntaxNode
      >;
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "map_literal_member": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "struct_literal_member": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "structured_access_expression": {
      debugger;
      console.log(`not implemented: ${node.type}, text: ${node.text}`);
      return undefined;
    }

    case "resource_implementation":
    case "argument_list":
      return undefined;
    case "variable_definition_statement": {
      const { nameNode, reassignableNode, typeNode, valueNode } =
        node as any as Record<string, SyntaxNode>;
      return factory.createVariableStatement(
        undefined,
        factory.createVariableDeclarationList(
          [
            factory.createVariableDeclaration(
              convertNode<Identifier>(nameNode, {
                required: true,
                setPos: true,
              }),
              undefined,
              convertNode(typeNode, { required: false, setPos: true }),
              convertNode(valueNode, { required: false, setPos: true })
            ),
          ],
          reassignableNode?.text === "var"
            ? ts.NodeFlags.Let
            : ts.NodeFlags.Const
        )
      );
    }
    case "ERROR":
    case "return_statement":
    default:
      console.log(node.type);
      return undefined;
  }
};

const setPos = (
  statement: any,
  node: Parser.SyntaxNode,
  diff: { pos: number; end: number } = { pos: 0, end: 0 }
) => {
  statement.pos = node.startIndex + diff.pos;
  statement.end = node.endIndex + diff.end;
};

export const parse = (sourceText: string): ts.SourceFile => {
  const tree = parser.parse(sourceText);
  const rootNode = tree.rootNode;
  const statements: ts.Statement[] = [];
  for (let i = 0; i < rootNode.namedChildCount; i++) {
    const node = rootNode.namedChildren[i];
    const statement = convertNode(node, { required: false }) as
      | ts.Statement
      | undefined;
    if (!statement) continue;
    setPos(statement, node);
    statements.push(statement);
  }

  const sourceFile = factory.createSourceFile(
    statements,
    factory.createJSDocComment("") as any,
    ts.NodeFlags.None
  );
  sourceFile.text = sourceText;
  setPos(sourceFile, rootNode);
  return sourceFile;
};

export const removeOutermostParenthesis = (node: ts.Expression): ts.Expression => {
  if (ts.isParenthesizedExpression(node)) {
    return node.expression;
  }
  return node;
}

export const createCompilerHostFromWing = (sourceText: string) => {
  const sourceFile = parse(sourceText);
  (sourceFile as any).parseDiagnostics = [];
  ts.getParseTreeNode = (node: ts.Node | undefined) => node;
  let compilerOptions = {
    strict: false,
    target: ts.ScriptTarget.Latest,
    allowJs: true,
    module: ts.ModuleKind.Node16,
  } as ts.CompilerOptions;
  const host = ts.createCompilerHost(compilerOptions);
  const prevSourceFile = host.getSourceFile;
  host.getSourceFile = (filename: string, languageVersion: ts.ScriptTarget) => {
    if (filename === "fake.ts") return sourceFile;
    if (filename === "winglang.d.ts")
      return ts.createSourceFile(
        filename,
        libraryDefinitionAsString,
        ts.ScriptTarget.Latest
      );
    const file = prevSourceFile(filename, languageVersion);
    if (!file) console.log("file not found: " + filename);
    return file;
    ``;
  };
  host.resolveModuleNames = (moduleNames) => {
    return moduleNames.map((x) =>
      x === "@winglang/sdk" ? { resolvedFileName: "winglang.d.ts" } : undefined
    );
  };
  const program = ts.createProgram(["fake.ts"], compilerOptions, host);
  const typeChecker = program.getTypeChecker();
  return { sourceFile, typeChecker, program };
};
