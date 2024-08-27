import React, { useState } from "react";
import { Box, Save, X, Settings } from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Workflow from "@/types/Workflow";
import Task from "@/types/Task";

const API_ENDPOINT = "http://127.0.0.1:5000";

export default function WorkflowCreator() {
	const [triggerSelected, setTriggerSelected] = useState(true);
	const [currentTaskIdx, setCurrentTaskIdx] = useState<number>(0);

	// TODO allow setting name and make id set to be sequential/uuid
	const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow>({
		id: 1234,
		name: "New Workflow",
		trigger: "",
		tasks: [],
	});

	// trigger keys
	const triggers = [
		"New Email",
		"Form Submission",
		"Scheduled Event",
		"New Sign Up",
		"Invoice Received",
	];

	// task keys
	const tasks = [
		"Send Email",
		"Update Database",
		"Create Calendar Event",
		"Post to Social Media",
	];

	const addTrigger = (triggerName: string) => {
		if (selectedWorkflow) {
			selectedWorkflow.trigger = triggerName;
		}
		setTriggerSelected(true);
	};

	const updateTasksForWorkflow = (newTasks: Task[]) => {
		const newWorkflow = structuredClone(selectedWorkflow);
		if (newWorkflow) {
			newWorkflow.tasks = newTasks;
			setSelectedWorkflow(newWorkflow);
		}
	};

	const addTask = (taskName: string) => {
		setCurrentTaskIdx(currentTaskIdx + 1);
		selectedWorkflow?.tasks?.push({
			name: taskName,
			params: {},
			provider: "",
			needsKey: false,
		});

		if (selectedWorkflow !== null) {
			updateTasksForWorkflow(selectedWorkflow.tasks);
		}
	};

	const deleteTask = (taskIdx: number) => {
		const tasks = selectedWorkflow?.tasks;
		if (tasks) {
			const newTasks = [...tasks];
			newTasks.splice(taskIdx, 1);
			updateTasksForWorkflow(newTasks);
		}
	};

	const openParameterModal = (taskIdx: number) => {
		setCurrentTaskIdx(taskIdx);
	};

	const saveParameters = (parameters: Record<string, string>) => {
		console.log(selectedWorkflow);
		console.log(
			currentTaskIdx != -1 &&
				selectedWorkflow !== undefined &&
				selectedWorkflow.tasks !== undefined
		);
		if (
			currentTaskIdx != -1 &&
			selectedWorkflow !== undefined &&
			selectedWorkflow.tasks !== undefined
		) {
			selectedWorkflow.tasks[currentTaskIdx] = {
				name: selectedWorkflow.tasks[currentTaskIdx].name,
				provider: selectedWorkflow.tasks[currentTaskIdx].provider,
				needsKey: selectedWorkflow.tasks[currentTaskIdx].needsKey,
				params: parameters,
			};

			console.log(selectedWorkflow);
			updateTasksForWorkflow(selectedWorkflow.tasks);
		}
		setCurrentTaskIdx(-1);
	};

	const saveWorkflow = () => {
		fetch(API_ENDPOINT + "/add-workflow", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(selectedWorkflow),
		})
			.then((response) => response.json())
			.then((data) => {
				console.log("Workflow saved successfully:", data);
			})
			.catch((error) => {
				console.error("Error saving workflow:", error);
			});
	};

	return (
		<div className="container mx-auto p-4 max-w-4xl">
			<Card>
				<CardHeader>
					<CardTitle>Workflow Manager</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="mb-6">
						<h2 className="text-lg font-semibold mb-2">1. Select a Trigger</h2>
						<Select onValueChange={addTrigger}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a trigger" />
							</SelectTrigger>
							<SelectContent>
								{triggers.map((trigger) => (
									<SelectItem key={trigger} value={trigger}>
										{trigger}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="mb-6">
						<h2 className="text-lg font-semibold mb-2">2. Add Tasks</h2>

						<Select onValueChange={addTask} disabled={!triggerSelected}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select a task to add" />
							</SelectTrigger>
							<SelectContent>
								{tasks.map((task) => (
									<SelectItem key={task} value={task}>
										{task}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="mb-6">
						<h2 className="text-lg font-semibold mb-2">3. Workflow</h2>
						<div className="space-y-4">
							{selectedWorkflow?.tasks?.map((step, index) => (
								<div key={index} className="flex items-center">
									<div
										className={`w-10 h-10 rounded-full flex items-center justify-center ${"bg-blue-100"}`}
									>
										{<Box className="w-6 h-6 text-blue-600" />}
									</div>
									<div className="ml-4 flex-grow">
										<div className={`p-2 rounded ${"bg-blue-50"}`}>
											<div className="flex justify-between items-center">
												<span>{step.name}</span>
												<div>
													<Button
														variant="ghost"
														size="sm"
														onClick={() => openParameterModal(index)}
													>
														<Settings className="w-4 h-4" />
													</Button>
													{
														<Button
															variant="ghost"
															size="sm"
															onClick={() => deleteTask(index)}
														>
															<X className="w-4 h-4" />
														</Button>
													}
												</div>
											</div>
											{step.params &&
												Object.entries(step.params).length > 0 && (
													<div className="mt-2 text-sm text-gray-600">
														Parameters:{" "}
														{Object.entries(step.params)
															.map(([key, value]) => `${key}: ${value}`)
															.join(", ")}
													</div>
												)}
										</div>
									</div>
									{selectedWorkflow &&
										selectedWorkflow.tasks &&
										index < selectedWorkflow.tasks.length - 1 && (
											<div className="w-px h-8 bg-gray-300 mx-5"></div>
										)}
								</div>
							))}
						</div>
					</div>

					<div className="flex justify-end space-x-2">
						<Button
							onClick={saveWorkflow}
							disabled={
								selectedWorkflow !== null && selectedWorkflow.tasks.length < 2
							}
						>
							<Save className="w-4 h-4 mr-2" />
							Save Workflow
						</Button>
					</div>
				</CardContent>
			</Card>

			<Dialog
				open={currentTaskIdx !== -1}
				onOpenChange={(open) => !open && setCurrentTaskIdx(-1)}
			>
				{selectedWorkflow &&
				selectedWorkflow.tasks &&
				selectedWorkflow.tasks[currentTaskIdx] !== undefined ? (
					<DialogContent>
						<DialogHeader>
							<DialogTitle>
								Set Parameters for{" "}
								{selectedWorkflow?.tasks[currentTaskIdx].name}
							</DialogTitle>
						</DialogHeader>
						<ParameterForm
							task={selectedWorkflow?.tasks[currentTaskIdx]}
							onSave={saveParameters}
						/>
					</DialogContent>
				) : (
					<></>
				)}
			</Dialog>
		</div>
	);
}

type ParameterFormProps = {
	task: Task | undefined;
	onSave: (parameters: Record<string, string>) => void;
};

function ParameterForm({ task, onSave }: ParameterFormProps) {
	console.log(task);
	// Constant map of every param
	const taskParamMap: Record<string, string[]> = {
		"Send Email": ["to", "from"],
		"Update Database": ["row", "col", "val"],
		"Create Calendar Event": ["date", "time", "title"],
		"Post to Social Media": ["text"],
	};

	const [parameters, setParameters] = useState<Record<string, string>>(
		task?.params || {}
	);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSave(parameters);
	};

	const handleChange = (key: string, value: string) => {
		setParameters({ ...parameters, [key]: value });
	};

	if (task && taskParamMap[task.name] == undefined) {
		taskParamMap[task.name] = ["outputTransform"];
	}
	if (task) {
		return (
			<form onSubmit={handleSubmit}>
				{taskParamMap[task.name].map((param) => (
					<div key={param} className="mb-4">
						<Label htmlFor={param}>{param}</Label>
						<Input
							id={param}
							value={parameters[param] || ""}
							onChange={(e) => handleChange(param, e.target.value)}
							placeholder={`Enter ${param}`}
						/>
					</div>
				))}
				<Button type="submit">Save Parameters</Button>
			</form>
		);
	}
}
