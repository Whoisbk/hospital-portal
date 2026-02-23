import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { type LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  subtitle: string
  icon: LucideIcon
  trend?: 'up' | 'down' | 'neutral'
}

export function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
  return (
    <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <span className="text-3xl font-bold tracking-tight text-foreground">{value}</span>
            <span className={cn(
              "text-xs font-medium mt-1",
              trend === 'up' && "text-emerald-600",
              trend === 'down' && "text-destructive",
              (!trend || trend === 'neutral') && "text-muted-foreground"
            )}>
              {subtitle}
            </span>
          </div>
          <div className="flex items-center justify-center size-12 rounded-xl bg-primary/10">
            <Icon className="size-6 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
