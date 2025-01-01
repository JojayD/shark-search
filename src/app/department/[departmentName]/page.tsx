"use client"
import { notFound, useSearchParams } from 'next/navigation';
import { DepartmentType } from "@/types/departmentType";
import { useEffect, useState } from "react";
import { ClassType } from "@/types/classType";

type PageProps = {
    params: {
        name: string;
        data: DepartmentType;
    };
};

export default function DepartmentClasses({ params }: PageProps) {
    const [departmentDetails, setDepartmentDetails] = useState<DepartmentType | null>(null);
    const [classes, setClasses] = useState<ClassType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const searchParams = useSearchParams();

    // Handle search params data
    useEffect(() => {
        const queryData = searchParams.get("data");
        if (queryData) {
            try {
                const parsedData: DepartmentType = JSON.parse(decodeURIComponent(queryData));
                console.log(parsedData)
                setDepartmentDetails(parsedData);
            } catch (error) {
                setError("Error parsing department data");
                console.error("Error parsing query data:", error);
            }
        }
    }, [searchParams]);

    // Fetch classes data
    useEffect(() => {
        const fetchClasses = async () => {
            if (!departmentDetails?.code) return;

            try {
                setIsLoading(true);
                const response = await fetch(`/data/${departmentDetails.code}.json`);
                if (!response.ok) {
                    throw new Error(`Failed to fetch classes for ${departmentDetails.name}`);
                }

                const jsonData: ClassType[] = await response.json();
                setClasses(jsonData);
                console.log("Successfully loaded json data")
            } catch (error) {
                setError(`Error loading classes: ${error instanceof Error ? error.message : 'Unknown error'}`);
                console.error("Failed to fetch classes:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClasses();
    }, [departmentDetails?.code]); // Only depend on the code property

    if (error) {
        return (
            <div className="p-4 text-red-600">
                <h5 className="text-xl font-semibold">{error}</h5>
            </div>
        );
    }

    if (isLoading || !departmentDetails) {
        return (
            <div className="p-4">
                <h5 className="text-xl font-semibold">Loading...</h5>
            </div>
        );
    }

    return (
        <div>
            <h1 className="text-2xl font-bold">Department of {departmentDetails.name}</h1>
            {classes && (
                <div className="mt-4">
                    {classes.map((classItem,index) => (
                        <div key={index}>{classItem.CLASS}</div>
                    ))}
                </div>
            )}
        </div>
    );
}