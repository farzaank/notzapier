"use client";

import LayoutWrapper from "@/components/layoutwrapper";
import WorkflowManager from "@/components/WorkflowManager";

export default function Page() {
	return (
		<LayoutWrapper>
			<main className="flex min-h-screen flex-col items-center justify-between px-24 py-10">
				<WorkflowManager />
			</main>
		</LayoutWrapper>
	);
}
