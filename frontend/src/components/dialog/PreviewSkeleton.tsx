const PreviewSkeleton = () => {
  return (
    <div className="flex flex-col gap-3" aria-hidden>
      <div className="h-22.5 animate-pulse rounded-md bg-muted" />
      <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-12.5 animate-pulse bg-muted" />
        ))}
      </div>
    </div>
  )
}

export default PreviewSkeleton
