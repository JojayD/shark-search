// src/components/SearchBar.tsx

"use client";

import React, { useState, useMemo } from 'react';
import { TextField, Autocomplete, Box, Typography } from '@mui/material';
import courseData from "../../scripts/course_data.json"; // Adjust the path as needed
import { ClassType } from '../types/classType';
import { useRouter } from 'next/router'; // Import useRouter for navigation

type Props = {};

export default function SearchBar({}: Props) {
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const router = useRouter();
  const mapCourseData = (courseData: Record<string, ClassType[]>): ClassType[] => {
  let idCounter = 1; // Initialize a counter for unique ids
    return Object.values(courseData).flat().map((cls) => ({
      ...cls,
      id: idCounter++,  // Assign and increment the unique id
    }));
  };
  const allClasses: ClassType[] = useMemo(() => {
    return mapCourseData(courseData);
  }, [courseData]);

  const handleClassSelect = (event: any, newValue: ClassType | null) => {
    setSelectedClass(newValue);
    if (newValue) {
      // Navigate to the ClassDetail page with courseCode and SEC as URL parameters
      router.push(`/class/${newValue.COURSECODE}/${newValue.SEC}`)
    }
  };


  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: '0 auto', mt: 4 }}>
      <Autocomplete
        options={allClasses}
        getOptionLabel={(option) => `${option.COURSECODE} - ${option.COURSETITLE}`}
        onChange={handleClassSelect} // Update onChange handler
        renderInput={(params) => (
          <TextField {...params} label="Search Classes" variant="filled" />
        )}
        // filterOptions={(options, state) => options} // Disable default filtering
        noOptionsText="No classes found"
        sx={{ width: '100%' }}
        // Customize renderOption to include unique key using the id
        renderOption={(props, option) => (
          <li {...props} key={option.id}>
            <h1>{`${option.COURSECODE} - ${option.COURSETITLE} - ${option.SEC}`}</h1>
          </li>
        )}
      />

      {selectedClass && (
        <Box mt={4} p={2} border={1} borderColor="grey.300" borderRadius={2}>
          <Typography variant="h6">{selectedClass.COURSETITLE}</Typography>
          <Typography variant="subtitle1" color="textSecondary">
            {selectedClass.COURSECODE}
          </Typography>
          <Typography variant="body1" mt={1}>
            {selectedClass.COMMENT}
          </Typography>
            <Typography variant="body1" mt={1}>
            {selectedClass.SEC}
          </Typography>
        </Box>
      )}
    </Box>
  );
}
