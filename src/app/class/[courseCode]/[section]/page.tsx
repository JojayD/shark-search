"use client";
import React, {useEffect, useState} from "react";
// import courseData from '../../../../../scripts/course_data.json';
import axios from "axios";
import {ClassType} from "../../../../types/classType";
import {ProfessorType} from "@/types/professorType";
import {useRouter, useSearchParams} from "next/navigation";
type PageProps = {
    params: Promise<{
        courseCode: string;
        section: string;
        data: ClassType
    }>;
};
const ClassDetail = ({ params }: PageProps) => {
    const [resolvedParams, setResolvedParams] = useState<{
        courseCode: string;
        section: string;
        data: ClassType;
    } | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const [classDetails, setClassDetails] = useState<ClassType | null>(null);
    const [professorDetail, setProfessorDetail] = useState<ProfessorType | null> (null);

    useEffect(() => {
        if(classDetails?.INSTRUCTOR){
            const fetchProfessorDetails = async () => {
                try {
                    const response = await axios.get("http://127.0.0.1:5000/api/professor", {
                        params: { professor: classDetails.INSTRUCTOR },
                    });
                    console.log(response.data)
                    setProfessorDetail(response.data);
                    console.log("Here is the professor detail ", professorDetail);
                } catch (error) {
                    console.error("Error fetching professor details:", error);
                }
            };
            fetchProfessorDetails();
        }
    }, [classDetails]);


    useEffect(() => {
        const queryData = searchParams.get("data");
        if (queryData) {
            try {
                const parsedData: ClassType = JSON.parse(decodeURIComponent(queryData));
                setClassDetails(parsedData);
            } catch (error) {
                console.error("Error parsing query data:", error);
            }
        }
    }, [searchParams]);

     useEffect(() => {
        const resolveParams = async () => {
            try {
                const unwrappedParams = await params; // Await the Promise
                setResolvedParams(unwrappedParams); // Set resolved params to state
            } catch (error) {
                console.error("Failed to resolve params:", error);
            }
        };

        resolveParams();

    }, [params]);

    const handleGoBack = () => {
        router.back();
    };

    if (!classDetails) {
        return (
            <div className="p-4">
                <h5 className="text-xl font-semibold">Loading...</h5>
            </div>
        );
    }


    return (
            <div
                className="flex justify-center items-center h-screen bg-gradient-to-l from-slate-300 to-slate-100
                text-slate-600 border border-slate-300 p-4 gap-4 rounded-lg shadow-md">
                <div className=" bg-gray-100 rounded-xl shadow-2xl">
                    <div className="flex items-center p-3">
                        <div className="px-1">
                            <span className="w-4 h-4 rounded-full inline-block bg-red-500 cursor-pointer"></span>
                        </div>
                        <div className="px-1">
                            <span className="w-4 h-4 rounded-full inline-block bg-yellow-400 cursor-pointer"></span>
                        </div>
                        <div className="px-1">
                            <span className="w-4 h-4 rounded-full inline-block bg-green-500 cursor-pointer"></span>
                        </div>
                    </div>
                    <div className="p-4 max-w-3xl mx-auto">
                        <h4 className="text-2xl font-bold mb-4">
                            {classDetails.COURSECODE} - {classDetails.COURSETITLE}
                        </h4>
                        <p className="text-lg font-medium mb-2">Section: {classDetails.SEC}</p>
                        <p className="text-base mb-2">Instructor: {classDetails.INSTRUCTOR}</p>
                        <p className="text-base mb-2">Days: {classDetails.DAYS}</p>
                        <p className="text-base mb-2">Time: {classDetails.TIME}</p>
                        <p className="text-base mb-2">Location: {classDetails.LOCATION}</p>
                        <p className="text-base mb-2">Units: {classDetails.Units}</p>
                        <p className="text-base mb-2">Notes: {classDetails.CLASSNOTES}</p>
                        <p className="text-base mb-2">Comment: {classDetails.COMMENT}</p>

                        <button
                            className="mt-6 px-6 py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
                            onClick={handleGoBack}>
                            Go Back
                        </button>
                    </div>
                </div>
                       {professorDetail && (

                <div className="mt-6 bg-gray-100 rounded-lg shadow-lg p-4">
                    <h4 className="text-xl font-bold mb-2">Professor Details</h4>
                    <p className="text-base mb-2">
                        <strong>Name:</strong> {professorDetail.ProfessorName}
                    </p>
                    <p className="text-base mb-2">
                        <strong>Department:</strong> {professorDetail.Department}
                    </p>
                    <p className="text-base mb-2">
                        <strong>Level of Difficulty:</strong>{" "}
                        {professorDetail.level_of_difficulty}
                    </p>
                    <p className="text-base mb-2">
                        <strong>Quality:</strong> {professorDetail.Quality}
                    </p>
                    <p className="text-base mb-2">
                        <strong>Number of Ratings:</strong>{" "}
                        {professorDetail.num_of_ratings}
                    </p>
                    <a href={`https:`}></a>
                </div>


            )}
            </div>
    );
};


export default ClassDetail;