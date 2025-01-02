"use client"
import { notFound, useSearchParams } from 'next/navigation';
import { DepartmentType } from "@/types/departmentType";
import React, { useEffect, useState } from "react";
import { ClassType } from "@/types/classType";
 import BackButton from "@/app/class/[courseCode]/[section]/_components/BackButton";
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
            <div className={"p-4 flex justify-between items-center"}>
                <h1 className="text-2xl font-bold">Department of {departmentDetails.name}</h1>
                <BackButton address={'/'}/>
            </div>

            {classes && (
                <div className="mt-4">
                    {classes.map((classItem, index) => (
                        <div key={index} className="p-4 border-2 border-gray-300 rounded-md">
                            <h1 className={`text-2xl`}>{classItem.COURSETITLE} - {classItem.SEC}</h1>
                            <p className="text-lg font-medium mb-2">Section: {classItem.SEC}</p>
                            <p className="text-base mb-2">Instructor: {classItem.INSTRUCTOR}</p>
                            <p className="text-base mb-2">Days: {classItem.DAYS}</p>
                            <p className="text-base mb-2">Time: {classItem.TIME}</p>
                            <p className="text-base mb-2">Location: {classItem.LOCATION}</p>
                            <p className="text-base mb-2">Units: {classItem.Units}</p>
                            <p className="text-base mb-2">Notes: {classItem.CLASSNOTES}</p>
                            <p className="text-base mb-2">Comment: {classItem.COMMENT}</p>
                        </div>
                    ))}
                </div>
            )}
            
        </div>
    );
}