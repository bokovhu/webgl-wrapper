export declare type Vec2Type = [number, number] | Float32Array;
export declare type Vec3Type = [number, number, number] | Float32Array;
export declare type Vec4Type = [number, number, number, number] | Float32Array;
export declare type Mat2Type = [number, number, number, number] | Float32Array;
export declare type Mat3Type = [number, number, number, number, number, number, number, number, number] | Float32Array;
export declare type Mat4Type = [
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
] | Float32Array;
export declare type VertexAttributeMapType = {
    [name: string]: WebGLActiveInfo;
};
export declare type VertexAttributeLocationMapType = {
    [name: string]: number;
};
export declare type UniformInfoMapType = {
    [name: string]: WebGLActiveInfo;
};
export declare type UniformSetterMapType = {
    [name: string]: UniformSetter<any>;
};
export declare type CubemapFaceID = "+x" | "-x" | "+y" | "-y" | "+z" | "-z";
export declare type CubemapStorageInitalizationMapType = {
    [face: string]: boolean;
};
export declare type CubemapDataMapType<T extends ArrayBufferView> = {
    [face: string]: T;
};
export declare type VertexDataType = Float32Array;
export declare type IndexDataType = Uint16Array | Uint32Array;
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
    setup(attributes: VertexAttribute[], primitive: GLenum, indexed: boolean): void;
    uploadVertexData(vertexData: VertexDataType, vertexCount?: number): void;
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
export interface Texture extends GLContextAware {
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
export interface Cubemap extends GLContextAware {
    handle: WebGLTexture;
    width: number;
    height: number;
    pixelFormat: PixelFormat;
    samplingProperties: SamplingProperties;
    handleGenerated: boolean;
    isDeleted: boolean;
    isStorageInitialized: CubemapStorageInitalizationMapType;
    generateHandle(): void;
    bind(unit: number): void;
    uploadFaceFloat(face: CubemapFaceID, data: Float32Array, format?: PixelFormat): void;
    uploadFaceInt(face: CubemapFaceID, data: Int32Array, format?: PixelFormat): void;
    uploadFaceUnsignedInt(face: CubemapFaceID, data: Uint32Array, format?: PixelFormat): void;
    uploadFaceShort(face: CubemapFaceID, data: Int16Array, format?: PixelFormat): void;
    uploadFaceUnsignedShort(face: CubemapFaceID, data: Uint16Array, format?: PixelFormat): void;
    uploadFaceByte(face: CubemapFaceID, data: Int8Array, format?: PixelFormat): void;
    uploadFaceUnsignedByte(face: CubemapFaceID, data: Uint8Array, format?: PixelFormat): void;
    uploadFloat(data: CubemapDataMapType<Float32Array>, format?: PixelFormat): void;
    uploadInt(data: CubemapDataMapType<Int32Array>, format?: PixelFormat): void;
    uploadUnsignedInt(data: CubemapDataMapType<Uint32Array>, format?: PixelFormat): void;
    uploadShort(data: CubemapDataMapType<Int16Array>, format?: PixelFormat): void;
    uploadUnsignedShort(data: CubemapDataMapType<Uint16Array>, format?: PixelFormat): void;
    uploadByte(data: CubemapDataMapType<Int8Array>, format?: PixelFormat): void;
    uploadUnsignedByte(data: CubemapDataMapType<Uint8Array>, format?: PixelFormat): void;
    createStorageForFace(face: CubemapFaceID): void;
    createStorage(): void;
    delete(): void;
}
export interface Sampler extends GLContextAware {
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
export interface Renderbuffer extends GLContextAware {
    handle: WebGLRenderbuffer;
    width: number;
    height: number;
    internalFormat: GLenum;
    handleGenerated: boolean;
    storageGenerated: boolean;
    isDeleted: boolean;
    generateHandle(): void;
    bind(): void;
    generateStorage(internalFormat?: GLenum): void;
    delete(): void;
}
export interface Framebuffer extends GLContextAware {
    handle: WebGLFramebuffer;
    width: number;
    height: number;
    handleGenerated: boolean;
    isComplete: boolean;
    isDeleted: boolean;
    generateHandle(): void;
    bind(target?: GLenum, check?: boolean): void;
    check(target?: GLenum): boolean;
    applyViewport(): void;
    attachColorTexture(index: number, texture: Texture): void;
    attachColorTextureLayer(index: number, texture: Texture, layer: number): void;
    attachColorCubemapFace(index: number, cubemap: Cubemap, face: CubemapFaceID): void;
    attachColorRenderbuffer(index: number, renderbuffer: Renderbuffer): void;
    attachDepthTexture(texture: Texture): void;
    attachDepthCubemapFace(cubemap: Cubemap, face: CubemapFaceID): void;
    attachDepthRenderbuffer(renderbuffer: Renderbuffer): void;
    attachStencilTexture(texture: Texture): void;
    attachStencilRenderbuffer(renderbuffer: Renderbuffer): void;
    attachDepthStencilTexture(texture: Texture): void;
    attachDepthStencilRenderbuffer(renderbuffer: Renderbuffer): void;
    delete(): void;
}
export interface DefaultFramebuffer {
    width: number;
    height: number;
    applyViewport(): void;
    bind(target?: GLenum): void;
}
export declare type RenderFunction = (delta: number, gl: WebGL2RenderingContext, ww?: WebGLWrapper) => void;
export declare type InitFunction = (gl: WebGL2RenderingContext, ww?: WebGLWrapper) => void;
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
export interface MakeCubemapOptions {
    width: number;
    height: number;
    pixelFormat?: PixelFormat;
    samplingProperties?: SamplingProperties;
}
export interface MakeSamplerOptions {
    properties?: SamplingProperties;
}
export interface MakeRenderbufferOptions {
    width: number;
    height: number;
    internalFormat: GLenum;
}
export interface MakeGeneratedRenderbuffersOptions {
    generateDepthRenderbuffer?: boolean;
    generateStencilRenderbuffer?: boolean;
    generateDepthStencilRenderbuffer?: boolean;
}
export interface MakeFramebufferOptions {
    width: number;
    height: number;
    generatedRenderbuffers?: MakeGeneratedRenderbuffersOptions;
}
export declare class WebGLWrapper {
    defaultFramebuffer: DefaultFramebuffer;
    constructor(canvasSelector: string, options?: WebGLWrapperOptions);
    start(): void;
    makeShader(shaderType: GLenum): Shader;
    makeVertexShader(shaderSource: string): Shader;
    makeFragmentShader(shaderSource: string): Shader;
    makeProgram(): Program;
    makeProgramFromShaders(vertexShader: Shader, fragmentShader: Shader, validate?: boolean): Program;
    makeMesh(options?: MakeMeshOptions): Mesh;
    makeTexture(options: MakeTextureOptions): Texture;
    make2DTexture(options: Make2DTextureOptions): Texture;
    make3DTexture(options: Make3DTextureOptions): Texture;
    makeSampler(options: MakeSamplerOptions): Sampler;
    makeCubemap(options: MakeCubemapOptions): Cubemap;
    makeRenderbuffer(options: MakeRenderbufferOptions): Renderbuffer;
    makeFramebuffer(options: MakeFramebufferOptions): Framebuffer;
}
declare global {
    export class GLUtil {
        nameOfGLEnum(v: GLenum): string;
        cubemapFaceIDValue(faceID: CubemapFaceID): GLenum;
    }
    interface Window {
        glUtil: GLUtil;
    }
}
