import { useEffect, useState } from "react"

/** Waits until typing pauses before the value changes, so we don't fire a request per keystroke */
const useDebouncedValue = <T>(value: T, ms: number) => {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), ms)
    return () => clearTimeout(t)
  }, [value, ms])

  return debounced
}

export default useDebouncedValue
