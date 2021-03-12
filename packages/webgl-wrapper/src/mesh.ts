import { VertexAttribute, VertexDataType } from "./types";

export default class Mesh {
    private _vao: WebGLVertexArrayObject;
    private _vbo: WebGLBuffer;
    private _ibo: WebGLBuffer;
    private _isInitialized: boolean = false;
    private _isIndexed: boolean = false;
    private _vertexCount: number = 0;
    private _vertexAttributes: VertexAttribute[] = [];
    private _indexType: GLenum = null;
    private _primitiveType: GLenum = null;

    constructor(public gl: WebGL2RenderingContext) {}

    get vao(): WebGLVertexArrayObject {
        return this._vao;
    }
    get vbo(): WebGLBuffer {
        return this._vbo;
    }
    get ibo(): WebGLBuffer {
        return this._ibo;
    }
    get isInitialized(): boolean {
        return this._isInitialized;
    }
    get isIndexed(): boolean {
        return this._isIndexed;
    }
    get vertexCount(): number {
        return this._vertexCount;
    }
    get vertexAttributes(): VertexAttribute[] {
        return this._vertexAttributes;
    }
    get indexType(): GLenum {
        return this._indexType;
    }
    get primitiveType(): GLenum {
        return this._primitiveType;
    }

    setup(
        attributes: VertexAttribute[],
        primitive: GLenum,
        indexed: boolean
    ): void {
        this._isIndexed = indexed;
        this._vertexAttributes = attributes;
        this._primitiveType = primitive;

        this.setupBuffers();
        this.setupVAO();

        this._isInitialized = true;
    }

    private sizeOfGLType(type: GLenum): number {
        switch (type) {
            case this.gl.FLOAT:
                return Float32Array.BYTES_PER_ELEMENT;

            case this.gl.UNSIGNED_INT:
            case this.gl.INT:
                return Int32Array.BYTES_PER_ELEMENT;

            case this.gl.UNSIGNED_SHORT:
            case this.gl.SHORT:
                return Int16Array.BYTES_PER_ELEMENT;

            case this.gl.UNSIGNED_BYTE:
            case this.gl.BYTE:
                return Int8Array.BYTES_PER_ELEMENT;

            default:
                throw new Error(
                    `Unknown GL type for vertex attributes: ${type}`
                );
        }
    }

    private vertexSize(): number {
        let total = 0;
        for (let i = 0; i < this._vertexAttributes.length; i++) {
            let attr = this._vertexAttributes[i];
            let attrSize = this.sizeOfGLType(attr.type) * attr.length;
            total += attrSize;
        }
        return total;
    }

    private setupVAO(): void {
        let stride = 0;
        let attributeOffsets: number[] = [0];
        for (let i = 0; i < this._vertexAttributes.length; i++) {
            let attr = this._vertexAttributes[i];
            let attrSize = this.sizeOfGLType(attr.type) * attr.length;
            stride += attrSize;
            attributeOffsets.push(attributeOffsets[i] + attrSize);
        }

        this._vao = this.gl.createVertexArray();
        this.gl.bindVertexArray(this._vao);

        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._vbo);
        if (this._isIndexed) {
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._ibo);
        }

        for (let i = 0; i < this._vertexAttributes.length; i++) {
            let attr = this._vertexAttributes[i];
            let attrSize = this.sizeOfGLType(attr.type) * attr.length;

            this.gl.enableVertexAttribArray(i);
            this.gl.vertexAttribPointer(
                i,
                attr.length,
                attr.type,
                attr.normalized,
                stride,
                attributeOffsets[i]
            );
        }
    }

    private setupBuffers(): void {
        this._vbo = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._vbo);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, 0, this.gl.STATIC_DRAW);

        if (this._isIndexed) {
            this._ibo = this.gl.createBuffer();
            this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._ibo);
            this.gl.bufferData(
                this.gl.ELEMENT_ARRAY_BUFFER,
                0,
                this.gl.STATIC_DRAW
            );
        }
    }

    uploadVertexData(
        vertexData: VertexDataType,
        vertexCount: number | null = null
    ): void {
        if (!this._isIndexed && vertexCount == null) {
            throw new Error(
                "Vertex count must be set when not using indexed rendering!"
            );
        }

        if (!this._isInitialized) {
            throw new Error("Mesh must be initialized before data upload!");
        }

        if (!this._isIndexed) {
            this._vertexCount = vertexCount;
        }
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this._vbo);
        this.gl.bufferData(
            this.gl.ARRAY_BUFFER,
            vertexData,
            this.gl.STATIC_DRAW
        );
    }

    uploadIndexDataShort(indexData: Uint16Array, vertexCount: number): void {
        if (!this._isInitialized) {
            throw new Error("Mesh must be initialized before data upload!");
        }

        if (!this._isIndexed) {
            throw new Error("This mesh does not use indexed rendering!");
        }

        this._vertexCount = vertexCount;
        this._indexType = this.gl.UNSIGNED_SHORT;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._ibo);
        this.gl.bufferData(
            this.gl.ELEMENT_ARRAY_BUFFER,
            indexData,
            this.gl.STATIC_DRAW
        );
    }

    uploadIndexDataInt(indexData: Uint32Array, vertexCount: number): void {
        if (!this._isInitialized) {
            throw new Error("Mesh must be initialized before data upload!");
        }

        if (!this._isIndexed) {
            throw new Error("This mesh does not use indexed rendering!");
        }

        this._vertexCount = vertexCount;
        this._indexType = this.gl.UNSIGNED_INT;
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this._ibo);
        this.gl.bufferData(
            this.gl.ELEMENT_ARRAY_BUFFER,
            indexData,
            this.gl.STATIC_DRAW
        );
    }

    draw(): void {
        if (!this._isInitialized) {
            throw new Error("Mesh must be initialized before drawing!");
        }

        this.gl.bindVertexArray(this._vao);

        if (this._isIndexed) {
            this.gl.drawElements(
                this._primitiveType,
                this._vertexCount,
                this._indexType,
                0
            );
        } else {
            this.gl.drawArrays(this._primitiveType, 0, this._vertexCount);
        }
    }
}
