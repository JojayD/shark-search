// pages/api/ratemyprofessor/index.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import {
    searchProfessorsAtSchoolId,
    searchSchool,
    getProfessorRatingAtSchoolId,
} from '../../utils/index'; // Adjust the import path accordingly

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { action, professorName, schoolName, schoolId } = req.query;

    try {
        if (action === 'searchSchool' && typeof schoolName === 'string') {
            const schools = await searchSchool(schoolName);
            return res.status(200).json({ schools });
        }

        if (
            action === 'searchProfessors' &&
            typeof professorName === 'string' &&
            typeof schoolId === 'string'
        ) {
            const professors = await searchProfessorsAtSchoolId(professorName, schoolId);
            return res.status(200).json({ professors });
        }

        if (
            action === 'getProfessorRating' &&
            typeof professorName === 'string' &&
            typeof schoolId === 'string'
        ) {
            const rating = await getProfessorRatingAtSchoolId(professorName, schoolId);
            return res.status(200).json({ rating });
        }

        return res.status(400).json({ error: 'Invalid parameters' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
