export type Vec2Type = [number, number] | Float32Array;
export type Vec3Type = [number, number, number] | Float32Array;
export type Vec4Type = [number, number, number, number] | Float32Array;

export type Mat2Type = [number, number, number, number] | Float32Array;
export type Mat3Type =
    | [number, number, number, number, number, number, number, number, number]
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

export type UniformType =
    | number
    | Vec2Type
    | Vec3Type
    | Vec4Type
    | Mat2Type
    | Mat3Type
    | Mat4Type;
export interface IUniformSetter<T> {
    readonly uniformName: string;
    readonly uniformLocation: WebGLUniformLocation;
    readonly uniformInfo: WebGLActiveInfo;
    apply(value: T): void;
}

export type VertexAttributeMapType = { [name: string]: WebGLActiveInfo };
export type VertexAttributeLocationMapType = { [name: string]: number };
export type UniformInfoMapType = { [name: string]: WebGLActiveInfo };
export type UniformSetterMapType = { [name: string]: IUniformSetter<any> };

export type CubemapFaceID = "+x" | "-x" | "+y" | "-y" | "+z" | "-z";
export type CubemapStorageInitalizationMapType = {
    [face: string]: boolean;
};
export type CubemapDataMapType<T extends ArrayBufferView> = {
    [face: string]: T;
};

export type VertexDataType = Float32Array;
export type IndexDataType = Uint16Array | Uint32Array;

export interface GLContextAware {
    gl: WebGL2RenderingContext;
}
