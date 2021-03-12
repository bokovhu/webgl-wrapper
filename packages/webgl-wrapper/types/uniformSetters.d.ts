import { Program } from "./types";
import { vec2, vec3, vec4, mat2, mat3, mat4 } from "gl-matrix";
export declare abstract class AbstractUniformSetter<T> {
    gl: WebGL2RenderingContext;
    protected _uniformName: string;
    protected _uniformLocation: WebGLUniformLocation;
    protected _uniformInfo: WebGLActiveInfo;
    protected _program: Program;
    constructor(gl: WebGL2RenderingContext, _uniformName: string, _uniformLocation: WebGLUniformLocation, _uniformInfo: WebGLActiveInfo, _program: Program);
    get uniformName(): string;
    get uniformLocation(): WebGLUniformLocation;
    get uniformInfo(): WebGLActiveInfo;
    get program(): Program;
    abstract apply(value: T): void;
}
export declare class FloatUniformSetter extends AbstractUniformSetter<number> {
    apply(value: number): void;
}
export declare class Float2UniformSetter extends AbstractUniformSetter<vec2> {
    apply(value: vec2): void;
}
export declare class Float3UniformSetter extends AbstractUniformSetter<vec3> {
    apply(value: vec3): void;
}
export declare class Float4UniformSetter extends AbstractUniformSetter<vec4> {
    apply(value: vec4): void;
}
export declare class IntUniformSetter extends AbstractUniformSetter<number> {
    apply(value: number): void;
}
export declare class Int2UniformSetter extends AbstractUniformSetter<vec2> {
    apply(value: vec2): void;
}
export declare class Int3UniformSetter extends AbstractUniformSetter<vec3> {
    apply(value: vec3): void;
}
export declare class Int4UniformSetter extends AbstractUniformSetter<vec4> {
    apply(value: vec4): void;
}
export declare class UintUniformSetter extends AbstractUniformSetter<number> {
    apply(value: number): void;
}
export declare class Uint2UniformSetter extends AbstractUniformSetter<vec2> {
    apply(value: vec2): void;
}
export declare class Uint3UniformSetter extends AbstractUniformSetter<vec3> {
    apply(value: vec3): void;
}
export declare class Uint4UniformSetter extends AbstractUniformSetter<vec4> {
    apply(value: vec4): void;
}
export declare class Mat2UniformSetter extends AbstractUniformSetter<mat2> {
    apply(value: mat2): void;
}
export declare class Mat3UniformSetter extends AbstractUniformSetter<mat3> {
    apply(value: mat3): void;
}
export declare class Mat4UniformSetter extends AbstractUniformSetter<mat4> {
    apply(value: mat4): void;
}
export declare class BooleanUniformSetter extends AbstractUniformSetter<boolean> {
    apply(value: boolean): void;
}
export interface UniformArrayElementDescriptor<T> {
    name: string;
    location: WebGLUniformLocation;
    setter: AbstractUniformSetter<T>;
}
