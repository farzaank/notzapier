"use client";

import { useParams } from "next/navigation";
import WorkflowEditor from "@/components/WorkflowEditor";
import LayoutWrapper from "@/components/layoutwrapper";

export default function Page() {
	const params = useParams();
	const id = params.id;
	return (
		<LayoutWrapper>
			<WorkflowEditor id={Number(id)} />
		</LayoutWrapper>
	);
}
