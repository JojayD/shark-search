// cache.ts
import {searchProfessorsAtSchoolId, searchSchool} from "@/app/utils/RMP";
import {NextRequest, NextResponse} from "next/server";

interface CacheEntry {
    data: any;
    timestamp: number;
}

class SimpleCache {
    private cache: Map<string, CacheEntry> = new Map();
    private TTL: number = 1000 * 60 * 60;

    set(key: string, value: any) {
        this.cache.set(key, {
            data: value,
            timestamp: Date.now()
        });
    }

    get(key: string): any | null {
        const entry = this.cache.get(key);
        if (!entry) return null;

        if (Date.now() - entry.timestamp > this.TTL) {
            this.cache.delete(key);
            return null;
        }

        return entry.data;
    }
}

export const rmpCache = new SimpleCache();

// BatchProcessor.ts
export class BatchProcessor {
    private batchQueue: Map<string, {
        professorName: string;
        resolve: (value: any) => void;
        reject: (reason?: any) => void;
    }[]> = new Map();
    private batchTimeout: NodeJS.Timeout | null = null;
    private batchDelay = 50;

    async addToBatch(schoolId: string, professorName: string): Promise<any> {
        const cacheKey = `${schoolId}-${professorName}`;
        const cachedResult = rmpCache.get(cacheKey);
        if (cachedResult) return cachedResult;

        return new Promise((resolve, reject) => {
            if (!this.batchQueue.has(schoolId)) {
                this.batchQueue.set(schoolId, []);
            }

            this.batchQueue.get(schoolId)!.push({ professorName, resolve, reject });

            if (this.batchTimeout) {
                clearTimeout(this.batchTimeout);
            }

            this.batchTimeout = setTimeout(() => this.processBatch(), this.batchDelay);
        });
    }

    private async processBatch() {
        const batchesToProcess = new Map(this.batchQueue);
        this.batchQueue.clear();

        for (const [schoolId, requests] of batchesToProcess) {
            try {
                const professorNames = requests.map(r => r.professorName);
                const results = await this.batchFetch(schoolId, professorNames);

                // Match results back to requests
                requests.forEach(({ professorName, resolve }) => {
                    const result = results.find(r =>
                        this.normalizeForComparison(r.formattedName)
                        .includes(this.normalizeForComparison(professorName))
                    ) || this.getDefaultRating(professorName);

                    const cacheKey = `${schoolId}-${professorName}`;
                    rmpCache.set(cacheKey, result);
                    resolve(result);
                });
            } catch (error) {
                requests.forEach(({ reject }) => reject(error));
            }
        }
    }

    private normalizeForComparison(name: string): string {
        return name.toLowerCase().replace(/[^a-z]/g, '');
    }

    private getDefaultRating(professorName: string) {
        return {
            avgRating: -1,
            avgDifficulty: -1,
            wouldTakeAgainPercent: -1,
            numRatings: 0,
            formattedName: professorName,
            department: "",
            link: ""
        };
    }

    private async batchFetch(schoolId: string, professorNames: string[]) {
        // Combine names for a single search
        const combinedSearch = professorNames.join(' OR ');
        const searchResults = await searchProfessorsAtSchoolId(combinedSearch, schoolId);

        if (!searchResults) return [];

        return searchResults.map(result => ({
            avgRating: result.node.avgRating,
            avgDifficulty: result.node.avgDifficulty,
            wouldTakeAgainPercent: result.node.wouldTakeAgainPercent,
            numRatings: result.node.numRatings,
            formattedName: `${result.node.firstName} ${result.node.lastName}`,
            department: result.node.department,
            link: `https://www.ratemyprofessors.com/professor/${result.node.legacyId}`
        }));
    }
}

export const batchProcessor = new BatchProcessor();

// Modified route.ts
export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const professorName = searchParams.get('professorName');
    const schoolName = searchParams.get('schoolName');
    const schoolId = searchParams.get('schoolId');

    try {
        if (action === 'searchSchool' && schoolName) {
            const cachedSchool = rmpCache.get(`school-${schoolName}`);
            if (cachedSchool) return NextResponse.json({ schools: cachedSchool });

            const schools = await searchSchool(schoolName);
            rmpCache.set(`school-${schoolName}`, schools);
            return NextResponse.json({ schools });
        }

        if (action === 'getProfessorRating' && professorName && schoolId) {
            const rating = await batchProcessor.addToBatch(schoolId, professorName);
            return NextResponse.json({ rating });
        }

        return NextResponse.json({ error: 'Invalid parameters' }, { status: 400 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}