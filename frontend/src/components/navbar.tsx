import React from "react";
import { Button } from "./ui/button";

const NavBar: React.FC = () => {
	return (
		<nav className="py-4 pl-4 font-bold flex justify-between items-center bg-stone-50 bg-transparent">
			<a href="/" className="company-name">
				NotZapier
			</a>
			<Button
				onClick={() => {
					window.location.href = `/account/`;
				}}
				className="mr-4"
			>
				Manage Account
			</Button>
		</nav>
	);
};

export default NavBar;
