export as namespace WebGLWrapper;
export = WebGLWrapper;

declare namespace WebGLWrapper {
    export type Vec2Type = [number, number] | Float32Array;
    export type Vec3Type = [number, number, number] | Float32Array;
    export type Vec4Type = [number, number, number, number] | Float32Array;

    export type Mat2Type = [number, number, number, number] | Float32Array;
    export type Mat3Type =
        | [
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number
          ]
        | Float32Array;
    export type Mat4Type =
        | [
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number,
              number
          ]
        | Float32Array;

    export type VertexAttributeMapType = { [name: string]: WebGLActiveInfo };
    export type VertexAttributeLocationMapType = { [name: string]: number };
    export type UniformInfoMapType = { [name: string]: WebGLActiveInfo };
    export type UniformSetterMapType = { [name: string]: UniformSetter<any> };

    export type VertexDataType = Float32Array;
    export type IndexDataType = Uint16Array | Uint32Array;

    export interface GLContextAware {
        gl: WebGL2RenderingContext;
    }

    export interface Shader extends GLContextAware {
        handle: WebGLShader;
        type: GLenum;
        source: string;
        handleGenerated: boolean;
        isCompiled: boolean;
        hasCompilationError: boolean;
        isDeleted: boolean;

        generateHandle(): void;
        attachSource(src?: string | null): void;
        compile(): void;
        delete(): void;
        getInfoLog(): string;
    }

    export interface UniformSetter<T> extends GLContextAware {
        uniformName: string;
        uniformLocation: WebGLUniformLocation;
        uniformInfo: WebGLActiveInfo;
        program: Program;

        apply(value: T): void;
    }

    export interface Program extends GLContextAware {
        handle: WebGLProgram;
        vertexShader: Shader;
        fragmentShader: Shader;
        handleGenerated: boolean;
        isLinked: boolean;
        hasLinkError: boolean;
        isValidated: boolean;
        hasValidationError: boolean;
        isDeleted: boolean;
        inputAttributes: VertexAttributeMapType;
        attributeLocations: VertexAttributeLocationMapType;
        uniforms: UniformInfoMapType;
        uniformSetters: UniformSetterMapType;

        generateHandle(): void;
        attachShader(shader?: Shader | null): void;
        link(): void;
        validate(): void;
        delete(): void;
        getInfoLog(): string;
        setUniform(name: string, value: any): void;
        use(): void;
        unuse(): void;
    }

    export interface VertexAttribute {
        index: number;
        name?: string | null;
        type: GLenum;
        length: number;
        normalized?: boolean;
    }

    export interface Mesh extends GLContextAware {
        vao: WebGLVertexArrayObject;
        vbo: WebGLBuffer;
        ibo: WebGLBuffer | null;
        isInitialized: boolean;
        isIndexed: boolean;
        vertexCount: number;
        vertexAttributes: VertexAttribute[];
        indexType: GLenum;
        primitiveType: GLenum;

        draw(): void;
        setup(
            attributes: VertexAttribute[],
            primitive: GLenum,
            indexed: boolean
        ): void;
        uploadVertexData(
            vertexData: VertexDataType,
            vertexCount?: number
        ): void;
        uploadIndexDataShort(indexData: Uint16Array, vertexCount: number): void;
        uploadIndexDataInt(indexData: Uint32Array, vertexCount: number): void;
    }

    export interface PixelFormat {
        format: GLenum;
        internalFormat: GLenum;
        dataType: GLenum;
    }

    export interface SamplingProperties {
        minFilter: GLenum;
        magFilter: GLenum;
        wrapS: GLenum;
        wrapT: GLenum;
        wrapR: GLenum;
    }

    export interface Texture {
        handle: WebGLTexture;
        width: number;
        height: number;
        depth: number;
        pixelFormat: PixelFormat;
        samplingProperties: SamplingProperties;
        target: GLenum;
        handleGenerated: boolean;
        isDeleted: boolean;
        isStorageInitialized: boolean;

        generateHandle(): void;
        bind(unit: number): void;
        uploadFloat(data: Float32Array, format?: PixelFormat): void;
        uploadInt(data: Int32Array, format?: PixelFormat): void;
        uploadUnsignedInt(data: Uint32Array, format?: PixelFormat): void;
        uploadShort(data: Int16Array, format?: PixelFormat): void;
        uploadUnsignedShort(data: Uint16Array, format?: PixelFormat): void;
        uploadByte(data: Int8Array, format?: PixelFormat): void;
        uploadUnsignedByte(data: Uint8Array, format?: PixelFormat): void;
        createStorage(): void;
        delete(): void;
    }

    export interface Sampler {
        handle: WebGLSampler;
        properties: SamplingProperties;
        handleGenerated: boolean;
        isDeleted: boolean;
        samplingPropertiesSet: boolean;

        generateHandle(): void;
        bind(unit: number): void;
        update(samplingProperties?: SamplingProperties): void;
        delete(): void;
    }

    export type RenderFunction = (
        delta: number,
        gl: WebGL2RenderingContext,
        ww?: WebGLWrapper
    ) => void;

    export type InitFunction = (
        gl: WebGL2RenderingContext,
        ww?: WebGLWrapper
    ) => void;

    export interface WebGLExtensionOptions {
        colorBufferFloat?: boolean | null;
        textureFloatLinear?: boolean | null;
        elementIndexUint?: boolean | null;
    }

    export interface WebGLWrapperOptions {
        onInit?: InitFunction | null;
        onRender?: RenderFunction | null;
        resizeCanvasToFitWindow?: boolean;
        extensions?: WebGLExtensionOptions | null;
    }

    export interface MakeMeshOptions {
        attributes: VertexAttribute[];
        primitive: GLenum;
        indexed: boolean;
    }

    export interface MakeTextureOptions {
        width: number;
        height: number;
        depth?: number;
        target: GLenum;
        pixelFormat?: PixelFormat;
        samplingProperties?: SamplingProperties;
    }

    export interface Make2DTextureOptions {
        width: number;
        height: number;
        pixelFormat?: PixelFormat;
        samplingProperties?: SamplingProperties;
    }

    export interface Make3DTextureOptions {
        width: number;
        height: number;
        depth: number;
        pixelFormat?: PixelFormat;
        samplingProperties?: SamplingProperties;
    }

    export interface MakeSamplerOptions {
        properties?: SamplingProperties;
    }

    export class WebGLWrapper {
        constructor(canvasSelector: string, options?: WebGLWrapperOptions);
        start(): void;

        makeShader(shaderType: GLenum): Shader;
        makeVertexShader(shaderSource: string): Shader;
        makeFragmentShader(shaderSource: string): Shader;
        makeProgram(): Program;
        makeProgramFromShaders(
            vertexShader: Shader,
            fragmentShader: Shader,
            validate?: boolean
        ): Program;
        makeMesh(options?: MakeMeshOptions): Mesh;
        makeTexture(options: MakeTextureOptions): Texture;
        make2DTexture(options: Make2DTextureOptions): Texture;
        make3DTexture(options: Make3DTextureOptions): Texture;
        makeSampler(options: MakeSamplerOptions): Sampler;
    }
}

declare global {
    export class GLUtil {
        nameOfGLEnum(v: GLenum): string;
    }

    interface Window {
        glUtil: GLUtil;
    }
}
