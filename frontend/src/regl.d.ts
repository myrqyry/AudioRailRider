declare module 'regl' {
  type ReglContext = any; // A basic type for the Regl context
  type DrawCommand = (props?: any) => void;
  type ReglRenderLoop = {
    cancel: () => void;
  };

  interface ReglOptions {
    canvas?: HTMLCanvasElement | null;
    gl?: WebGLRenderingContext | null;
    attributes?: WebGLContextAttributes;
    pixelRatio?: number;
    extensions?: string[];
    optionalExtensions?: string[];
    profile?: boolean;
    onDone?: (err: Error | null, regl: Regl) => void;
  }

  interface Regl {
    (options?: ReglOptions): Regl;
    clear(options: any): void;
    prop(name: string): any;
    context(name: string): any;
    frame(callback: (context: ReglContext) => void): ReglRenderLoop;
    (drawConfig: any): DrawCommand;
    destroy(): void;
    // Add other regl methods as needed
  }

  const createREGL: (options?: ReglOptions | HTMLCanvasElement) => Regl;
  export = createREGL;
}