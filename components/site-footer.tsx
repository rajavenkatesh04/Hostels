export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8 py-3">
        <p className="text-xs text-muted-foreground">
           Developed by{' '}
          <a
            href="https://rajavenkatesh.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
          >
            Raja Venkatesh
          </a>
        </p>
      </div>
    </footer>
  )
}
