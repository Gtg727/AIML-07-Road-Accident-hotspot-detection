import { Download, Bell, RefreshCw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  onDownload: () => void;
}

export function Header({ onDownload }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="flex items-center justify-between px-6 py-3">
        {/* Logo + Title */}
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange/10 orange-glow">
            <Shield className="h-5 w-5 text-orange" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-widest text-orange">NHAI</span>
              <span className="h-3 w-px bg-border" />
              <span className="text-xs text-muted-foreground">Government of India</span>
            </div>
            <h1 className="text-sm font-bold leading-tight text-foreground md:text-base">
              AI Road Accident Hotspot Detection & Risk Prediction
            </h1>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs text-muted-foreground sm:flex">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-risk-low" />
            Live Data · Updated 2 min ago
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="relative h-8 w-8 text-muted-foreground hover:text-foreground">
            <Bell className="h-4 w-4" />
            <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-orange" />
          </Button>
          <Button
            onClick={onDownload}
            className="h-8 gap-2 bg-orange text-primary-foreground hover:bg-orange/90 orange-glow text-xs"
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Download Report</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
