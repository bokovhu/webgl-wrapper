export interface VertexAttribute {
    index: number;
    name?: string | null;
    type: GLenum;
    length: number;
    normalized?: boolean;
}
