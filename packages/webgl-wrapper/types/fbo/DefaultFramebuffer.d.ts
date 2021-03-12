export interface DefaultFramebuffer {
    width: number;
    height: number;
    applyViewport(): void;
    bind(target?: GLenum): void;
}
