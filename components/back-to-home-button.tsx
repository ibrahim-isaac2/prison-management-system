import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"

export default function BackToHomeButton() {
  return (
    <Link href="/">
      <Button
        variant="outline"
        className="mb-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white bg-transparent"
      >
        <Home className="h-4 w-4 ml-2" />
        العودة للرئيسية
      </Button>
    </Link>
  )
}
