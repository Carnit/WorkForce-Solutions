# shadcn/ui Components Setup Guide

✅ **Setup Complete!** Your project now has shadcn/ui components configured and ready to use.

## Installed Dependencies

```bash
✓ clsx@2.1.1
✓ class-variance-authority@0.7.1
✓ tailwind-merge@3.4.0
```

## Available Components

### 1. **Button**
Versatile button component with multiple variants and sizes.

```tsx
import { Button } from "@/components/ui/button"

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="default">Default</Button>
<Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Delete</Button>
<Button variant="link">Link</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">🔍</Button>
```

### 2. **Input**
Form input field with focus states and accessibility.

```tsx
import { Input } from "@/components/ui/input"

<Input 
  type="email"
  placeholder="Enter your email"
  disabled={false}
/>
```

### 3. **Card**
Container component for grouping content.

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card"

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    Your content here
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### 4. **Badge**
Small label or status indicator.

```tsx
import { Badge } from "@/components/ui/badge"

<Badge>Default</Badge>
<Badge variant="secondary">Secondary</Badge>
<Badge variant="destructive">Error</Badge>
<Badge variant="outline">Outline</Badge>
```

### 5. **Dialog**
Modal dialog component with trigger and content.

```tsx
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog"

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description goes here
      </DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      {/* Footer buttons */}
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## How to Import

All components are available from the UI index:

```tsx
import { Button, Card, Input, Badge, Dialog } from "@/components/ui"
```

Or import individually:

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
```

## Customizing Components

Components use Tailwind CSS classes and `class-variance-authority` for variants. To customize:

1. **Button variants** are in `src/components/ui/button-variants.ts`
2. **Base styles** are in each component file using the `cn()` utility
3. The `cn()` utility from `@/lib/utils` merges Tailwind classes intelligently

### Example: Add a new Button variant

```tsx
// In button-variants.ts
export const buttonVariants = cva(
  "...", // base styles
  {
    variants: {
      variant: {
        // ... existing variants
        gradient: "bg-gradient-to-r from-blue-600 to-teal-500 text-white hover:shadow-lg",
      },
    },
  }
)
```

## Color Palette

Your components use the **Cool Aesthetic** with:
- **Primary**: Blue-600 (`#2563EB`)
- **Secondary**: Teal-500 (`#14B8A6`)
- **Neutral**: Slate colors
- **Destructive**: Red-600 (`#DC2626`)

## Replacing Current Implementation

You can now replace your custom components with shadcn versions:

### Example: Update AuthModal

```tsx
// Before: Custom modal divs
<div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
    {/* Content */}
  </div>
</div>

// After: Using shadcn Dialog
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui"

<Dialog open={showAuth} onOpenChange={setShowAuth}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Join Workforce</DialogTitle>
    </DialogHeader>
    {/* Content */}
  </DialogContent>
</Dialog>
```

## Next Steps

1. **Try replacing components** in your modals and forms
2. **Add more components** as needed (Textarea, Select, etc.)
3. **Create custom variants** for your brand
4. **Reference shadcn docs** at https://ui.shadcn.com for advanced usage

## Troubleshooting

- If imports fail, ensure `@/` path alias is configured in `tsconfig.json` and `vite.config.ts`
- Components use Tailwind CSS v4, which is already installed
- Use `cn()` utility for conditional class merging

## Additional Resources

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS Docs](https://tailwindcss.com)
- [Class Variance Authority](https://cva.style)
