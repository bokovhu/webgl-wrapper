import { VertexAttribute, VertexDataType } from "./types";
export default class Mesh {
    gl: WebGL2RenderingContext;
    private _vao;
    private _vbo;
    private _ibo;
    private _isInitialized;
    private _isIndexed;
    private _vertexCount;
    private _vertexAttributes;
    private _indexType;
    private _primitiveType;
    constructor(gl: WebGL2RenderingContext);
    get vao(): WebGLVertexArrayObject;
    get vbo(): WebGLBuffer;
    get ibo(): WebGLBuffer;
    get isInitialized(): boolean;
    get isIndexed(): boolean;
    get vertexCount(): number;
    get vertexAttributes(): VertexAttribute[];
    get indexType(): GLenum;
    get primitiveType(): GLenum;
    setup(attributes: VertexAttribute[], primitive: GLenum, indexed: boolean): void;
    private sizeOfGLType;
    private vertexSize;
    private setupVAO;
    private setupBuffers;
    uploadVertexData(vertexData: VertexDataType, vertexCount?: number | null): void;
    uploadIndexDataShort(indexData: Uint16Array, vertexCount: number): void;
    uploadIndexDataInt(indexData: Uint32Array, vertexCount: number): void;
    draw(): void;
}
