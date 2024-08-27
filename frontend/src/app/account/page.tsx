"use client";

import LayoutWrapper from "@/components/layoutwrapper";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import LoadingSpinner from "@/components/LoadingSpinner";

const API_ENDPOINT = "http://127.0.0.1:5000";

export default function Page() {
	const [apiKeys, setApiKeys] = useState<Record<string, string>[]>([]);
	const [loading, setLoading] = useState(true); // Loading state

	useEffect(() => {
		fetch("/keys.json")
			.then((response) => response.json())
			.then((data) => {
				setApiKeys(data);
				setLoading(false); // Stop loading once data is fetched
			})
			.catch((error) => {
				console.error("Error fetching API keys:", error);
				setLoading(false); // Stop loading even if there's an error
			});
	}, []);

	const handleUpdateKeys = () => {
		setLoading(true);
		fetch(API_ENDPOINT + "/update-keys", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(apiKeys),
		})
			.then((response) => {
				setLoading(false);
				if (response.ok) {
					console.log("Keys updated successfully");
				} else {
					console.error("Failed to update keys");
				}
			})
			.catch((error) => {
				console.error("Error updating keys:", error);
				setLoading(false);
			});
	};

	const handleInputChange = (index: number, newValue: string) => {
		const updatedKeys: Record<string, string>[] = [...apiKeys];
		updatedKeys[index].value = newValue;
		setApiKeys(updatedKeys);
	};

	return (
		<LayoutWrapper>
			<div className="m-4">
				<h1>Manage API Keys</h1>

				{loading ? (
					<div className="flex justify-center items-center">
						<LoadingSpinner />
					</div>
				) : (
					<>
						<Card>
							{apiKeys.map((pair: any, index) => (
								<div key={pair.name} className="m-4">
									<text>{pair.name}</text>
									<Input
										defaultValue={pair.value}
										onChange={(e) => handleInputChange(index, e.target.value)}
									/>
								</div>
							))}
						</Card>
						<Button
							onClick={handleUpdateKeys}
							className="mt-4"
							disabled={loading}
						>
							{loading ? "Updating..." : "Update Keys"}
						</Button>
					</>
				)}
			</div>
		</LayoutWrapper>
	);
}
