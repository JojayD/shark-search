// app/api/ratemyprofessor/route.ts

import { NextRequest, NextResponse } from 'next/server';
import {
    searchProfessorsAtSchoolId,
    searchSchool,
    getProfessorRatingAtSchoolId,
} from '@/app/utils/RMP'; // Adjust the import path as needed

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const professorName = searchParams.get('professorName');
    const schoolName = searchParams.get('schoolName');
    const schoolId = searchParams.get('schoolId');

    try {
        if (action === 'searchSchool' && schoolName) {
            const schools = await searchSchool(schoolName);
            return NextResponse.json({ schools });
        }

        if (action === 'searchProfessors' && professorName && schoolId) {
            const professors = await searchProfessorsAtSchoolId(professorName, schoolId);
            return NextResponse.json({ professors });
        }

        if (action === 'getProfessorRating' && professorName && schoolId) {
            const rating = await getProfessorRatingAtSchoolId(professorName, schoolId);
            return NextResponse.json({ rating });
        }

        return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}