import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ZapIcon, ListIcon, EyeIcon, XIcon } from "lucide-react";

import Task from "@/types/Task";
import Workflow from "@/types/Workflow";

export default function Component() {
	const [workflows, setWorkflows] = useState<Workflow[]>([]);
	const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(
		null
	);
	const [loading, setLoading] = useState<boolean>(true);

	// Fetch the workflows from the local file
	useEffect(() => {
		const fetchWorkflows = async () => {
			try {
				const response = await fetch("/workflows.json"); // Path to the local JSON file
				const data: Workflow[] = await response.json();
				setWorkflows(data);
				setSelectedWorkflow(data[0]);
				setLoading(false);
			} catch (error) {
				console.error("Error loading workflows:", error);
				setLoading(false);
			}
		};

		fetchWorkflows();
	}, []);

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-6">Your Workflows</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="md:col-span-2">
					{loading ? (
						<p>Loading workflows...</p>
					) : (
						<ScrollArea className="h-[calc(100vh-150px)]">
							{workflows.map((workflow) => (
								<Card key={workflow.id} className="mb-4">
									<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
										<CardTitle className="text-sm font-medium">
											{workflow.name}
										</CardTitle>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => setSelectedWorkflow(workflow)}
										>
											<EyeIcon className="h-4 w-4" />
											<span className="sr-only">Preview workflow</span>
										</Button>
									</CardHeader>
									<CardContent>
										<div className="flex items-center space-x-4 text-sm text-muted-foreground">
											<div className="flex items-center">
												<ZapIcon className="mr-1 h-3 w-3" />
												{workflow.trigger}
											</div>
											<div className="flex items-center">
												<ListIcon className="mr-1 h-3 w-3" />
												{workflow.tasks?.length} tasks
											</div>
										</div>
									</CardContent>
									<Button
										onClick={() => {
											window.location.href = `/edit/${workflow.id}`;
										}}
										className="block p-2 ml-4 mb-4 hover:underline"
									>
										Manage Workflow
									</Button>
								</Card>
							))}
						</ScrollArea>
					)}
				</div>
				<div>
					<div className="mb-4">
						<text>Preview Workflows Below or Create a New One</text>
					</div>
					<Card className="sticky top-4">
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">
								Workflow {selectedWorkflow !== null && selectedWorkflow.id}{" "}
								Preview
							</CardTitle>
							{selectedWorkflow && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSelectedWorkflow(null)}
								>
									<XIcon className="h-4 w-4" />
									<span className="sr-only">Close preview</span>
								</Button>
							)}
						</CardHeader>
						<CardContent>
							{selectedWorkflow ? (
								<div className="space-y-4">
									<h3 className="font-semibold">{selectedWorkflow.name}</h3>
									<div>
										<h4 className="text-sm font-medium text-muted-foreground">
											Trigger:
										</h4>
										<p className="text-sm">{selectedWorkflow.trigger}</p>
									</div>
									<div>
										<h4 className="text-sm font-medium text-muted-foreground">
											Tasks:
										</h4>
										<ul className="list-disc list-inside text-sm">
											{selectedWorkflow.tasks?.map((task, index) => (
												<li key={index}>{task.provider + ": " + task.name}</li>
											))}
										</ul>
									</div>
								</div>
							) : (
								<p className="text-sm text-muted-foreground">
									Click a workflow preview button to view details
								</p>
							)}
						</CardContent>
					</Card>
					<Button
						onClick={() => {
							window.location.href = `/create`;
						}}
						className="mt-4"
					>
						Create New Workflow
					</Button>
				</div>
			</div>
		</div>
	);
}
