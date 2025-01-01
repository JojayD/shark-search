"use client"
import {notFound, useSearchParams} from 'next/navigation';
import {DepartmentType} from "@/types/departmentType";
import {useEffect} from "react";
import {useState} from "react";

type PageProps = {
       params: Promise<{
        name: string;
        data: DepartmentType;
    }>;
};

export default function DepartmentClasses({ params }: PageProps){
    const [resolvedParams, setResolvedParams] = useState<{
        name: string;
        data: DepartmentType;
    } | null>(null);
    const[departmentDetails, setDepartmentDetails] = useState<DepartmentType| null>();
    const searchParams = useSearchParams();

    useEffect(() => {
        const queryData = searchParams.get("data");
        if (queryData) {
            try {
                const parsedData: DepartmentType = JSON.parse(decodeURIComponent(queryData));
                setDepartmentDetails(parsedData);
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
          }
          resolveParams();

     },[params]);

     if (!departmentDetails) {
        return (
            <div className="p-4">
                <h5 className="text-xl font-semibold">Loading...</h5>
            </div>
        );
    }

    return(
        <div>
            <h1>Department of {departmentDetails.name}</h1>
        </div>
    );
}