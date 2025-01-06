// src/components/SearchBar.tsx


"use client"
import {departments} from "@/(data)/departments";
import React, {useMemo, useState} from 'react';
import {Autocomplete, Box, TextField} from '@mui/material';
import {useRouter} from 'next/navigation';
import {DepartmentType} from "@/types/departmentType";
import {courseKeys} from "@/(data)/courseKeys";
type Props = {};

export default function SearchBar({}: Props) {
    const [selectedDepartment, setSelectedDepartment] = useState<DepartmentType | null>(null);
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


    interface DepartmentTypeWithID extends DepartmentType {
        id: number;
    }


    const allDepartments: DepartmentTypeWithID[] = useMemo(()=>{
        return mapDepartmentData(departments);
    }, [departments])


      const handleDepartmentSelect = (event: any, newValue: DepartmentType | null) => {
        // setSelectedClass(newValue);
        if (newValue) {
            const query = encodeURIComponent(JSON.stringify(newValue)); // Serialize the object

            router.push(`/department/${newValue.name}?data=${query}`);
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
                    </li>)}
                />
        </Box>
    );
}
