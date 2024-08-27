"use client";

import LayoutWrapper from "@/components/layoutwrapper";
import WorkflowCreator from "@/components/WorkflowCreator";

export default function Page() {
	return (
		<LayoutWrapper>
			<main className="flex min-h-screen flex-col items-center justify-between p-24">
				<WorkflowCreator />
			</main>
		</LayoutWrapper>
	);
}
