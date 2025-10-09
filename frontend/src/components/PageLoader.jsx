import { LoaderIcon } from "lucide-react"


export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-800">
        <LoaderIcon className="text-white animate-spin size-10 text-primary" />
    </div>
  )
}
