import Navbar from "@/components/navbar";

export default function LayoutWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<>
			<Navbar />
			<main>{children}</main>
		</>
	);
}
