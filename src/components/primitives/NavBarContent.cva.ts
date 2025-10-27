import { type VariantProps, cva } from 'class-variance-authority'

/**
 * NavBarContent: Navigation bar content layout primitive
 * Provides flex layout with justify-between for start/end content sections
 *
 * Part of compound component: NavBar + NavBarContent
 *
 * Use with Container for max-width constraints:
 * <NavBar>
 *   <Container>
 *     <NavBarContent>...</NavBarContent>
 *   </Container>
 * </NavBar>
 */
export const navBarContentCva = cva(['flex', 'flex-row', 'items-center', 'justify-between'], {
  variants: {
    height: {
      sm: 'h-12', // 48px
      md: 'h-16', // 64px (default)
      lg: 'h-20', // 80px
      xl: 'h-24', // 96px
    },
  },
  defaultVariants: {
    height: 'md',
  },
})

export type NavBarContentStyle = VariantProps<typeof navBarContentCva>
