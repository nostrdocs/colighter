import React from 'react';
import styled, {
  DefaultTheme,
  StyledComponentPropsWithRef,
} from 'styled-components';
import { variant } from 'styled-system';

type Variants = 'primary' | 'secondary';

const buttonVariant = ({ theme }: { theme: DefaultTheme }) =>
  variant({
    variants: {
      primary: {
        color: theme.palette.white,
        background: `linear-gradient(180deg, ${theme.palette.primary} 0%, ${theme.palette.primaryTint} 75%)`,
      },
      secondary: {
        color: theme.palette.textLight,
        background: `linear-gradient(180deg, ${theme.palette.secondary} 0%, ${theme.palette.secondaryTint} 75%)`,
      },
    },
  });
const StyledButton = styled.button<{ variant: Variants }>`
  cursor: pointer;
  outline: none;
  border: 0;
  border-radius: 50px;
  padding: 10px;
  font-size: 1.2rem;
  font-weight: 600;
  ${buttonVariant}
`;

type ButtonProps = StyledComponentPropsWithRef<typeof StyledButton> & {
  title: string;
  variant?: Variants;
};
export function Button({ title, variant = 'primary', ...rest }: ButtonProps) {
  return (
    <StyledButton variant={variant} {...rest}>
      {title}
    </StyledButton>
  );
}
