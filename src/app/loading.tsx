export default function Loading() {
    return (
        <>
            <div className="flex items-center px-6 py-4 border-b border-border shrink-0">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-accent animate-pulse" />
                    <div className="space-y-1.5">
                        <div className="h-4 w-24 bg-accent animate-pulse rounded" />
                        <div className="h-2.5 w-14 bg-accent animate-pulse rounded" />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">

                <div className="flex gap-2 max-w-[65%]">
                    <div className="w-7 h-7 rounded-full bg-accent animate-pulse shrink-0 mt-1" />
                    <div className="space-y-2">
                        <div className="h-10 w-48 bg-accent animate-pulse rounded-2xl rounded-tl-sm" />
                        <div className="h-10 w-32 bg-accent animate-pulse rounded-2xl rounded-tl-sm" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="space-y-2 max-w-[65%]">
                        <div className="h-10 w-40 bg-accent animate-pulse rounded-2xl rounded-tr-sm ml-auto" />
                    </div>
                </div>

                <div className="flex gap-2 max-w-[65%]">
                    <div className="w-7 h-7 rounded-full bg-accent animate-pulse shrink-0 mt-1" />
                    <div className="space-y-2">
                        <div className="h-10 w-56 bg-accent animate-pulse rounded-2xl rounded-tl-sm" />
                    </div>
                </div>

                <div className="flex justify-end">
                    <div className="space-y-2 max-w-[65%]">
                        <div className="h-10 w-44 bg-accent animate-pulse rounded-2xl rounded-tr-sm ml-auto" />
                        <div className="h-10 w-28 bg-accent animate-pulse rounded-2xl rounded-tr-sm ml-auto" />
                    </div>
                </div>
            </div>

            <div className="shrink-0 border-t border-border px-6 py-4">
                <div className="flex items-end gap-3">
                    <div className="h-10 flex-1 bg-accent animate-pulse rounded-md" />
                    <div className="h-10 w-10 bg-accent animate-pulse rounded-lg shrink-0" />
                </div>
            </div>
        </>
    );
}
