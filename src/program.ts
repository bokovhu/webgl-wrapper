import { Shader } from "./index";
import {
    VertexAttributeMapType,
    UniformInfoMapType,
    UniformSetterMapType,
    VertexAttributeLocationMapType
} from "../@types/webgl-wrapper/index";
import {
    AbstractUniformSetter,
    FloatUniformSetter,
    Float2UniformSetter,
    Float3UniformSetter,
    Float4UniformSetter,
    IntUniformSetter,
    Int2UniformSetter,
    Int3UniformSetter,
    Int4UniformSetter,
    UintUniformSetter,
    Uint2UniformSetter,
    Uint3UniformSetter,
    Uint4UniformSetter,
    Mat2UniformSetter,
    Mat3UniformSetter,
    Mat4UniformSetter,
    UniformArrayElementDescriptor
} from "./uniformSetters";

export default class Program {
    private _handle: WebGLProgram;
    private _vertexShader: Shader = null;
    private _fragmentShader: Shader = null;
    private _handleGenerated: boolean = false;
    private _isLinked: boolean = false;
    private _hasLinkError: boolean = false;
    private _isValidated: boolean = false;
    private _hasValidationError: boolean = false;
    private _isDeleted: boolean = false;

    private _inputAttributes: VertexAttributeMapType = {};
    private _attributeLocations: VertexAttributeLocationMapType = {};
    private _uniforms: UniformInfoMapType = {};
    private _uniformSetters: UniformSetterMapType = {};

    private _isVertexShaderAttached: boolean = false;
    private _isFragmentShaderAttached: boolean = false;

    constructor(
        public gl: WebGL2RenderingContext,
        vertexShader?: Shader | null,
        fragmentShader?: Shader | null
    ) {
        if (vertexShader) {
            this._vertexShader = vertexShader;
        }
        if (fragmentShader) {
            this._fragmentShader = fragmentShader;
        }
    }

    get handle(): WebGLProgram {
        return this._handle;
    }
    get vertexShader(): Shader {
        return this._vertexShader;
    }
    get fragmentShader(): Shader {
        return this._fragmentShader;
    }
    get handleGenerated(): boolean {
        return this._handleGenerated;
    }
    get isLinked(): boolean {
        return this._isLinked;
    }
    get hasLinkError(): boolean {
        return this._hasLinkError;
    }
    get isValidated(): boolean {
        return this._isValidated;
    }
    get hasValidationError(): boolean {
        return this._hasValidationError;
    }
    get isDeleted(): boolean {
        return this._isDeleted;
    }
    get inputAttributes(): VertexAttributeMapType {
        return this._inputAttributes;
    }
    get attributeLocations(): VertexAttributeLocationMapType {
        return this._attributeLocations;
    }
    get uniforms(): UniformInfoMapType {
        return this._uniforms;
    }
    get uniformSetters(): UniformSetterMapType {
        return this._uniformSetters;
    }

    private tryAttachShaders(): void {
        if (this._vertexShader && !this._isVertexShaderAttached) {
            this.gl.attachShader(this._handle, this._vertexShader.handle);
            this._isVertexShaderAttached = true;
        }
        if (this._fragmentShader && !this._isFragmentShaderAttached) {
            this.gl.attachShader(this._handle, this._fragmentShader.handle);
            this._isFragmentShaderAttached = true;
        }
    }

    private populateAttributes(): void {
        let numAttribs = this.gl.getProgramParameter(
            this._handle,
            this.gl.ACTIVE_ATTRIBUTES
        );
        for (let i = 0; i < numAttribs; i++) {
            let info = this.gl.getActiveAttrib(this._handle, i);
            this._inputAttributes[info.name] = info;
            this._attributeLocations[info.name] = i;
        }
    }

    private createUniformSetter(
        info: WebGLActiveInfo,
        location: WebGLUniformLocation
    ): AbstractUniformSetter<any> {
        switch (info.type) {
            case this.gl.FLOAT:
                return new FloatUniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.FLOAT_VEC2:
                return new Float2UniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.FLOAT_VEC3:
                return new Float3UniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.FLOAT_VEC4:
                return new Float4UniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.INT:
            case this.gl.SAMPLER_2D:
            case this.gl.SAMPLER_3D:
            case this.gl.SAMPLER_CUBE:
            case this.gl.INT_SAMPLER_2D:
            case this.gl.INT_SAMPLER_3D:
            case this.gl.INT_SAMPLER_CUBE:
            case this.gl.UNSIGNED_INT_SAMPLER_2D:
            case this.gl.UNSIGNED_INT_SAMPLER_3D:
            case this.gl.UNSIGNED_INT_SAMPLER_CUBE:
                return new IntUniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.INT_VEC2:
                return new Int2UniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.INT_VEC3:
                return new Int3UniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.INT_VEC4:
                return new Int4UniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.UNSIGNED_INT:
                return new UintUniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.UNSIGNED_INT_VEC2:
                return new Uint2UniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.UNSIGNED_INT_VEC3:
                return new Uint3UniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.UNSIGNED_INT_VEC4:
                return new Uint4UniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.FLOAT_MAT2:
                return new Mat2UniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.FLOAT_MAT3:
                return new Mat3UniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
            case this.gl.FLOAT_MAT4:
                return new Mat4UniformSetter(
                    this.gl,
                    info.name,
                    location,
                    info,
                    this
                );
        }
    }

    private populateUniforms(): void {
        let numUniforms = this.gl.getProgramParameter(
            this._handle,
            this.gl.ACTIVE_UNIFORMS
        );
        for (let i = 0; i < numUniforms; i++) {
            let info = this.gl.getActiveUniform(this._handle, i);

            if (info.size > 1) {
                for (let arrayIndex = 0; arrayIndex < info.size; arrayIndex++) {
                    let name = info.name.replace(/\[0\]/, `[${arrayIndex}]`);
                    let location = this.gl.getUniformLocation(
                        this._handle,
                        name
                    );
                    let setter: AbstractUniformSetter<any> = this.createUniformSetter(
                        info,
                        location
                    );
                    this._uniforms[name] = info;
                    this._uniformSetters[name] = setter;
                }
            } else {
                let location = this.gl.getUniformLocation(
                    this._handle,
                    info.name
                );
                this._uniforms[info.name] = info;
                this._uniformSetters[info.name] = this.createUniformSetter(
                    info,
                    location
                );
            }
        }
    }

    private populate(): void {
        this.populateAttributes();
        this.populateUniforms();
    }

    generateHandle(): void {
        if (this._handleGenerated) {
            throw new Error("Handle has already been generated!");
        }
        if (this._isDeleted) {
            throw new Error("Program has been deleted!");
        }
        this._handle = this.gl.createProgram();
        this._handleGenerated = true;

        if (this._vertexShader || this._fragmentShader) {
            this.tryAttachShaders();
        }
    }

    attachShader(shader?: Shader | null): void {
        if (this._isLinked) {
            throw new Error(
                "Program has already been linked, cannot attach shaders at this point!"
            );
        }
        if (this._isDeleted) {
            throw new Error("Program has been deleted!");
        }

        if (!this._handleGenerated) {
            this.generateHandle();
        }
        if (shader.type == this.gl.VERTEX_SHADER) {
            if (this._isVertexShaderAttached) {
                this.gl.detachShader(this._handle, this._vertexShader.handle);
            }
            this.gl.attachShader(this._handle, shader.handle);
            this._vertexShader = shader;
            this._isVertexShaderAttached = true;
        } else if (shader.type == this.gl.FRAGMENT_SHADER) {
            if (this._isFragmentShaderAttached) {
                this.gl.detachShader(this._handle, this._fragmentShader.handle);
            }
            this.gl.attachShader(this._handle, shader.handle);
            this._fragmentShader = shader;
            this._isFragmentShaderAttached = true;
        }
    }

    link(): void {
        if (this._isLinked) {
            throw new Error("Program has already been linked!");
        }
        if (this._hasLinkError) {
            throw new Error(
                "Linking of program was requested before, but failed with error!"
            );
        }
        if (this._isDeleted) {
            throw new Error("Program has been deleted!");
        }

        if (!this._handleGenerated) {
            this.generateHandle();
        }
        this.gl.linkProgram(this._handle);
        let linkStatus = this.gl.getProgramParameter(
            this._handle,
            this.gl.LINK_STATUS
        );
        if (linkStatus) {
            this._isLinked = true;
            this._hasLinkError = false;
            this.populate();
        } else {
            this._isLinked = false;
            this._hasLinkError = true;
        }
    }

    validate(): void {
        if (!this._isLinked) {
            throw new Error("Program must be linked before validation!");
        }
        if (this._isDeleted) {
            throw new Error("Program has been deleted!");
        }

        this.gl.validateProgram(this._handle);
        let validationStatus = this.gl.getProgramParameter(
            this._handle,
            this.gl.VALIDATE_STATUS
        );
        if (validationStatus) {
            this._isValidated = true;
            this._hasValidationError = false;
        } else {
            this._isValidated = false;
            this._hasValidationError = true;
        }
    }

    delete(): void {
        if (this._isDeleted) {
            throw new Error("Program has already been deleted!");
        }

        this.gl.deleteProgram(this._handle);
        this._isDeleted = true;
    }

    getInfoLog(): string {
        if (this._isDeleted) {
            throw new Error("Program has been deleted!");
        }

        if (!this._handleGenerated) {
            this.generateHandle();
        }
        return this.gl.getProgramInfoLog(this._handle);
    }

    setUniform(name: string, value: any): void {
        let setter = this._uniformSetters[name];
        if (setter) {
            setter.apply(value);
        } else {
            throw new Error(
                `No uniform with name ${name} can be found in the program!`
            );
        }
    }

    use(): void {
        if (!this._isLinked) {
            throw new Error(
                "Program cannot be used before it has been linked!"
            );
        }
        if (this._isDeleted) {
            throw new Error("Program has been deleted!");
        }

        this.gl.useProgram(this._handle);
    }

    unuse(): void {
        this.gl.useProgram(null);
    }
}
