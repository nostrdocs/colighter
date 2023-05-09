import React from "react";
import { StyledComponentPropsWithRef } from "styled-components";
import styled from "styled-components";
import { variant } from "styled-system";
import { Avatar } from "./Avatar";
import { IUser } from "../../../types";

type Variants = "row" | "col";

const containerVariants = () =>
  variant({
    variants: {
      row: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
      },
      col: {
        display: "flex",
        flexDirection: "column",
      },
    },
  });
export const Container = styled.div<{ variant: Variants }>`
  margin: 0.8rem;
  ${containerVariants}
`;

type AvatarListProps = StyledComponentPropsWithRef<typeof Container> & {
  avatarClassName?: string;
  avatarSize?: number;
  maxUsers?: number;
  users: IUser[];
  variant?: Variants;
};

const User = styled(Avatar)`
  margin-left: -0.8rem;
`;

export function AvatarList({
  avatarClassName,
  avatarSize,
  variant = "row",
  users,
  maxUsers,
  ...rest
}: AvatarListProps) {
  return (
    <Container variant={variant} {...rest}>
      {users?.slice(0, maxUsers).map((user) => (
        <User
          username={user.userName}
          key={user.userName}
          source={user.imageUrl}
          size={avatarSize}
          className={avatarClassName}
        />
      ))}
    </Container>
  );
}
