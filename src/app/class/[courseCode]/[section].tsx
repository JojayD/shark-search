"use client"
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import courseData from '../../../../scripts/course_data.json';
import { ClassType } from '../../../types/classType';

const ClassDetail = () => {
  const router = useRouter();
  const { courseCode, section } = router.query;

  const [classDetails, setClassDetails] = useState<ClassType | null>(null);

  useEffect(() => {
    if (courseCode && section) {
      const allClasses: ClassType[] = Object.values(courseData).flat();

      const foundClass = allClasses.find(
        (cls) =>
          cls.COURSECODE.toLowerCase() === (courseCode as string).toLowerCase() &&
          cls.SEC === (section as string)
      );

      setClassDetails(foundClass || null);
    }
  }, [courseCode, section]);

  const handleGoBack = () => {
    router.back();
  };

  if (!courseCode || !section) {
    return (
      <div className="p-4">
        <h5 className="text-xl font-semibold">Loading...</h5>
      </div>
    );
  }

  if (!classDetails) {
    return (
      <div className="p-4">
        <h5 className="text-xl font-semibold">Class Not Found</h5>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
          onClick={handleGoBack}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
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
      {/* Add more details if required */}

      <button
        className="mt-6 px-6 py-3 bg-blue-500 text-white font-medium rounded hover:bg-blue-600"
        onClick={handleGoBack}
      >
        Go Back
      </button>
    </div>
  );
};

export default ClassDetail;