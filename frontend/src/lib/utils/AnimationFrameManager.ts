export class AnimationFrameManager {
    private handles = new Set<number>();
    private disposed = false;

    public requestFrame(callback: FrameRequestCallback): number {
        if (this.disposed) return 0;

        const handle = requestAnimationFrame((time) => {
            this.handles.delete(handle);
            if (!this.disposed) callback(time);
        });

        this.handles.add(handle);
        return handle;
    }

    public dispose(): void {
        this.disposed = true;
        this.handles.forEach(handle => cancelAnimationFrame(handle));
        this.handles.clear();
    }
}
