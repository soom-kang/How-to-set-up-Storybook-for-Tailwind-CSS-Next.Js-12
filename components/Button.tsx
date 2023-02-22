import type { FC } from 'react';

interface ButtonProps {
	name: string;
	className: string;
}

const Button: FC<ButtonProps> = ({ name, className }) => {
	return (
		<button className={`p-2 rounded-lg shadow-lg hover:shadow font-bold ${className}`}>
			{name}
		</button>
	);
};

export default Button;
