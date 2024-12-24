"use client";
import React, {useEffect, useState} from "react";
import courseData from '../../../../../scripts/course_data.json';
import {ClassType} from "../../../../types/classType";
import {useRouter, useSearchParams} from "next/navigation";
type PageProps = {
    params: Promise<{
        courseCode: string;
        section: string;
        data: ClassType
    }>;
};

// const ClassDetail = ({params}: PageProps) => {
//     const [classDetails, setClassDetails] = useState<ClassType | null>(null);
//     const [resolvedParams, setResolvedParams] = useState<{
//         courseCode: string;
//         section: string;
//         data: ClassType;
//     } | null>(null);
//
//     const router = useRouter();
//
//     // Unwrap params using useEffect
//     useEffect(() => {
//         const unwrapParams = async () => {
//             const result = await params; // Await the params promise
//             setResolvedParams(result); // Set the unwrapped params to state
//         };
//         unwrapParams();
//         console.log(classDetails);
//     }, [params]);
//
//     // Fetch class details once params are resolved
//     useEffect(() => {
//         if (resolvedParams?.courseCode && resolvedParams?.section) {
//             const allClasses: ClassType[] = Object.values(courseData).flat();
//
//             const foundClass = allClasses.find(
//                 (cls) =>
//                     cls.COURSECODE.toLowerCase() === resolvedParams.courseCode.toLowerCase() &&
//                     cls.SEC === resolvedParams.section
//             );
//
//             setClassDetails(foundClass || null);
//         }
//     }, [resolvedParams]);
//
//     const handleGoBack = () => {
//         router.back();
//     };
//
//     if (!resolvedParams) {
//         return (
//             <div className="p-4">
//                 <h5 className="text-xl font-semibold">Loading...</h5>
//             </div>
//         );
//     }
//
//     if (!classDetails) {
//         return (
//             <div className="p-4">
//                 <h5 className="text-xl font-semibold">Class Not Found</h5>
//                 <button
//                     className="mt-4 px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
//                     onClick={handleGoBack}
//                 >
//                     Go Back
//                 </button>
//             </div>
//         );
//     }
//
//     return (
//         <div className="p-4 max-w-3xl mx-auto">
//             <h4 className="text-2xl font-bold mb-4">
//                 {classDetails.COURSECODE} - {classDetails.COURSETITLE}
//             </h4>
//             <p className="text-lg font-medium mb-2">Section: {classDetails.SEC}</p>
//             <p className="text-base mb-2">Instructor: {classDetails.INSTRUCTOR}</p>
//             <p className="text-base mb-2">Days: {classDetails.DAYS}</p>
//             <p className="text-base mb-2">Time: {classDetails.TIME}</p>
//             <p className="text-base mb-2">Location: {classDetails.LOCATION}</p>
//             <p className="text-base mb-2">Units: {classDetails.Units}</p>
//             <p className="text-base mb-2">Notes: {classDetails.CLASSNOTES}</p>
//             <p className="text-base mb-2">Comment: {classDetails.COMMENT}</p>
//
//             <button
//                 className="mt-6 px-6 py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
//                 onClick={handleGoBack}
//             >
//                 Go Back
//             </button>
//         </div>
//     );
// };


const ClassDetail = ({ params }: PageProps) => {
    const [resolvedParams, setResolvedParams] = useState<{
        courseCode: string;
        section: string;
        data: ClassType;
    } | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();

    const [classDetails, setClassDetails] = useState<ClassType | null>(null);

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
            className="flex justify-center items-center h-screen bg-gradient-to-l from-slate-300 to-slate-100 text-slate-600 border border-slate-300 p-4 gap-4 rounded-lg shadow-md">
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
                        onClick={handleGoBack}
                    >
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};


export default ClassDetail;