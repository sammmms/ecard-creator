import { Loader2 } from "lucide-react";

export default function PageLoader() {
  return (
    <div className="flex justify-center p-12">
      <Loader2 className="animate-spin loader-theme" size={32} />
    </div>
  );
}
