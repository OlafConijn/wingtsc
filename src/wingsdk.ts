export const libraryDefinitionAsString = `
declare module '@winglang/sdk' {
    export * as cloud from "@winglang/sdk/cloud";
    export * as core from "@winglang/sdk/core";
    export * as fs from "@winglang/sdk/fs";
    export * as std from "@winglang/sdk/std";
    export * as sim from "@winglang/sdk/target-sim";
    export * as tfaws from "@winglang/sdk/target-tf-aws";
    export * as tfazure from "@winglang/sdk/target-tf-azure";
    export * as tfgcp from "@winglang/sdk/target-tf-gcp";
    export * as testing from "@winglang/sdk/testing";
}

declare module '@winglang/sdk/cloud' {
    export * from "@winglang/sdk/cloud/bucket";
    export * from "@winglang/sdk/cloud/counter";
    export * from "@winglang/sdk/cloud/function";
    export * from "@winglang/sdk/cloud/logger";
    export * from "@winglang/sdk/cloud/queue";
    export * from "@winglang/sdk/cloud/topic";
}

declare module '@winglang/sdk/core' {
    export * from "@winglang/sdk/core/app";
    export * from "@winglang/sdk/core/attributes";
    export * from "@winglang/sdk/core/dependency";
    export * from "@winglang/sdk/core/file-base";
    export * from "@winglang/sdk/core/files";
    export * from "@winglang/sdk/core/inflight";
    export * from "@winglang/sdk/core/resource";
    export * from "@winglang/sdk/core/tree";
}

declare module '@winglang/sdk/fs' {
    export * from "@winglang/sdk/fs/json-file";
    export * from "@winglang/sdk/fs/text-file";
}

declare module '@winglang/sdk/std' {
    export * from "@winglang/sdk/std/array";
    export * from "@winglang/sdk/std/duration";
    export * from "@winglang/sdk/std/map";
    export * from "@winglang/sdk/std/set";
    export * from "@winglang/sdk/std/string";
    export * from "@winglang/sdk/std/util";
}

declare module '@winglang/sdk/target-sim' {
    export * from "@winglang/sdk/target-sim/app";
    export * from "@winglang/sdk/target-sim/bucket";
    export * from "@winglang/sdk/target-sim/counter";
    export * from "@winglang/sdk/target-sim/factory";
    export * from "@winglang/sdk/target-sim/function";
    export * from "@winglang/sdk/target-sim/logger";
    export * from "@winglang/sdk/target-sim/queue";
    export * from "@winglang/sdk/target-sim/resource";
    export * from "@winglang/sdk/target-sim/schema";
    export * from "@winglang/sdk/target-sim/topic";
}

declare module '@winglang/sdk/target-tf-aws' {
    export * from "@winglang/sdk/target-tf-aws/app";
    export * from "@winglang/sdk/target-tf-aws/bucket";
    export * from "@winglang/sdk/target-tf-aws/counter";
    export * from "@winglang/sdk/target-tf-aws/factory";
    export * from "@winglang/sdk/target-tf-aws/function";
    export * from "@winglang/sdk/target-tf-aws/queue";
}

declare module '@winglang/sdk/target-tf-azure' {
    export * from "@winglang/sdk/target-tf-azure/app";
    export * from "@winglang/sdk/target-tf-azure/bucket";
    export * from "@winglang/sdk/target-tf-azure/factory";
    export * from "@winglang/sdk/target-tf-azure/function";
}

declare module '@winglang/sdk/target-tf-gcp' {
    export * from "@winglang/sdk/target-tf-gcp/app";
    export * from "@winglang/sdk/target-tf-gcp/bucket";
    export * from "@winglang/sdk/target-tf-gcp/factory";
    export * from "@winglang/sdk/target-tf-gcp/logger";
}

declare module '@winglang/sdk/testing' {
    export * from "@winglang/sdk/testing/sim-app";
    export * from "@winglang/sdk/testing/simulator";
    export * from "@winglang/sdk/testing/testing";
}

declare module '@winglang/sdk/cloud/bucket' {
    import { Construct } from "constructs";
    import { Code, Resource } from "@winglang/sdk/core";
    /**
        * Global identifier for "Bucket".
        */
    export const BUCKET_TYPE = "wingsdk.cloud.Bucket";
    /**
        * Properties for "Bucket".
        */
    export interface BucketProps {
            /**
                * Whether the bucket's objects should be publicly accessible.
                * @default false
                */
            readonly public?: boolean;
    }
    /**
        * Functionality shared between all "Bucket" implementations.
        */
    export abstract class BucketBase extends Resource {
            readonly stateful = true;
            constructor(scope: Construct, id: string, props: BucketProps);
            /**
                * Add a file to the bucket that is uploaded when the app is deployed.
                *
                * TODO: In the future this will support uploading any "Blob" type or
                * referencing a file from the local filesystem.
                */
            abstract addObject(key: string, body: string): void;
    }
    /**
        * Represents a cloud object store.
        *
        * @inflight "@winglang/sdk.cloud.IBucketClient"
        */
    export class Bucket extends BucketBase {
            constructor(scope: Construct, id: string, props?: BucketProps);
            /** @internal */
            _toInflight(): Code;
            addObject(key: string, body: string): void;
    }
    /** Interface for delete method inside "Bucket" */
    export interface BucketDeleteOptions {
            /**
                * Check failures on the method and retrieve errors if any
                * @Throws if this is "true", an error is thrown if the file is not found (or any error case).
                * @default false
                */
            readonly mustExist?: boolean;
    }
    /**
        * Inflight interface for "Bucket".
        */
    export interface IBucketClient {
            /**
                * Put an object in the bucket.
                * @param key Key of the object.
                * @param body Content of the object we want to store into the bucket.
                * @inflight
                */
            put(key: string, body: string): Promise<void>;
            /**
                * Retrieve an object from the bucket.
                * @param key Key of the object.
                * @Throws if no object with the given key exists.
                * @Returns the object's body.
                * @inflight
                */
            get(key: string): Promise<string>;
            /**
                * Retrieve existing objects keys from the bucket.
                * @param prefix Limits the response to keys that begin with the specified prefix.
                * @returns a list of keys or an empty array if the bucket is empty.
                * @inflight
                */
            list(prefix?: string): Promise<string[]>;
            /**
                * Delete an existing object using a key from the bucket
                * @param key Key of the object.
                * @param opts Options available for delete an item from a bucket.
                * @inflight
                */
            delete(key: string, opts?: BucketDeleteOptions): Promise<void>;
    }
    /**
        * List of inflight operations available for "Bucket".
        * @internal
        */
    export enum BucketInflightMethods {
            /** "Bucket.put" */
            PUT = "put",
            /** "Bucket.get" */
            GET = "get",
            /** "Bucket.list" */
            LIST = "list",
            /** "Bucket.delete" */
            DELETE = "delete"
    }
}

declare module '@winglang/sdk/cloud/counter' {
    import { Construct } from "constructs";
    import { Code, Resource } from "@winglang/sdk/core";
    /**
        * Global identifier for "Counter".
        */
    export const COUNTER_TYPE = "wingsdk.cloud.Counter";
    /**
        * Properties for "Counter".
        */
    export interface CounterProps {
            /**
                * The initial value of the counter.
                * @default 0
                */
            readonly initial?: number;
    }
    /**
        * Functionality shared between all "Counter" implementations.
        */
    export abstract class CounterBase extends Resource {
            readonly stateful = true;
            /**
                * The initial value of the counter.
                */
            readonly initial: number;
            constructor(scope: Construct, id: string, props?: CounterProps);
    }
    /**
        * Represents a distributed atomic counter.
        *
        * @inflight "@winglang/sdk.cloud.ICounterClient"
        */
    export class Counter extends CounterBase {
            constructor(scope: Construct, id: string, props?: CounterProps);
            /** @internal */
            _toInflight(): Code;
    }
    /**
        * Inflight interface for "Counter".
        */
    export interface ICounterClient {
            /**
                * Increments the counter atomically by a certain amount and returns the previous value.
                * @param amount amount to increment (default is 1).
                * @returns the previous value of the counter.
                * @inflight
                */
            inc(amount?: number): Promise<number>;
            /**
                * Decrement the counter, returning the previous value.
                * @param amount amount to decrement (default is 1).
                * @returns the previous value of the counter.
                * @inflight
                */
            dec(amount?: number): Promise<number>;
            /**
                * Get the current value of the counter.
                * Using this API may introduce race conditions since the value can change between
                * the time it is read and the time it is used in your code.
                * @returns current value
                * @inflight
                */
            peek(): Promise<number>;
    }
    /**
        * Functionality shared between all "CounterClient" implementations regardless of the target.
        */
    export abstract class CounterClientBase implements ICounterClient {
            inc(amount?: number): Promise<number>;
            dec(amount?: number): Promise<number>;
            peek(): Promise<number>;
    }
    /**
        * List of inflight operations available for "Counter".
        * @internal
        */
    export enum CounterInflightMethods {
            /** "Counter.inc" */
            INC = "inc",
            /** "Counter.dec" */
            DEC = "dec",
            /** "Counter.peek" */
            PEEK = "peek"
    }
}

declare module '@winglang/sdk/cloud/function' {
    import { Construct } from "constructs";
    import { Code, IInflightHost, IResource, Inflight, Resource } from "@winglang/sdk/core";
    import { Duration } from "@winglang/sdk/std";
    /**
        * Global identifier for "Function".
        */
    export const FUNCTION_TYPE = "wingsdk.cloud.Function";
    /**
        * Properties for "Function".
        *
        * This is the type users see when constructing a cloud.Function instance.
        */
    export interface FunctionProps {
            /**
                * Environment variables to pass to the function.
                * @default - No environment variables.
                */
            readonly env?: {
                    [key: string]: string;
            };
            /**
                * The maximum amount of time the function can run.
                * @default 1m
                */
            readonly timeout?: Duration;
    }
    /**
        * Functionality shared between all "Function" implementations.
        */
    export abstract class FunctionBase extends Resource implements IInflightHost {
            readonly stateful = false;
            /**
                * The path to the file asset that contains the handler code.
                */
            protected readonly assetPath: string;
            constructor(scope: Construct, id: string, inflight: Inflight, props: FunctionProps);
            /**
                * Add an environment variable to the function.
                */
            addEnvironment(name: string, value: string): void;
            /**
                * Returns the set of environment variables for this function.
                */
            get env(): Record<string, string>;
    }
    /**
        * Represents a function.
        *
        * @inflight "@winglang/sdk.cloud.IFunctionClient"
        */
    export class Function extends FunctionBase {
            constructor(scope: Construct, id: string, inflight: Inflight, props?: FunctionProps);
            addEnvironment(_key: string, _value: string): void;
            /** @internal */
            _toInflight(): Code;
    }
    /**
        * Inflight interface for "Function".
        */
    export interface IFunctionClient {
            /**
                * Invoke the function asynchronously with a given payload.
                * @inflight
                */
            invoke(payload: string): Promise<string>;
    }
    /**
        * Represents a resource with an inflight "handle" method that can be used to
        * create a "cloud.Function".
        *
        * @inflight "wingsdk.cloud.IFunctionHandlerClient"
        */
    export interface IFunctionHandler extends IResource {
    }
    /**
        * Inflight client for "IFunctionHandler".
        */
    export interface IFunctionHandlerClient {
            /**
                * Entrypoint function that will be called when the cloud function is invoked.
                * @inflight
                */
            handle(event: string): Promise<void>;
    }
    /**
        * List of inflight operations available for "Function".
        * @internal
        */
    export enum FunctionInflightMethods {
            /** "Function.invoke" */
            INVOKE = "invoke"
    }
}

declare module '@winglang/sdk/cloud/logger' {
    import { Construct, IConstruct } from "constructs";
    import { Code } from "@winglang/sdk/core/inflight";
    import { Resource } from "@winglang/sdk/core/resource";
    export const LOGGER_TYPE = "wingsdk.cloud.Logger";
    export const LOGGER_SYMBOL: unique symbol;
    /**
        * Functionality shared between all "Logger" implementations.
        */
    export abstract class LoggerBase extends Resource {
            readonly stateful = true;
            constructor(scope: Construct, id: string);
            /**
                * Logs a message (preflight).
                * @param message The message to log.
                */
            print(message: string): void;
    }
    /**
        * A cloud logging facility.
        *
        * @inflight "@winglang/sdk.cloud.ILoggerClient"
        */
    export class Logger extends LoggerBase {
            /**
                * Returns the logger registered to the given scope, throwing an error if
                * there is none.
                */
            static of(scope: IConstruct): Logger;
            /**
                * Create a logger and register it to the given scope.
                */
            static register(scope: IConstruct): void;
            /** @internal */
            _toInflight(): Code;
    }
    /**
        * Inflight interface for "Logger".
        */
    export interface ILoggerClient {
            /**
                * Logs a message. The log will be associated with whichever resource is
                * running the inflight code.
                *
                * NOTICE: this is not an async function because it is wrapped by "console.log()".
                *
                * @param message The message to print
                * @inflight
                */
            print(message: string): void;
    }
    /**
        * List of inflight operations available for "Logger".
        * @internal
        */
    export enum LoggerInflightMethods {
            /** "Logger.print" */
            PRINT = "print"
    }
}

declare module '@winglang/sdk/cloud/queue' {
    import { Construct } from "constructs";
    import { Function, FunctionProps } from "@winglang/sdk/cloud/function";
    import { Code, IResource, Inflight, Resource } from "@winglang/sdk/core";
    import { Duration } from "@winglang/sdk/std";
    /**
        * Global identifier for "Queue".
        */
    export const QUEUE_TYPE = "wingsdk.cloud.Queue";
    /**
        * Properties for "Queue".
        */
    export interface QueueProps {
            /**
                * How long a queue's consumers have to process a message.
                * @default Duration.fromSeconds(10)
                */
            readonly timeout?: Duration;
            /**
                * Initialize the queue with a set of messages.
                * @default []
                */
            readonly initialMessages?: string[];
    }
    /**
        * Functionality shared between all "Queue" implementations.
        */
    export abstract class QueueBase extends Resource {
            readonly stateful = true;
            constructor(scope: Construct, id: string, props?: QueueProps);
            /**
                * Create a function to consume messages from this queue.
                */
            abstract onMessage(inflight: Inflight, props?: QueueOnMessageProps): Function;
    }
    /**
        * Options for Queue.onMessage.
        */
    export interface QueueOnMessageProps extends FunctionProps {
            /**
                * The maximum number of messages to send to subscribers at once.
                * @default 1
                */
            readonly batchSize?: number;
    }
    /**
        * Represents a queue.
        *
        * @inflight "@winglang/sdk.cloud.IQueueClient"
        */
    export class Queue extends QueueBase {
            constructor(scope: Construct, id: string, props?: QueueProps);
            onMessage(inflight: Inflight, props?: QueueOnMessageProps): Function;
            /** @internal */
            _toInflight(): Code;
    }
    /**
        * Inflight interface for "Queue".
        */
    export interface IQueueClient {
            /**
                * Push a message to the queue.
                * @param message Payload to send to the queue.
                * @inflight
                */
            push(message: string): Promise<void>;
            /**
                * Purge all of the messages in the queue.
                * @inflight
                */
            purge(): Promise<void>;
            /**
                * Retrieve the approximate number of messages in the queue.
                * @inflight
                */
            approxSize(): Promise<number>;
    }
    /**
        * Represents a resource with an inflight "handle" method that can be passed to
        * "Queue.on_message".
        *
        * @inflight "wingsdk.cloud.IQueueOnMessageHandlerClient"
        */
    export interface IQueueOnMessageHandler extends IResource {
    }
    /**
        * Inflight client for "IQueueOnMessageHandler".
        */
    export interface IQueueOnMessageHandlerClient {
            /**
                * Function that will be called when a message is received from the queue.
                * @inflight
                */
            handle(message: string): Promise<void>;
    }
    /**
        * List of inflight operations available for "Queue".
        * @internal
        */
    export enum QueueInflightMethods {
            /** "Queue.push" */
            PUSH = "push",
            /** "Queue.purge" */
            PURGE = "purge",
            /** "Queue.approxSize" */
            APPROX_SIZE = "approx_size"
    }
}

declare module '@winglang/sdk/cloud/topic' {
    import { Construct } from "constructs";
    import { Function } from "@winglang/sdk/cloud/function";
    import { Code, IResource, Inflight, Resource } from "@winglang/sdk/core";
    export const TOPIC_TYPE = "wingsdk.cloud.Topic";
    /**
        * Properties for "Topic".
        */
    export interface TopicProps {
    }
    /**
        * Topic base class
        */
    export abstract class TopicBase extends Resource {
            readonly stateful = true;
            constructor(scope: Construct, id: string, props?: TopicProps);
            /**
                * Run an inflight whenever an message is published to the topic.
                */
            abstract onMessage(inflight: Inflight, props?: TopicOnMessageProps): Function;
    }
    /**
        * Options for "Topic.onMessage".
        */
    export interface TopicOnMessageProps {
    }
    /**
        * Represents a topic.
        *
        * @inflight "@winglang/sdk.cloud.ITopicClient"
        */
    export class Topic extends TopicBase {
            constructor(scope: Construct, id: string, props?: TopicProps);
            onMessage(inflight: Inflight, props?: TopicOnMessageProps): Function;
            /** @internal */
            _toInflight(): Code;
    }
    /**
        * Inflight interface for "Topic".
        */
    export interface ITopicClient {
            /**
                * Publish message to topic
                * @param message Payload to publish to Topic
                * @inflight
                */
            publish(message: string): Promise<void>;
    }
    /**
        * Represents a resource with an inflight "handle" method that can be passed to
        * "Topic.on_message".
        *
        * @inflight "wingsdk.cloud.ITopicOnMessageHandlerClient"
        */
    export interface ITopicOnMessageHandler extends IResource {
    }
    /**
        * Inflight client for "ITopicOnMessageHandler".
        */
    export interface ITopicOnMessageHandlerClient {
            /**
                * Function that will be called when a message is received from the topic.
                * @inflight
                */
            handle(event: string): Promise<void>;
    }
    /**
        * List of inflight operations available for "Topic".
        * @internal
        */
    export enum TopicInflightMethods {
            /** "Topic.publish" */
            PUBLISH = "publish"
    }
}

declare module '@winglang/sdk/core/app' {
    import { Construct, IConstruct } from "constructs";
    import { IPolyconFactory } from "polycons";
    /**
        * A Wing application.
        */
    export interface IApp extends IConstruct {
            /**
                * Directory where artifacts are synthesized to.
                */
            readonly outdir: string;
            /**
                * Synthesize the app into an artifact.
                */
            synth(): string;
    }
    /**
        * Props for all "App" classes.
        */
    export interface AppProps {
            /**
                * Directory where artifacts are synthesized to.
                * @default - current working directory
                */
            readonly outdir?: string;
            /**
                * The name of the app.
                * @default "app"
                */
            readonly name?: string;
            /**
                * The path to a state file which will track all synthesized files. If a
                * statefile is not specified, we won't be able to remove extrenous files.
                * @default - no state file
                */
            readonly stateFile?: string;
            /**
                * A custom factory to resolve polycons.
                * @default - use the default polycon factory included in the Wing SDK
                */
            readonly customFactory?: IPolyconFactory;
    }
    /**
        * An app that knows how to synthesize constructs into Terraform configuration
        * using cdktf. No polycon factory or Terraform providers are included.
        */
    export class CdktfApp extends Construct implements IApp {
            /**
                * Directory where artifacts are synthesized to.
                */
            readonly outdir: string;
            constructor(props: AppProps);
            /**
                * Synthesize the app into Terraform configuration in a "cdktf.out" directory.
                *
                * This method returns a cleaned snapshot of the resulting Terraform manifest
                * for unit testing.
                */
            synth(): string;
    }
}

declare module '@winglang/sdk/core/attributes' {
    export const WING_ATTRIBUTE_RESOURCE_STATEFUL = "wing:resource:stateful";
    export const WING_ATTRIBUTE_RESOURCE_CONNECTIONS = "wing:resource:connections";
}

declare module '@winglang/sdk/core/dependency' {
    import { Node, IConstruct } from "constructs";
    /**
        * Represents the dependency graph for a given Node.
        *
        * This graph includes the dependency relationships between all nodes in the
        * node (construct) sub-tree who's root is this Node.
        *
        * Note that this means that lonely nodes (no dependencies and no dependants) are also included in this graph as
        * childless children of the root node of the graph.
        *
        * The graph does not include cross-scope dependencies. That is, if a child on the current scope depends on a node
        * from a different scope, that relationship is not represented in this graph.
        *
        */
    export class DependencyGraph {
            constructor(node: Node);
            /**
                * Returns the root of the graph.
                *
                * Note that this vertex will always have "null" as its ".value" since it is an artifical root
                * that binds all the connected spaces of the graph.
                */
            get root(): DependencyVertex;
            /**
                * Returns a topologically sorted array of the constructs in the sub-graph.
                */
            topology(): IConstruct[];
    }
    /**
        * Represents a vertex in the graph.
        *
        * The value of each vertex is an "IConstruct" that is accessible via the ".value" getter.
        */
    export class DependencyVertex {
            constructor(value?: IConstruct | undefined);
            /**
                * Returns the IConstruct this graph vertex represents.
                *
                * "null" in case this is the root of the graph.
                */
            get value(): IConstruct | undefined;
            /**
                * Returns the children of the vertex (i.e dependencies)
                */
            get outbound(): Array<DependencyVertex>;
            /**
                * Returns the parents of the vertex (i.e dependants)
                */
            get inbound(): Array<DependencyVertex>;
            /**
                * Returns a topologically sorted array of the constructs in the sub-graph.
                */
            topology(): IConstruct[];
            /**
                * Adds a vertex as a dependency of the current node.
                * Also updates the parents of "dep", so that it contains this node as a parent.
                *
                * This operation will fail in case it creates a cycle in the graph.
                *
                * @param dep The dependency
                */
            addChild(dep: DependencyVertex): void;
    }
}

declare module '@winglang/sdk/core/file-base' {
    import { Construct } from "constructs";
    /**
        * Represents a file to be synthesized in the app's output directory.
        */
    export abstract class FileBase extends Construct {
            /**
                * The file's relative path to the output directory.
                */
            readonly filePath: string;
            /**
                * Defines a file
                * @param scope construct scope
                * @param id construct id
                * @param filePath relative file path
                * @param props initialization props
                */
            constructor(scope: Construct, id: string, filePath: string);
            /**
                * Render the contents of the file and save it to the user's file system.
                */
            save(outdir: string): void;
            /**
                * Returns the contents of the file to save.
                */
            protected abstract render(): string;
    }
}

declare module '@winglang/sdk/core/files' {
    import { IApp } from "@winglang/sdk/core/app";
    /**
        * Props for "Files".
        */
    export interface FilesProps {
            /**
                * The app with files to synthesize.
                */
            readonly app: IApp;
            /**
                * The path to a state file which will track all synthesized files. If a
                * statefile is not specified, we won't be able to remove extrenous files.
                * @default - no state file
                */
            readonly stateFile?: string;
    }
    /**
        * Handles the synthesis of files.
        */
    export class Files {
            /**
                * The path to a state file which will track all synthesized files.
                */
            readonly stateFile?: string;
            constructor(props: FilesProps);
            /**
                * Synthesize the app into the output directory. The artifact produced
                * depends on what synthesizer was used.
                *
                * @param outdir The output directory, if not specified, the app's outdir will be used.
                */
            synth(outdir?: string): void;
    }
}

declare module '@winglang/sdk/core/inflight' {
    import { Construct } from "constructs";
    import { Connection, Display, IInflightHost, IResource } from "@winglang/sdk/core/resource";
    import { TreeInspector } from "@winglang/sdk/core/tree";
    /**
        * Reference to a piece of code.
        */
    export abstract class Code {
            /**
                * The language of the code.
                */
            abstract readonly language: Language;
            /**
                * A path to the code in the user's file system that can be referenced
                * for bundling purposes.
                */
            abstract readonly path: string;
            /**
                * The code contents.
                */
            get text(): string;
            /**
                * Generate a hash of the code contents.
                */
            get hash(): string;
    }
    /**
        * The language of a piece of code.
        */
    export enum Language {
            /** Node.js */
            NODE_JS = "nodejs"
    }
    /**
        * Reference to a piece of Node.js code.
        */
    export class NodeJsCode extends Code {
            /**
                * Reference code from a file path.
                */
            static fromFile(path: string): NodeJsCode;
            /**
                * Reference code directly from a string.
                */
            static fromInline(text: string): NodeJsCode;
            readonly language = Language.NODE_JS;
            readonly path: string;
    }
    /**
        * Props for "Inflight".
        */
    export interface InflightProps {
            /**
                * Reference to the inflight code. Only JavaScript code is currently
                * supported.
                *
                * The JavaScript code needs be in the form "async handle(event) { ... }", and
                * all references to resources must be made through "this.<resource>".
                */
            readonly code: Code;
            /**
                * Data and resource binding information.
                * @default - no bindings
                */
            readonly bindings?: InflightBindings;
    }
    /**
        * Represents a unit of application code that can be executed by a cloud
        * resource. In practice, it's a resource with one inflight method named
        * "handle".
        */
    export class Inflight extends Construct implements IResource {
            /** @internal */
            _connections: Connection[];
            /**
                * Information on how to display a resource in the UI.
                */
            readonly display: Display;
            constructor(scope: Construct, id: string, props: InflightProps);
            /** @internal */
            _bind(_host: IInflightHost, _ops: string[]): void;
            /** @internal */
            _toInflight(): Code;
            /** @internal */
            _inspect(_inspector: TreeInspector): void;
    }
    /**
        * A resource binding.
        */
    export interface InflightResourceBinding {
            /**
                * The resource.
                */
            readonly resource: IResource;
            /**
                * The list of operations used on the resource.
                */
            readonly ops: string[];
    }
    /**
        * Inflight bindings.
        */
    export interface InflightBindings {
            /**
                * Resources being referenced by the inflight (key is the symbol).
                */
            readonly resources?: Record<string, InflightResourceBinding>;
            /**
                * Immutable data being referenced by the inflight (key is the symbol);
                */
            readonly data?: Record<string, any>;
    }
    /**
        * Utility class with functions about inflight clients.
        */
    export class InflightClient {
            /**
                * Creates a "Code" instance with code for creating an inflight client.
                */
            static for(filename: string, clientClass: string, args: string[]): Code;
    }
}

declare module '@winglang/sdk/core/resource' {
    import { Construct, IConstruct } from "constructs";
    import { Code } from "@winglang/sdk/core/inflight";
    import { IInspectable, TreeInspector } from "@winglang/sdk/core/tree";
    /**
        * A resource that can run inflight code.
        */
    export interface IInflightHost extends IResource {
    }
    /**
        * Abstract interface for "Resource".
        */
    export interface IResource extends IInspectable, IConstruct {
            /**
                * List of inbound and outbound connections to other resources.
                * @internal
                */
            _connections: Connection[];
            /**
                * Information on how to display a resource in the UI.
                */
            readonly display: Display;
            /**
                * Binds the resource to the host so that it can be used by inflight code.
                *
                * If the resource does not support any of the operations, it should throw an
                * error.
                *
                * @internal
                */
            _bind(host: IInflightHost, ops: string[]): void;
            /**
                * Return a code snippet that can be used to reference this resource inflight.
                * @internal
                */
            _toInflight(): Code;
    }
    /**
        * Shared behavior between all Wing SDK resources.
        */
    export abstract class Resource extends Construct implements IInspectable, IResource {
            /**
                * Adds a connection between two resources. A connection is a piece of
                * metadata describing how one resource is related to another resource. This
                * metadata is recorded in the tree.json file.
                *
                * @experimental
                */
            static addConnection(props: AddConnectionProps): void;
            /**
                * Annotate a class with with metadata about what operations it supports
                * inflight, and what sub-resources each operation requires access to.
                *
                * For example if "MyBucket" has a "fancy_get" method that calls "get" on an
                * underlying "cloud.Bucket", then it would be annotated as follows:
                * """
                * MyBucket._annotateInflight("fancy_get", {
                *  "this.bucket": { ops: ["get"] }
                * });
                * """
                *
                * The Wing compiler will automatically generate the correct annotations by
                * scanning the source code, but in the Wing SDK we have to add them manually.
                *
                * @internal
                */
            static _annotateInflight(op: string, annotation: OperationAnnotation): void;
            /** @internal */
            readonly _connections: Connection[];
            /**
                * Information on how to display a resource in the UI.
                */
            readonly display: Display;
            /**
                * Whether a resource is stateful, i.e. it stores information that is not
                * defined by your application.
                *
                * A non-stateful resource does not remember information about past
                * transactions or events, and can typically be replaced by a cloud provider
                * with a fresh copy without any consequences.
                */
            abstract readonly stateful: boolean;
            /**
                * Binds the resource to the host so that it can be used by inflight code.
                *
                * You can override this method to perform additional logic like granting
                * IAM permissions to the host based on what methods are being called. But
                * you must call "super._bind(host, ops)" to ensure that the resource is
                * actually bound.
                *
                * @internal
                */
            _bind(host: IInflightHost, ops: string[]): void;
            /**
                * Return a code snippet that can be used to reference this resource inflight.
                *
                * TODO: support passing an InflightRuntime enum to indicate which language
                * runtime we're targeting.
                *
                * @internal
                */
            abstract _toInflight(): Code;
            /**
                * @internal
                */
            _inspect(inspector: TreeInspector): void;
    }
    /**
        * The direction of a connection.
        *
        * Visually speaking, if a resource A has an outbound connection with resource B,
        * the arrow would point from A to B, and vice versa for inbound connections.
        */
    export enum Direction {
            /**
                * Indicates that this resource calls, triggers, or references
                * the resource it is connected to.
                */
            OUTBOUND = "outbound",
            /**
                * Indicates that this resource is called, triggered, or referenced by
                * the resource it is connected to.
                */
            INBOUND = "inbound"
    }
    /**
        * Props for "Resource.addConnection".
        */
    export interface AddConnectionProps {
            /**
                * The resource creating the connection to "to".
                */
            readonly from: IResource;
            /**
                * The resource "from" is connecting to.
                */
            readonly to: IResource;
            /**
                * The type of relationship between the resources.
                */
            readonly relationship: string;
            /**
                * Whether the relationship is implicit, i.e. it is not explicitly
                * defined by the user.
                * @default false
                */
            readonly implicit?: boolean;
    }
    /**
        * A connection between two resources.
        */
    export interface Connection {
            /**
                * The resource this connection is to.
                */
            readonly resource: IResource;
            /**
                * The type of relationship with the resource.
                */
            readonly relationship: string;
            /**
                * The direction of the connection.
                */
            readonly direction: Direction;
            /**
                * Whether the relationship is implicit, i.e. it is not explicitly
                * defined by the user.
                */
            readonly implicit: boolean;
    }
    /**
        * Annotations about what resources an inflight operation may access.
        *
        * The following example says that the operation may call "put" on a resource
        * at "this.inner", or it may call "get" on a resource passed as an argument named
        * "other".
        * @example
        * { "this.inner": { ops: ["put"] }, "other": { ops: ["get"] } }
        */
    export interface OperationAnnotation {
            [resource: string]: {
                    ops: string[];
            };
    }
    /**
        * Properties for the Display class.
        */
    export interface DisplayProps {
            /**
                * Title of the resource.
                * @default - No title.
                */
            readonly title?: string;
            /**
                * Description of the resource.
                * @default - No description.
                */
            readonly description?: string;
            /**
                * Whether the resource should be hidden from the UI.
                * @default - Undefined
                */
            readonly hidden?: boolean;
    }
    /**
        * Information on how to display a resource in the UI.
        */
    export class Display {
            /**
                * Title of the resource.
                */
            title?: string;
            /**
                * Description of the resource.
                */
            description?: string;
            /**
                * Whether the resource should be hidden from the UI.
                */
            hidden?: boolean;
            constructor(props?: DisplayProps);
    }
}

declare module '@winglang/sdk/core/tree' {
    import { IApp } from "@winglang/sdk/core/app";
    /**
        * A node in the construct tree.
        */
    export interface ConstructTreeNode {
            /**
                * The ID of the node. Is part of the "path".
                */
            readonly id: string;
            /**
                * The path of the node.
                */
            readonly path: string;
            /**
                * The child nodes.
                */
            readonly children?: {
                    [key: string]: ConstructTreeNode;
            };
            /**
                * The node attributes.
                */
            readonly attributes?: {
                    [key: string]: any;
            };
            /**
                * Information on the construct class that led to this node, if available.
                */
            readonly constructInfo?: ConstructInfo;
            /**
                * Information on how to display this node in the UI.
                */
            readonly display?: DisplayInfo;
    }
    /**
        * Information on how to display a construct in the UI.
        */
    export interface DisplayInfo {
            /**
                * Title of the resource.
                * @default - The type and/or identifier of the resource
                */
            readonly title?: string;
            /**
                * Description of the resource.
                * @default - No description
                */
            readonly description?: string;
            /**
                * Whether the resource should be hidden from the UI.
                * @default false (visible)
                */
            readonly hidden?: boolean;
    }
    /**
        * The construct tree.
        */
    export interface ConstructTree {
            /**
                * The construct tree version.
                */
            readonly version: string;
            /**
                * The root node.
                */
            readonly tree: ConstructTreeNode;
    }
    /**
        * Source information on a construct (class fqn and version).
        */
    export interface ConstructInfo {
            /**
                * Fully qualified class name.
                */
            readonly fqn: string;
            /**
                * Version of the module.
                */
            readonly version: string;
    }
    export function synthesizeTree(app: IApp): void;
    /**
        * Inspector that maintains an attribute bag
        */
    export class TreeInspector {
            /**
                * Represents the bag of attributes as key-value pairs.
                */
            readonly attributes: {
                    [key: string]: any;
            };
            /**
                * Adds attribute to bag.
                *
                * @param key - key for metadata
                * @param value - value of metadata.
                */
            addAttribute(key: string, value: any): void;
    }
    /**
        * Interface for examining a construct and exposing metadata.
        */
    export interface IInspectable {
            /**
                * Examines construct
                *
                * @param inspector - tree inspector to collect and process attributes
                *
                * @internal
                */
            _inspect(inspector: TreeInspector): void;
    }
}

declare module '@winglang/sdk/fs/json-file' {
    import { Construct } from "constructs";
    import { FileBase } from "@winglang/sdk/core";
    /**
        * Props for "JsonFile".
        */
    export interface JsonFileProps {
            /**
                * The object that will be serialized into the file during synthesis.
                */
            readonly obj: any;
    }
    /**
        * Represents a text file that should be synthesized in the app's outdir.
        */
    export class JsonFile extends FileBase {
            constructor(scope: Construct, id: string, filePath: string, props: JsonFileProps);
            protected render(): string;
    }
}

declare module '@winglang/sdk/fs/text-file' {
    import { Construct } from "constructs";
    import { FileBase } from "@winglang/sdk/core";
    /**
        * Props for "TextFile".
        */
    export interface TextFileProps {
            /**
                * The lines of text that will be serialized into the file during synthesis.
                * They will be joined with newline characters.
                *
                * @default []
                */
            readonly lines?: string[];
    }
    /**
        * Represents a text file that should be synthesized in the app's outdir.
        */
    export class TextFile extends FileBase {
            constructor(scope: Construct, id: string, filePath: string, props?: TextFileProps);
            /**
                * Append a line to the text file's contents.
                */
            addLine(line: string): void;
            protected render(): string;
    }
}

declare module '@winglang/sdk/std/array' {
    import { T1 } from "@winglang/sdk/std/util";
    /**
        * Immutable Array
        *
        * @typeparam T1
        */
    export class ImmutableArray {
            /**
                * The length of the array
                * @returns the length of the array
                */
            get length(): number;
            /**
                * Get the value at the given index
                * @param index index of the value to get
                * @returns the value at the given index
                */
            at(index: number): T1;
    }
    /**
        * Mutable Array
        *
        * @typeparam T1
        */
    export class MutableArray extends ImmutableArray {
            /**
                * Add value to end of array
                * @param value value to add
                */
            push(value: T1): void;
            /**
                * Remove value from end of array
                * @returns the value removed
                */
            pop(): T1;
    }
}

declare module '@winglang/sdk/std/duration' {
    /**
        * Represents a length of time.
        */
    export class Duration {
            /**
                * Create a Duration representing an amount of minutes
                *
                * @param amount the amount of Minutes the "Duration" will represent.
                * @returns a new "Duration" representing "amount" Minutes.
                */
            static fromMinutes(amount: number): Duration;
            /**
                * Create a Duration representing an amount of hours
                *
                * @param amount the amount of Hours the "Duration" will represent.
                * @returns a new "Duration" representing "amount" Hours.
                */
            static fromHours(amount: number): Duration;
            /**
                * Create a Duration representing an amount of seconds
                *
                * @param amount the amount of Seconds the "Duration" will represent.
                * @returns a new "Duration" representing "amount" Seconds.
                */
            static fromSeconds(amount: number): Duration;
            /**
                * Return the total number of seconds in this Duration
                *
                * @returns the value of this "Duration" expressed in Seconds.
                */
            readonly seconds: number;
            /**
                * Return the total number of minutes in this Duration
                *
                * @returns the value of this "Duration" expressed in Minutes.
                */
            get minutes(): number;
            /**
                * Return the total number of hours in this Duration
                *
                * @returns the value of this "Duration" expressed in Hours.
                */
            get hours(): number;
    }
}

declare module '@winglang/sdk/std/map' {
    import { T1 } from "@winglang/sdk/std/util";
    /**
        * Immutable Map
        *
        * @typeparam T1
        */
    export class ImmutableMap {
            /**
                * Returns the number of elements in the map.
                */
            get size(): number;
            /**
                * Returns a specified element from the map.
                *
                * If the value that is associated to the provided key is an object, then you will get a reference
                * to that object and any change made to that object will effectively modify it inside the map.
                *
                * @param key The key of the element to return.
                * @returns The element associated with the specified key, or undefined if the key can't be found
                */
            get(key: string): T1;
            /**
                * Returns a boolean indicating whether an element with the specified key exists or not.
                * @param key The key of the element to test for presence
                * @returns true if an element with the specified key exists in the map; otherwise false.
                */
            has(key: string): boolean;
    }
    /**
        * Mutable Map
        *
        * @typeparam T1
        */
    export class MutableMap extends ImmutableMap {
            /**
                * Removes all elements
                */
            clear(): void;
            /**
                * Removes the specified element from a map.
                * @param key The key
                * @returns true if the element was in the map
                */
            delete(key: string): boolean;
            /**
                * Adds or updates an entry in a Map object with a specified key and a value.
                * @param key The key of the element to add
                * @param value The value of the element to add
                */
            set(key: string, value: T1): void;
    }
}

declare module '@winglang/sdk/std/set' {
    import { T1 } from "@winglang/sdk/std/util";
    /**
        * Immutable Set
        *
        * @typeparam T1
        */
    export class ImmutableSet {
            /**
                * The length of the set
                * @returns the length of the set
                */
            get size(): number;
            /**
                * Returns a boolean indicating whether an element with the specified value exists in the set.
                * @param value The value to test for presence in the Set object.
                * @returns Returns "true" if an element with the specified value exists in the set; otherwise "false".
                */
            has(value: T1): boolean;
    }
    /**
        * Mutable Set
        *
        * @typeparam T1
        */
    export class MutableSet extends ImmutableSet {
            /**
                * Add value to set
                * @param value value to add
                * @returns true if the value was added, false if it was already in the set
                */
            add(value: T1): MutableSet;
            /**
                * The clear() method removes all elements from a set.
                */
            clear(): void;
            /**
                * Removes a specified value from a set, if it is in the set.
                * @param value The value to remove from the set.
                * @returns Returns "true" if "value" was already in the set; otherwise "false".
                */
            delete(value: T1): boolean;
    }
}

declare module '@winglang/sdk/std/string' {
    /**
        * String
        */
    export class String {
            /**
                * The length of the string
                */
            get length(): number;
            /**
                * Split string by separator
                *
                * @param separator separator to split by
                * @returns array of strings
                */
            split(separator: string): string[];
            /**
                * Check if string includes substring
                *
                * @macro $self$.includes($args$)
                *
                * @param searchString substring to search for
                * @returns true if string includes substring
                */
            contains(searchString: string): boolean;
    }
}

declare module '@winglang/sdk/std/util' {
    /**
      * Generic type argument. This type is replaced at compile time.
      *
      * @hidden
      */
    export class T1 {
    }
}

declare module '@winglang/sdk/target-sim/app' {
    import { Construct } from "constructs";
    import * as core from "@winglang/sdk/core";
    /**
        * A construct that knows how to synthesize simulator resources into a
        * Wing simulator (.wsim) file.
        */
    export class App extends Construct implements core.IApp {
            /**
                * Directory where artifacts are synthesized to.
                */
            readonly outdir: string;
            constructor(props: core.AppProps);
            /**
                * Synthesize the app. This creates a tree.json file and a .wsim file in the
                * app's outdir, and returns a path to the .wsim file.
                */
            synth(): string;
    }
}

declare module '@winglang/sdk/target-sim/bucket' {
    import { Construct } from "constructs";
    import { ISimulatorResource } from "@winglang/sdk/target-sim/resource";
    import { BaseResourceSchema } from "@winglang/sdk/target-sim/schema";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    /**
      * Simulator implementation of "cloud.Bucket".
      *
      * @inflight "@winglang/sdk.cloud.IBucketClient"
      */
    export class Bucket extends cloud.BucketBase implements ISimulatorResource {
        constructor(scope: Construct, id: string, props: cloud.BucketProps);
        addObject(key: string, body: string): void;
        toSimulator(): BaseResourceSchema;
        /** @internal */
        _bind(host: core.IInflightHost, ops: string[]): void;
        /** @internal */
        _toInflight(): core.Code;
    }
}

declare module '@winglang/sdk/target-sim/counter' {
    import { Construct } from "constructs";
    import { ISimulatorResource } from "@winglang/sdk/target-sim/resource";
    import { BaseResourceSchema } from "@winglang/sdk/target-sim/schema";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    /**
      * Simulator implementation of "cloud.Counter".
      *
      * @inflight "@winglang/sdk.cloud.ICounterClient"
      */
    export class Counter extends cloud.CounterBase implements ISimulatorResource {
        readonly initial: number;
        constructor(scope: Construct, id: string, props?: cloud.CounterProps);
        toSimulator(): BaseResourceSchema;
        /** @internal */
        _bind(host: core.IInflightHost, ops: string[]): void;
        /** @internal */
        _toInflight(): core.Code;
    }
}

declare module '@winglang/sdk/target-sim/factory' {
    import { IConstruct } from "constructs";
    import { IPolyconFactory } from "polycons";
    /**
      * Polycon factory which resolves polycons in "cloud" into preflight resources
      * for the simulator target.
      */
    export class PolyconFactory implements IPolyconFactory {
        resolve(polyconId: string, scope: IConstruct, id: string, ...args: any[]): IConstruct;
    }
}

declare module '@winglang/sdk/target-sim/function' {
    import { Construct } from "constructs";
    import { ISimulatorResource } from "@winglang/sdk/target-sim/resource";
    import { BaseResourceSchema } from "@winglang/sdk/target-sim/schema";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    export const ENV_WING_SIM_INFLIGHT_RESOURCE_PATH = "WING_SIM_INFLIGHT_RESOURCE_PATH";
    export const ENV_WING_SIM_INFLIGHT_RESOURCE_TYPE = "WING_SIM_INFLIGHT_RESOURCE_TYPE";
    /**
      * Simulator implementation of "cloud.Function".
      *
      * @inflight "@winglang/sdk.cloud.IFunctionClient"
      */
    export class Function extends cloud.FunctionBase implements ISimulatorResource {
        constructor(scope: Construct, id: string, inflight: cloud.IFunctionHandler, props: cloud.FunctionProps);
        toSimulator(): BaseResourceSchema;
        /** @internal */
        _bind(host: core.IInflightHost, ops: string[]): void;
        /** @internal */
        _toInflight(): core.Code;
    }
}

declare module '@winglang/sdk/target-sim/logger' {
    import { Construct } from "constructs";
    import { ISimulatorResource } from "@winglang/sdk/target-sim/resource";
    import { BaseResourceSchema } from "@winglang/sdk/target-sim/schema";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    /**
      * Simulator implementation of "cloud.Logger".
      *
      * @inflight "@winglang/sdk.cloud.ILoggerClient"
      */
    export class Logger extends cloud.LoggerBase implements ISimulatorResource {
        constructor(scope: Construct, id: string);
        toSimulator(): BaseResourceSchema;
        /** @internal */
        _bind(host: core.IInflightHost, ops: string[]): void;
        /** @internal */
        _toInflight(): core.Code;
    }
}

declare module '@winglang/sdk/target-sim/queue' {
    import { Construct } from "constructs";
    import { ISimulatorResource } from "@winglang/sdk/target-sim/resource";
    import { BaseResourceSchema } from "@winglang/sdk/target-sim/schema";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    /**
      * Simulator implementation of "cloud.Queue".
      *
      * @inflight "@winglang/sdk.cloud.IQueueClient"
      */
    export class Queue extends cloud.QueueBase implements ISimulatorResource {
        constructor(scope: Construct, id: string, props?: cloud.QueueProps);
        onMessage(inflight: core.Inflight, // cloud.IQueueOnMessageHandler
        props?: cloud.QueueOnMessageProps): cloud.Function;
        toSimulator(): BaseResourceSchema;
        /** @internal */
        _bind(host: core.IInflightHost, ops: string[]): void;
        /** @internal */
        _toInflight(): core.Code;
    }
}

declare module '@winglang/sdk/target-sim/resource' {
    import { IConstruct } from "constructs";
    import { BaseResourceSchema } from "@winglang/sdk/target-sim/schema";
    /**
        * Interfaces shared by all polycon implementations (preflight classes)
        * targeting the simulator.
        */
    export interface ISimulatorResource extends IConstruct {
            /**
                * Convert this resource to a resource schema for the simulator.
                */
            toSimulator(): BaseResourceSchema;
    }
    export function isSimulatorResource(obj: any): obj is ISimulatorResource;
    /**
        * Shared interface for resource simulations.
        */
    export interface ISimulatorResourceInstance {
            /**
                * Perform any async initialization required by the resource.
                */
            init(): Promise<void>;
            /**
                * Stop the resource and clean up any physical resources it may have created
                * (files, ports, etc).
                */
            cleanup(): Promise<void>;
    }
}

declare module '@winglang/sdk/target-sim/schema' {
    /** Schema for simulator.json */
    export interface WingSimulatorSchema {
        /** The list of resources. */
        readonly resources: BaseResourceSchema[];
        /** The version of the Wing SDK used to synthesize the .wsim file. */
        readonly sdkVersion: string;
    }
    /** Schema for individual resources */
    export interface BaseResourceSchema {
        /** The resource path from the app's construct tree. */
        readonly path: string;
        /** The type of the resource. */
        readonly type: string;
        /** The resource-specific properties needed to create this resource. */
        readonly props: {
            [key: string]: any;
        };
        /** The resource-specific attributes that are set after the resource is created. */
        readonly attrs: BaseResourceAttributes;
    }
    /** Schema for resource attributes */
    export interface BaseResourceAttributes {
        /** The resource's simulator-unique id. */
        readonly handle: string;
        /** Any other attributes. */
        [key: string]: unknown;
    }
}

declare module '@winglang/sdk/target-sim/topic' {
    import { Construct } from "constructs";
    import { ISimulatorResource } from "@winglang/sdk/target-sim/resource";
    import { BaseResourceSchema } from "@winglang/sdk/target-sim/schema";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    /**
      * Simulator implementation of "cloud.Topic"
      *
      * @inflight "@winglang/sdk.cloud.ITopicClient"
      */
    export class Topic extends cloud.TopicBase implements ISimulatorResource {
        constructor(scope: Construct, id: string, props?: cloud.TopicProps);
        onMessage(inflight: core.Inflight, // cloud.ITopicOnMessageHandler
        props?: cloud.TopicOnMessageProps): cloud.Function;
        /** @internal */
        _bind(host: core.IInflightHost, ops: string[]): void;
        /** @internal */
        _toInflight(): core.Code;
        toSimulator(): BaseResourceSchema;
    }
}

declare module '@winglang/sdk/target-tf-aws/app' {
    import { IApp, CdktfApp, AppProps } from "@winglang/sdk/core";
    /**
      * An app that knows how to synthesize constructs into a Terraform configuration
      * for AWS resources.
      */
    export class App extends CdktfApp implements IApp {
        constructor(props?: AppProps);
    }
}

declare module '@winglang/sdk/target-tf-aws/bucket' {
    import { Construct } from "constructs";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    import { NameOptions } from "@winglang/sdk/utils/resource-names";
    /**
        * Bucket prefix provided to Terraform must be between 3 and 37 characters.
        *
        * Bucket names are allowed to contain lowercase alphanumeric characters and
        * dashes (-). We generate names without dots (.) to avoid some partial
        * restrictions on bucket names with dots.
        */
    export const BUCKET_PREFIX_OPTS: NameOptions;
    /**
        * AWS implementation of "cloud.Bucket".
        *
        * @inflight "@winglang/sdk.cloud.IBucketClient"
        */
    export class Bucket extends cloud.BucketBase {
            constructor(scope: Construct, id: string, props: cloud.BucketProps);
            addObject(key: string, body: string): void;
            /** @internal */
            _bind(host: core.IInflightHost, ops: string[]): void;
            /** @internal */
            _toInflight(): core.Code;
    }
}

declare module '@winglang/sdk/target-tf-aws/counter' {
    import { Construct } from "constructs";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    export const HASH_KEY = "id";
    /**
      * AWS implementation of "cloud.Counter".
      *
      * @inflight "@winglang/sdk.cloud.ICounterClient"
      */
    export class Counter extends cloud.CounterBase {
        constructor(scope: Construct, id: string, props?: cloud.CounterProps);
        /** @internal */
        _bind(host: core.IInflightHost, ops: string[]): void;
        /** @internal */
        _toInflight(): core.Code;
    }
}

declare module '@winglang/sdk/target-tf-aws/factory' {
    import { IConstruct } from "constructs";
    import { IPolyconFactory } from "polycons";
    /**
      * Polycon factory which resolves polycons in "cloud" into preflight resources
      * for the AWS target.
      */
    export class PolyconFactory implements IPolyconFactory {
        resolve(type: string, scope: IConstruct, id: string, ...args: any[]): IConstruct;
    }
}

declare module '@winglang/sdk/target-tf-aws/function' {
    import { Construct } from "constructs";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    /**
        * AWS implementation of "cloud.Function".
        *
        * @inflight "@winglang/sdk.cloud.IFunctionClient"
        */
    export class Function extends cloud.FunctionBase {
            /** Function ARN */
            readonly arn: string;
            constructor(scope: Construct, id: string, inflight: cloud.IFunctionHandler, props: cloud.FunctionProps);
            /** @internal */
            _bind(host: core.IInflightHost, ops: string[]): void;
            /** @internal */
            _toInflight(): core.Code;
            /**
                * Add a policy statement to the Lambda role.
                */
            addPolicyStatements(...statements: PolicyStatement[]): void;
            /** @internal */
            get _functionName(): string;
    }
    /**
        * AWS IAM Policy Statement.
        */
    export interface PolicyStatement {
            /** Actions */
            readonly action?: string[];
            /** Resources */
            readonly resource?: string[] | string;
            /** Effect ("Allow" or "Deny") */
            readonly effect?: string;
    }
}

declare module '@winglang/sdk/target-tf-aws/queue' {
    import { Construct } from "constructs";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    /**
      * AWS implementation of "cloud.Queue".
      *
      * @inflight "@winglang/sdk.cloud.IQueueClient"
      */
    export class Queue extends cloud.QueueBase {
        constructor(scope: Construct, id: string, props?: cloud.QueueProps);
        onMessage(inflight: core.Inflight, // cloud.IQueueOnMessageHandler
        props?: cloud.QueueOnMessageProps): cloud.Function;
        /** @internal */
        _bind(host: core.IInflightHost, ops: string[]): void;
        /** @internal */
        _toInflight(): core.Code;
    }
}

declare module '@winglang/sdk/target-tf-azure/app' {
    import { ResourceGroup } from "@cdktf/provider-azurerm/lib/resource-group";
    import { ServicePlan } from "@cdktf/provider-azurerm/lib/service-plan";
    import { StorageAccount } from "@cdktf/provider-azurerm/lib/storage-account";
    import { IConstruct } from "constructs";
    import { IApp, CdktfApp, AppProps } from "@winglang/sdk/core";
    /**
        * Azure app props
        */
    export interface AzureAppProps extends AppProps {
            /** Location for resources to be deployed to */
            readonly location: string;
    }
    /**
        * An app that knows how to synthesize constructs into a Terraform configuration
        * for Azure resources.
        */
    export class App extends CdktfApp implements IApp {
            /**
                * Recursively search scope of node to find nearest instance of App
                *
                * @param construct to consider as instance of App
                * @returns App
                */
            static of(construct?: IConstruct): App;
            /**
                * The location context of the App
                * @link https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/resource_group#location
                * */
            readonly location: string;
            constructor(props: AzureAppProps);
            /**
                * Get resource group using lazy initialization
                */
            get resourceGroup(): ResourceGroup;
            /**
                * Get storage account using lazy initialization
                */
            get storageAccount(): StorageAccount;
            /**
                * Get service plan using lazy initialization
                */
            get servicePlan(): ServicePlan;
    }
}

declare module '@winglang/sdk/target-tf-azure/bucket' {
    import { StorageContainer } from "@cdktf/provider-azurerm/lib/storage-container";
    import { Construct } from "constructs";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    /**
        * Azure bult-in storage account permissions.
        */
    export enum StorageAccountPermissions {
            /** Read only permission */
            READ = "Storage Blob Data Reader",
            /** Read write permission */
            READ_WRITE = "Storage Blob Data Contributor"
    }
    /**
        * Azure implementation of "cloud.Bucket".
        *
        * @inflight "@winglang/sdk.cloud.IBucketClient"
        */
    export class Bucket extends cloud.BucketBase {
            /** Storage container */
            readonly storageContainer: StorageContainer;
            constructor(scope: Construct, id: string, props?: cloud.BucketProps);
            addObject(key: string, body: string): void;
            /** @internal */
            _bind(host: core.IInflightHost, ops: string[]): void;
            /** @internal */
            _toInflight(): core.Code;
    }
}

declare module '@winglang/sdk/target-tf-azure/factory' {
    import { IConstruct } from "constructs";
    import { IPolyconFactory } from "polycons";
    /**
      * Polycon factory which resolves polycons in "cloud" into preflight resources
      * for the Azure target.
      */
    export class PolyconFactory implements IPolyconFactory {
        resolve(type: string, scope: IConstruct, id: string, ...args: any[]): IConstruct;
    }
}

declare module '@winglang/sdk/target-tf-azure/function' {
    import { Construct } from "constructs";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    import { IResource } from "@winglang/sdk/core";
    /**
        * Azure scoped role assignment.
        */
    export interface ScopedRoleAssignment {
            /** The azure scope ie. /subscription/xxxxx/yyyyy/zzz */
            readonly scope: string;
            /** Role definition to assign */
            readonly roleDefinitionName: string;
    }
    /**
        * Azure implementation of "cloud.Function".
        *
        * @inflight "@winglang/wingsdk.cloud.IFunctionClient"
        */
    export class Function extends cloud.FunctionBase {
            constructor(scope: Construct, id: string, inflight: cloud.IFunctionHandler, props: cloud.FunctionProps);
            /**
                *  Adds role to function for given azure scope
                *
                * @param scopedResource - The resource to which the role assignment will be scoped.
                * @param scopedRoleAssignment - The mapping of azure scope to role definition name.
                */
            addPermission(scopedResource: IResource, scopedRoleAssignment: ScopedRoleAssignment): void;
            /** @internal */
            _toInflight(): core.Code;
    }
}

declare module '@winglang/sdk/target-tf-gcp/app' {
    import { IConstruct } from "constructs";
    import { AppProps as CdktfAppProps, CdktfApp, IApp } from "@winglang/sdk/core";
    /**
        * GCP App props.
        */
    export interface AppProps extends CdktfAppProps {
            /**
                * The Google Cloud project ID.
                */
            readonly projectId: string;
            /**
                * The Google Cloud storage location, used for all storage resources.
                * @see https://cloud.google.com/storage/docs/locations
                */
            readonly storageLocation: string;
    }
    /**
        * An app that knows how to synthesize constructs into a Terraform configuration
        * for GCP resources.
        */
    export class App extends CdktfApp implements IApp {
            /**
                * Returns the App a construct belongs to.
                */
            static of(construct: IConstruct): App;
            /**
                * The Google Cloud project ID.
                */
            readonly projectId: string;
            /**
                * The Google Cloud storage location, used for all storage resources.
                */
            readonly storageLocation: string;
            constructor(props: AppProps);
    }
}

declare module '@winglang/sdk/target-tf-gcp/bucket' {
    import { Construct } from "constructs";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    /**
      * GCP implementation of "cloud.Bucket".
      *
      * @inflight "@winglang/sdk.cloud.IBucketClient"
      */
    export class Bucket extends cloud.BucketBase {
        constructor(scope: Construct, id: string, props?: cloud.BucketProps);
        addObject(key: string, body: string): void;
        /** @internal */
        _bind(_inflightHost: core.IInflightHost, _ops: string[]): void;
        /** @internal */
        _toInflight(): core.Code;
    }
}

declare module '@winglang/sdk/target-tf-gcp/factory' {
    import { IConstruct } from "constructs";
    import { IPolyconFactory } from "polycons";
    /**
      * Polycon factory which resolves polycons in "cloud" into preflight resources
      * for the GCP target.
      */
    export class PolyconFactory implements IPolyconFactory {
        resolve(type: string, scope: IConstruct, id: string, ...args: any[]): IConstruct;
    }
}

declare module '@winglang/sdk/target-tf-gcp/logger' {
    import { Construct } from "constructs";
    import * as cloud from "@winglang/sdk/cloud";
    import * as core from "@winglang/sdk/core";
    /**
      * GCP implementation of "cloud.Logger"
      *
      * @inflight "@winglang/sdk.cloud.ILoggerClient"
      */
    export class Logger extends cloud.LoggerBase {
        constructor(scope: Construct, id: string);
        /** @internal */
        _bind(host: core.IInflightHost, ops: string[]): void;
        /** @internal */
        _toInflight(): core.Code;
    }
}

declare module '@winglang/sdk/testing/sim-app' {
    import { Simulator } from "@winglang/sdk/testing";
    import * as sim from "@winglang/sdk/target-sim";
    /**
        * A simulated app.
        *
        * A great way to write unit tests for the cloud. Just use this as your base app
        * and then call "app.startSimulator()" to start an instance of this app inside
        * a cloud simulator.
        */
    export class SimApp extends sim.App {
            constructor();
            /**
                * Creates a simulator and starts it.
                *
                * @returns A started "Simulator" instance. No need to call "start()" again.
                */
            startSimulator(): Promise<Simulator>;
            /**
                * Takes a snapshot of the output directory, returning a map of filenames to
                * their contents.
                */
            snapshot(): Record<string, any>;
    }
}

declare module '@winglang/sdk/testing/simulator' {
    import { ISimulatorResourceInstance } from "@winglang/sdk/target-sim";
    import { BaseResourceSchema } from "@winglang/sdk/target-sim/schema";
    /**
        * Props for "Simulator".
        */
    export interface SimulatorProps {
            /**
                * Path to a Wing simulator file (.wsim).
                */
            readonly simfile: string;
            /**
                * The factory that produces resource simulations.
                *
                * @default - a factory that produces simulations for built-in Wing SDK
                * resources
                */
            readonly factory?: ISimulatorFactory;
    }
    /**
        * A collection of callbacks that are invoked at key lifecycle events of the
        * simulator.
        */
    export interface ISimulatorLifecycleHooks {
            /**
                * A function to run whenever a trace is emitted.
                */
            onTrace?(event: Trace): void;
    }
    /**
        * Props for "ISimulatorContext.withTrace".
        */
    export interface IWithTraceProps {
            /**
                * The trace message.
                */
            readonly message: any;
            /**
                * A function to run as part of the trace.
                */
            activity(): Promise<any>;
    }
    /**
        * Represents an trace emitted during simulation.
        */
    export interface Trace {
            /**
                * A JSON blob with structured data.
                */
            readonly data: any;
            /**
                * The type of the source that emitted the trace.
                */
            readonly sourceType: string;
            /**
                * The path of the resource that emitted the trace.
                */
            readonly sourcePath: string;
            /**
                * The type of a trace.
                */
            readonly type: TraceType;
            /**
                * The timestamp of the event, in ISO 8601 format.
                * @example 2020-01-01T00:00:00.000Z
                */
            readonly timestamp: string;
    }
    /**
        * The type of a trace.
        */
    export enum TraceType {
            /**
                * A trace representing a resource activity.
                */
            RESOURCE = "resource",
            /**
                * A trace representing information emitted by the logger.
                */
            LOG = "log"
    }
    /**
        * Context that is passed to individual resource simulations.
        */
    export interface ISimulatorContext {
            /**
                * The directory where all assets extracted from ".wsim" file are stored
                * during the simulation run.
                */
            readonly assetsDir: string;
            /**
                * The path of the resource that is being simulated.
                */
            readonly resourcePath: string;
            /**
                * Find a resource simulation by its handle. Throws if the handle isn't valid.
                */
            findInstance(handle: string): ISimulatorResourceInstance;
            /**
                * Add a trace. Traces are breadcrumbs of information about resource
                * operations that occurred during simulation, useful for understanding how
                * resources interact or debugging an application.
                */
            addTrace(trace: Trace): void;
            /**
                * Register a trace associated with a resource activity. The activity will be
                * run, and the trace will be populated with the result's success or failure.
                */
            withTrace(trace: IWithTraceProps): Promise<any>;
    }
    /**
        * A subscriber that can listen for traces emitted by the simulator.
        */
    export interface ITraceSubscriber {
            /**
                * Called when a trace is emitted.
                */
            callback(event: Trace): void;
    }
    /**
        * A simulator that can be used to test your application locally.
        */
    export class Simulator {
            constructor(props: SimulatorProps);
            /**
                * Start the simulator.
                */
            start(): Promise<void>;
            /**
                * Stop the simulation and clean up all resources.
                */
            stop(): Promise<void>;
            /**
                * Stop the simulation, reload the simulation tree from the latest version of
                * the app file, and restart the simulation.
                */
            reload(): Promise<void>;
            /**
                * Get a list of all resource paths.
                */
            listResources(): string[];
            /**
                * Get a list of all traces from the most recent simulation run.
                */
            listTraces(): Trace[];
            /**
                * Get a simulated resource instance.
                * @returns the resource
                */
            getResource(path: string): any;
            /**
                * Get a simulated resource instance.
                * @returns The resource of undefined if not found
                */
            tryGetResource(path: string): any | undefined;
            /**
                * Obtain a resource's configuration, including its type, props, and attrs.
                * @returns The resource configuration or undefined if not found
                */
            tryGetResourceConfig(path: string): BaseResourceSchema | undefined;
            /**
                * Obtain a resource's configuration, including its type, props, and attrs.
                * @param path The resource path
                * @returns The resource configuration
                */
            getResourceConfig(path: string): BaseResourceSchema;
            /**
                * Register a subscriber that will be notified when a trace is emitted by
                * the simulator.
                */
            onTrace(subscriber: ITraceSubscriber): void;
            /**
                * Lists all resource with identifier "test" or that start with "test:*".
                * @returns A list of resource paths
                */
            listTests(): string[];
            /**
                * Run all tests in the simulation tree.
                *
                * A test is a "cloud.Function" resource with an identifier that starts with "test." or is "test".
                * @returns A list of test results.
                */
            runAllTests(): Promise<TestResult[]>;
            /**
                * Runs a single test.
                * @param path The path to a cloud.Function resource that repersents the test
                * @returns The result of the test
                */
            runTest(path: string): Promise<TestResult>;
    }
    /**
        * A factory that can turn resource descriptions into (inflight) resource simulations.
        */
    export interface ISimulatorFactory {
            /**
                * Resolve the parameters needed for creating a specific resource simulation.
                */
            resolve(type: string, props: any, context: ISimulatorContext): ISimulatorResourceInstance;
    }
    /**
        * A result of a single test.
        */
    export interface TestResult {
            /**
                * The path to the test function.
                */
            readonly path: string;
            /**
                * Whether the test passed.
                */
            readonly pass: boolean;
            /**
                * The error message if the test failed.
                */
            readonly error?: string;
            /**
                * List of traces emitted during the test.
                */
            readonly traces: Trace[];
    }
}

declare module '@winglang/sdk/testing/testing' {
    import { IConstruct } from "constructs";
    import { InflightBindings, IResource } from "@winglang/sdk/core";
    /**
        * Test utilities.
        */
    export class Testing {
            /**
                * Make an "IFunctionHandler", "IQueueOnMessageHandler" or any other handler
                * on the fly. The resource will have a single method named "handle".
                *
                * The JavaScript code passed to the handler must be in the form of
                * "async handle(event) { ... }", and all references to resources must be
                * made through "this.<resource>".
                *
                * @param scope The scope to create the handler in.
                * @param id The ID of the handler.
                * @param code The code of the handler.
                * @param bindings The bindings of the handler.
                */
            static makeHandler(scope: IConstruct, id: string, code: string, bindings?: InflightBindings): IResource;
    }
}

declare module '@winglang/sdk/utils/resource-names' {
    import { Construct } from "constructs";
    export enum CaseConventions {
            LOWERCASE = "lowercase",
            UPPERCASE = "uppercase"
    }
    /**
        * Options for "ResourceNames.generateName"
        */
    export interface NameOptions {
            /**
                * Maximum length for the generated name. The length must at least the length
                * of the hash (8 characters).
                * @default - no maximum length
                */
            readonly maxLen?: number;
            /**
                * Regular expression that indicates which characters are invalid. Each group
                * of characters will be replaced with "sep".
                */
            readonly disallowedRegex: RegExp;
            /**
                * Word breaker
                * @default "-"
                */
            readonly sep?: string;
            /**
                * Convert the generated name to all uppercase or all lowercase.
                * @default - apply no case conversion
                */
            readonly case?: CaseConventions;
            /**
                * Apply a predefined prefix to the generated name
                * @default - no prefix
                */
            readonly prefix?: string;
            /**
                * Apply a predefined suffix to the generated name
                * @default - no suffix
                */
            readonly suffix?: string;
            /**
                * Include a hash of the resource's address in the generated name.
                *
                * This should only be disabled if the resource's name is guaranteed to be
                * app-unique, or if some other source of randomness will be appended to the
                * name.
                *
                * @default true
                */
            readonly includeHash?: boolean;
    }
    export class ResourceNames {
            static generateName(resource: Construct, props: NameOptions): string;
    }
}


`;
