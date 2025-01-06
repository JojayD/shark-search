"use client"
import { useSearchParams } from 'next/navigation';
import { DepartmentType } from "@/types/departmentType";
import React, { useEffect, useState } from "react";
import { ClassType } from "@/types/classType";
import BackButton from "@/app/department/[departmentName]/_components/BackButton";
import {ProfessorRating} from "@/types/professorRating";
import {ThreeDot} from "react-loading-indicators";
// import {searchProfessorsAtSchoolId, searchSchool, getProfessorRatingAtSchoolId} from "../../utils";

// const rmp =

type PageProps = {
    params: {
        name: string;
        data: DepartmentType;
    };
};
//We are going to use classes and compare it to the which is Classes: Instructor: Hashem I and compare it to professor
// which is professorRating that is normalzied name:
const normalizeProfessorNameFromClassesState = (name: string): string => {
    // Return empty string if name is undefined or null
    if (!name) return '';

    const cleanName = name.trim().toLowerCase();

    if (cleanName.includes(',')) {
        const [lastName] = cleanName.split(',');
        return lastName.trim(); // Just return the last name
    }

    // Handle "First Last" format (from ratings)
    const nameParts = cleanName.split(' ');
    // Return the last part (last name)
    console.log(nameParts[0].toLowerCase());
    return nameParts[0].toLowerCase();
};



const normalizeProfessorNameFromProfessorState = (name: string): string => {
    // Return empty string if name is undefined or null
    if (!name) return '';

    const cleanName = name.trim().toLowerCase();

    if (cleanName.includes(',')) {
        const [lastName] = cleanName.split(',');
        return lastName.trim(); // Just return the last name
    }

    // Handle "First Last" format (from ratings)
    const nameParts = cleanName.split(' ');
    // Return the last part (last name)
    console.log(nameParts[1].toLowerCase());
    return nameParts[1].toLowerCase();
};

export default function DepartmentClasses({ params }: PageProps) {
    const [departmentDetails, setDepartmentDetails] = useState<DepartmentType | null>(null);
    const [classes, setClasses] = useState<ClassType[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [professorRatings ,setProfessorRatings] =useState<ProfessorRating[] | null>();
    const [isProfessorRatingLoading, setIsProfessorRatingLoading] = useState<Boolean>(true);
    // const [schoolId, setSchoolId]
    const searchParams = useSearchParams();

    //We are going to use classes and compare it to the which is Classes: Instructor: Hashem I and compare it to professor
    // which is professorRating that is normalzied name:
    const getProfessorRating = (instructorName: string) => {
      if (!professorRatings) return null;

      // 1) Normalize the instructor name (from classes)
      const normalizedInstructorName = normalizeProfessorNameFromClassesState(instructorName);

      // 2) Find the matching professor rating
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

    useEffect(()=>{
        console.log("Entered fetch professor")
        const fetchProfessorRatings = async () => {
            if (!departmentDetails || !classes) return;

                try {
                    const ratingsPromises = classes.map(async (c: ClassType) => {
                        const professorName = c.INSTRUCTOR;
                        let schoolId;
                        const schoolName = "California State Univeristy, Long Beach"; // Adjust if dynamic
                        try {

                            const responseSchoolId = await fetch(`/api/ratemyprofessor?action=searchSchool&schoolName=${encodeURIComponent(schoolName)}`);
                            if (!responseSchoolId.ok) {
                                console.error(`Failed to fetch school ID for ${schoolName}`);
                                throw new Error(`Failed to fetch school ID`);
                            }else{
                                console.log("Success")
                            }
                            const schoolData = await responseSchoolId.json();
                            schoolId = schoolData.schools[0]?.node?.id;

                            if (!schoolId) {
                                console.error(`School ID not found for ${schoolName}`);
                                throw new Error("School ID not found");
                            }

                            const responseProfessor = await fetch(`/api/ratemyprofessor?action=getProfessorRating&professorName=${encodeURIComponent(professorName)}&schoolId=${schoolId}`);
                            if (responseProfessor.ok) {
                                const data = await responseProfessor.json();
                                console.log(data);
                                return {
                                    avgDifficulty: data.rating.avgDifficulty,
                                    avgRating: data.rating.avgRating,
                                    department: data.rating.department,
                                    formattedName: data.rating.formattedName,
                                    link: data.rating.link,
                                    numRatings: data.rating.numRatings,
                                    wouldTakeAgainPercent: data.rating.wouldTakeAgainPercent
                                };
                            } else {
                                console.error(`Failed to fetch rating for ${professorName}`);
                                return null;
                            }
                        } catch (error) {
                            console.error(`Error fetching rating for ${professorName}:`, error);
                            return null;
                        }
                    });

                    const ratings: ProfessorRating[] = (await Promise.all(ratingsPromises))
                        .filter((rating): rating is ProfessorRating => rating !== null);
                    setProfessorRatings(ratings)
                    setIsProfessorRatingLoading(false);

                } catch (error) {
                    console.error("Error fetching professor ratings:", error);
                    setError("An error occurred while fetching professor ratings.");
                }
            };

        fetchProfessorRatings();

    },[departmentDetails]);


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
            <div className="p-4 flex justify-between items-center">
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
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-center">
                    {classes.map((classItem, index) => {
                        // Get the rating for this specific professor
                        const professorRating = classItem?.INSTRUCTOR ?
                            getProfessorRating(classItem.INSTRUCTOR) : null;

                        return (
                            <div key={index}
                                 className="p-4 border-2 border-gray-300 rounded-md m-8">
                                <h1 className="text-2xl">{classItem?.COURSETITLE || 'No Title'} - {classItem?.SEC || 'No Section'}</h1>
                                <p className="text-lg font-medium mb-2">Section: {classItem?.SEC || 'N/A'}</p>
                                <p className="text-base mb-2">Instructor: {classItem?.INSTRUCTOR || 'N/A'}</p>
                                <p className="text-base mb-2">Days: {classItem?.DAYS || 'N/A'}</p>
                                <p className="text-base mb-2">Time: {classItem?.TIME || 'N/A'}</p>
                                <p className="text-base mb-2">Location: {classItem?.LOCATION || 'N/A'}</p>
                                <p className="text-base mb-2">Units: {classItem?.Units || 'N/A'}</p>
                                <p className="text-base mb-2">Notes: {classItem?.CLASSNOTES || 'None'}</p>
                                <p className="text-base mb-2">Comment: {classItem?.COMMENT || 'None'}</p>
                                {isProfessorRatingLoading ? (
                                    <div>Waiting...</div>
                                ) : (
                                    professorRating ? (
                                        <div className="mt-4 border-t pt-4">
                                            <h3 className="text-lg font-semibold">Professor Rating</h3>
                                            <div className="grid grid-cols-2 gap-2 text-sm p-4">
                                                <p>Rating: <span className="font-medium">{professorRating.avgRating.toFixed(1)}/5.0</span></p>
                                                <p>Difficulty: <span className="font-medium">{professorRating.avgDifficulty.toFixed(1)}/5.0</span></p>
                                                <p>Would Take Again: <span className="font-medium">{professorRating.wouldTakeAgainPercent.toFixed(1)}%</span></p>
                                                <p>Total Ratings: <span className="font-medium">{professorRating.numRatings}</span></p>
                                            </div>
                                            <a
                                                href={professorRating.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:text-blue-800 underline"
                                            >
                                                See Full Rating
                                            </a>
                                        </div>
                                    ) : (
                                        <p className="text-gray-500 italic mt-4">No rating available for this professor</p>
                                    )
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

    );}
