"use client"
import { useSearchParams } from 'next/navigation';
import { DepartmentType } from "@/types/departmentType";
import React, { useEffect, useState } from "react";
import { ClassType } from "@/types/classType";
import BackButton from "@/app/department/[departmentName]/_components/BackButton";
import {ProfessorRating} from "@/types/professorRating";
import {ThreeDot} from "react-loading-indicators";

const normalizeProfessorNameFromClassesState = (name: string): string => {
    if (!name) return '';

    const cleanName = name.trim().toLowerCase();

    if (cleanName.includes(',')) {
        const [lastName] = cleanName.split(',');
        return lastName.trim(); // Just return the last name
    }

    const nameParts = cleanName.split(' ');
    return nameParts[0].toLowerCase();
};



const normalizeProfessorNameFromProfessorState = (name: string): string => {
    if (!name) return '';

    const cleanName = name.trim().toLowerCase();

    if (cleanName.includes(',')) {
        const [lastName] = cleanName.split(',');
        return lastName.trim();
    }

    const nameParts = cleanName.split(' ');
    console.log(nameParts[1].toLowerCase());
    return nameParts[1].toLowerCase();
};

export default function DepartmentClasses() {
    const [departmentDetails, setDepartmentDetails] = useState<DepartmentType | null>(null);
    const [classes, setClasses] = useState<ClassType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [professorRatings ,setProfessorRatings] =useState<ProfessorRating[] | null>();
    const [isProfessorRatingLoading, setIsProfessorRatingLoading] = useState<Boolean>(true);
    const searchParams = useSearchParams();

    const getProfessorRating = (instructorName: string) => {
      if (!professorRatings) return null;

      const normalizedInstructorName = normalizeProfessorNameFromClassesState(instructorName);

      return professorRatings.find((rating) => {
        const normalizedRatingName = normalizeProfessorNameFromProfessorState(rating.formattedName);
        console.log('Comparing:', {
          instructor: normalizedInstructorName,
          rating: normalizedRatingName,
          ratingProfessor: rating.formattedName
        });
        return normalizedInstructorName === normalizedRatingName;
      });
    };
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
                console.log("Successfully loaded json data");
            } catch (error) {
                setError(`Error loading classes: ${error instanceof Error ? error.message : 'Unknown error'}`);
                console.error("Failed to fetch classes:", error);
            } finally {
                setIsLoading(false);
            }
        };


        fetchClasses();
    }, [departmentDetails?.code]); // Only depend on the code property

    useEffect(() => {
        const fetchProfessorRatings = async () => {
            if (!departmentDetails || !classes) return;

            try {
                const schoolName = "California State University, Long Beach";

                // Get school ID
                const responseSchoolId = await fetch(
                    `/api/ratemyprofessor?action=searchSchool&schoolName=${encodeURIComponent(schoolName)}`
                );

                if (!responseSchoolId.ok) {
                    throw new Error(`Failed to fetch school ID`);
                }

                const schoolData = await responseSchoolId.json();
                const schoolId = schoolData.schools[0]?.node?.id;

                if (!schoolId) {
                    throw new Error("School ID not found");
                }

                // Fetch all professor ratings in parallel
                const ratingsPromises = classes.map(async (c: ClassType) => {
                    if (!c.INSTRUCTOR) return null;

                    try {
                        const response = await fetch(
                            `/api/ratemyprofessor?action=getProfessorRating&professorName=${encodeURIComponent(c.INSTRUCTOR)}&schoolId=${schoolId}`
                        );

                        if (!response.ok) return null;

                        const data = await response.json();
                        return data.rating;
                    } catch (error) {
                        console.error(`Error fetching rating for ${c.INSTRUCTOR}:`, error);
                        return null;
                    }
                });

                const ratings = (await Promise.all(ratingsPromises))
                    .filter((rating): rating is ProfessorRating => rating !== null);

                setProfessorRatings(ratings);
            } catch (error) {
                console.error("Error fetching professor ratings:", error);
                setError("An error occurred while fetching professor ratings.");
            } finally {
                setIsProfessorRatingLoading(false);
            }
        };

        if (departmentDetails && classes) {
            fetchProfessorRatings();
        }
    }, [departmentDetails, classes]);


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
            <div className="p-4 flex justify-between items-center mx-auto">
                <h1 className="text-2xl font-bold">Department of {departmentDetails.name}</h1>
                <BackButton address="/"/>
            </div>
            {isProfessorRatingLoading&&
              <div className={`flex justify-center items-center`}>
                <ThreeDot
                    variant="bounce"
                    color="#FBBF24"
                    size="medium"
                    text="loading professor"
                    textColor="#FBBF24"
                />
            </div>
            }
            {classes && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center w-3/4 mx-auto">
                    {classes.map((classItem, index) => {
                        const professorRating = classItem?.INSTRUCTOR
                            ? getProfessorRating(classItem.INSTRUCTOR)
                            : null;

                        return (
                            <div
                                key={index}
                                className="p-6 bg-white border border-gray-200 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-xl mb-1"
                            >
                                <h1 className="text-xl font-bold text-gray-800">
                                    {classItem?.COURSETITLE || "No Title"} - {classItem?.SEC || "No Section"}
                                </h1>
                                <p className="text-gray-700 font-medium mt-2">
                                    Section: {classItem?.SEC || "N/A"}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Instructor: {classItem?.INSTRUCTOR || "N/A"}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Days: {classItem?.DAYS || "N/A"}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Time: {classItem?.TIME || "N/A"}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Location: {classItem?.LOCATION || "N/A"}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Units: {classItem?.Units || "N/A"}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Notes: {classItem?.CLASSNOTES || "None"}
                                </p>
                                <p className="text-gray-600 mt-1">
                                    Comment: {classItem?.COMMENT || "None"}
                                </p>
                                {isProfessorRatingLoading ? (
                                    <div className="text-gray-500 italic mt-4">Loading rating...</div>
                                ) : professorRating ? (
                                    <div className="mt-4 border-t pt-4">
                                        <h3 className="text-lg font-semibold text-gray-800">Professor Rating</h3>
                                        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-2">
                                            <p>
                                                Rating:{" "}
                                                <span
                                                    className="font-medium">{professorRating.avgRating.toFixed(1)}/5.0</span>
                                            </p>
                                            <p>
                                                Difficulty:{" "}
                                                <span
                                                    className="font-medium">{professorRating.avgDifficulty.toFixed(1)}/5.0</span>
                                            </p>
                                            <p>
                                                Would Take Again:{" "}
                                                <span
                                                    className="font-medium">{professorRating.wouldTakeAgainPercent.toFixed(1)}%</span>
                                            </p>
                                            <p>
                                                Total Ratings:{" "}
                                                <span className="font-medium">{professorRating.numRatings}</span>
                                            </p>
                                        </div>
                                        <a
                                            href={professorRating.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:text-blue-800 underline mt-2 block"
                                        >
                                            See Full Rating
                                        </a>
                                    </div>
                                ) : (
                                    <div className={" border-t flex flex-col gap-3"}>
                                        <br/>
                                        <p className="text-gray-500 italic mt-4">
                                            No rating available for this professor
                                        </p>
                                        <a
                                            href={"https://www.ratemyprofessors.com/school/162"}
                                            target={"_blank"}
                                            className={"text-blue-600"}
                                        >Please find rating here</a>
                                    </div>

                                )}
                            </div>
                        );
                    })}
                </div>

            )}
        </div>

    );
}
