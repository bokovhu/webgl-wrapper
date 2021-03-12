import { vec2, vec3, vec4, mat2, mat3, mat4 } from "gl-matrix";
import { Program } from "./Program";

export abstract class AbstractUniformSetter<T> {
    constructor(
        public gl: WebGL2RenderingContext,
        protected _uniformName: string,
        protected _uniformLocation: WebGLUniformLocation,
        protected _uniformInfo: WebGLActiveInfo,
        protected _program: Program
    ) {}

    get uniformName(): string {
        return this._uniformName;
    }
    get uniformLocation(): WebGLUniformLocation {
        return this._uniformLocation;
    }
    get uniformInfo(): WebGLActiveInfo {
        return this._uniformInfo;
    }
    get program(): Program {
        return this._program;
    }

    abstract apply(value: T): void;
}

export class FloatUniformSetter extends AbstractUniformSetter<number> {
    apply(value: number): void {
        this.gl.uniform1f(this._uniformLocation, value);
    }
}

export class Float2UniformSetter extends AbstractUniformSetter<vec2> {
    apply(value: vec2): void {
        this.gl.uniform2f(this._uniformLocation, value[0], value[1]);
    }
}

export class Float3UniformSetter extends AbstractUniformSetter<vec3> {
    apply(value: vec3): void {
        this.gl.uniform3f(this._uniformLocation, value[0], value[1], value[2]);
    }
}

export class Float4UniformSetter extends AbstractUniformSetter<vec4> {
    apply(value: vec4): void {
        this.gl.uniform4f(
            this._uniformLocation,
            value[0],
            value[1],
            value[2],
            value[3]
        );
    }
}

export class IntUniformSetter extends AbstractUniformSetter<number> {
    apply(value: number): void {
        this.gl.uniform1i(this._uniformLocation, value);
    }
}

export class Int2UniformSetter extends AbstractUniformSetter<vec2> {
    apply(value: vec2): void {
        this.gl.uniform2i(this._uniformLocation, value[0], value[1]);
    }
}

export class Int3UniformSetter extends AbstractUniformSetter<vec3> {
    apply(value: vec3): void {
        this.gl.uniform3i(this._uniformLocation, value[0], value[1], value[2]);
    }
}

export class Int4UniformSetter extends AbstractUniformSetter<vec4> {
    apply(value: vec4): void {
        this.gl.uniform4i(
            this._uniformLocation,
            value[0],
            value[1],
            value[2],
            value[3]
        );
    }
}

export class UintUniformSetter extends AbstractUniformSetter<number> {
    apply(value: number): void {
        this.gl.uniform1ui(this._uniformLocation, value);
    }
}

export class Uint2UniformSetter extends AbstractUniformSetter<vec2> {
    apply(value: vec2): void {
        this.gl.uniform2ui(this._uniformLocation, value[0], value[1]);
    }
}

export class Uint3UniformSetter extends AbstractUniformSetter<vec3> {
    apply(value: vec3): void {
        this.gl.uniform3ui(this._uniformLocation, value[0], value[1], value[2]);
    }
}

export class Uint4UniformSetter extends AbstractUniformSetter<vec4> {
    apply(value: vec4): void {
        this.gl.uniform4ui(
            this._uniformLocation,
            value[0],
            value[1],
            value[2],
            value[3]
        );
    }
}

export class Mat2UniformSetter extends AbstractUniformSetter<mat2> {
    apply(value: mat2): void {
        this.gl.uniformMatrix2fv(this._uniformLocation, false, value);
    }
}

export class Mat3UniformSetter extends AbstractUniformSetter<mat3> {
    apply(value: mat3): void {
        this.gl.uniformMatrix3fv(this._uniformLocation, false, value);
    }
}

export class Mat4UniformSetter extends AbstractUniformSetter<mat4> {
    apply(value: mat4): void {
        this.gl.uniformMatrix4fv(this._uniformLocation, false, value);
    }
}

export class BooleanUniformSetter extends AbstractUniformSetter<boolean> {
    apply(value: boolean): void {
        this.gl.uniform1i(this._uniformLocation, value ? 1 : 0);
    }
}

export interface UniformArrayElementDescriptor<T> {
    name: string;
    location: WebGLUniformLocation;
    setter: AbstractUniformSetter<T>;
}
