declare module "*.svg" {
    const content: string
    export default content
}

declare module "*.png" {
    const content: string
    export default content
}

declare module "*.jpg" {
    const content: string
    export default content
}

declare module "*.jpeg" {
    const content: string
    export default content
}

declare module "*.gif" {
    const content: string
    export default content
}

// Hỗ trợ require với dynamic path
declare const require: {
    (path: string): any
    context(directory: string, useSubdirectories: boolean, regExp: RegExp): any
}
