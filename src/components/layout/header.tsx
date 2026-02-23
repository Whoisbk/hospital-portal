'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from '@/components/ui/breadcrumb'

interface HeaderProps {
  readonly title: string
  readonly description?: string
}

export default function Header({ title, description }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center gap-3 border-b border-border bg-card px-6">
      <SidebarTrigger className="-ml-2 text-muted-foreground hover:text-foreground" />
      <Separator orientation="vertical" className="h-5" />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbPage className="text-foreground font-medium">{title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      {description && (
        <>
          <Separator orientation="vertical" className="h-5" />
          <span className="text-sm text-muted-foreground hidden md:inline">{description}</span>
        </>
      )}
    </header>
  )
}
