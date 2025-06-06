import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen w-full flex items-center justify-center bg-gray-50"
      data-oid="vcje1za"
    >
      <Card className="w-full max-w-md mx-4" data-oid="oa37rzu">
        <CardContent className="pt-6" data-oid="_nvs23.">
          <div className="flex mb-4 gap-2" data-oid="x6w92t0">
            <AlertCircle className="h-8 w-8 text-red-500" data-oid="jzlcss3" />
            <h1 className="text-2xl font-bold text-gray-900" data-oid="mebgyxk">
              404 Page Not Found
            </h1>
          </div>

          <p className="mt-4 text-sm text-gray-600" data-oid="y:iaf50">
            Did you forget to add the page to the router?
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
