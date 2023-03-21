import React from "react";
import { StyledComponentPropsWithRef } from "styled-components";
import styled from "styled-components";

const Image = styled.img`
	display: block;
	border-radius: 50%;
	width: 100%;
	height: auto;
`;
const Container = styled.div<{ size: number }>`
	box-sizing: border-box;
	border-radius: 50%;
	border: 1px solid #cccccc;
	width: ${(props) => `${props.size}px`};
	height: ${(props) => `${props.size}px`};
	background-color: #ffffff;
	transition: transform 0.3s ease-in-out;
	&:hover {
		transform: scale(1.05);
	}
`;

type AvatarProps = StyledComponentPropsWithRef<typeof Container> & {
	size?: number;
	source: string;
	username?: string;
};

export function Avatar({ size = 24, source, username = "user", ...rest }: AvatarProps) {
	return (
		<Container size={size} {...rest}>
			<Image src={source} alt={`${username}-avatar`} />
		</Container>
	);
}
