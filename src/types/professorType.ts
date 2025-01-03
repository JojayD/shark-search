export type ProfessorType = {
    __typename: 'Teacher',
    avgDifficulty: number,
    avgRating: number,
    department: string,
    firstName: string,
    id: string,
    isSaved: boolean,
    lastName: string,
    legacyId: number,
    numRatings: number,
    school: object, // You can replace `object` with a more specific type if needed
    wouldTakeAgainPercent: number
};