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
export declare type UniformType = number | Vec2Type | Vec3Type | Vec4Type | Mat2Type | Mat3Type | Mat4Type;
export interface IUniformSetter<T> {
    readonly uniformName: string;
    readonly uniformLocation: WebGLUniformLocation;
    readonly uniformInfo: WebGLActiveInfo;
    apply(value: T): void;
}
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
    [name: string]: IUniformSetter<any>;
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
