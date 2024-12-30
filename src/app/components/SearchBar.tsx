// src/components/SearchBar.tsx


"use client"
import {departments} from "@/(data)/departments";
import React, {useMemo, useState} from 'react';
import {Autocomplete, Box, TextField} from '@mui/material';
import courseData from "../../../scripts/course_data.json"; // Adjust the path as needed
import {ClassType} from '../../types/classType';
import {useRouter} from 'next/navigation';
import {DepartmentType} from "@/types/departmentType";
import {courseKeys} from "@/(data)/courseKeys";
type Props = {};

export default function SearchBar({}: Props) {
    const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
    const router = useRouter();


const mapDepartmentData = (departments: DepartmentType[]) => {
    let idCounter = 1; // Initialize the counter
    return courseKeys.map(deptName => {
        const dept = departments.find(d => d.name === deptName);

        if (!dept) {
            console.warn(`Department not found for name: ${deptName}`);
            return { id: idCounter++, name: deptName, code: "UNKNOWN" }; // Assign id and handle missing departments
        }
        return { ...dept, id: idCounter++ }; // Assign id for valid departments
    });
};


    // const mapCourseData = (courseData: Record<string, ClassType[]>): ClassType[] => {
    //     let idCounter = 1; // Initialize a counter for unique ids
    //     return Object.values(courseData).flat().map((cls) => ({
    //         ...cls,
    //         id: idCounter++,  // Assign and increment the unique id
    //     }));
    // };

    interface DepartmentTypeWithID extends DepartmentType {
        id: number;
    }


    const allDepartments: DepartmentTypeWithID[] = useMemo(()=>{
        return mapDepartmentData(departments);
    }, [departments])


    // const allClasses: ClassType[] = useMemo(() => {
    //     return mapCourseData(courseData);
    // }, [courseData]);

    // const handleClassSelect = (event: any, newValue: ClassType | null) => {
    //     // setSelectedClass(newValue);
    //     if (newValue) {
    //
    //         const query = encodeURIComponent(JSON.stringify(newValue)); // Serialize the object
    //         console.log(query)
    //         router.push(`/class/${newValue.COURSECODE}/${newValue.SEC}?data=${query}`)
    //     }
    // };
      const handleDepartmentSelect = (event: any, newValue: DepartmentType | null) => {
        // setSelectedClass(newValue);
        if (newValue) {

            const query = encodeURIComponent(JSON.stringify(newValue)); // Serialize the object
            console.log(query)
            router.push(`/departments/${newValue.name}/${newValue.code}?data=${query}`)
        }
    };


    return (
        <Box sx={{width: '100%', maxWidth: 600, margin: '0 auto', mt: 4}}>
               <Autocomplete
                    options={allDepartments}
                    getOptionLabel={(option) => `${option.name} - ${option.code}`}
                    onChange={handleDepartmentSelect} // Update onChange handler
                    renderInput={(params) => (
                        <TextField {...params} label="Search Classes" variant="filled"/>
                    )}
                    noOptionsText="No classes found"
                    sx={{width: '100%'}}
                    renderOption={({ key, ...otherProps }, option) => (
                    <li {...otherProps} key = {option.id}>
                        <h1>{`${option.name} - ${option.code}`}</h1>
                    </li>
)}
                />
        </Box>
    );
}
