// pages/LandingPage.tsx
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import SearchBar from "@/components/SearchBar";

export default function LandingPage() {
    return (
        <div>
            <Header />
            <main className="flex flex-col n bg-gray-100 h-screen flex">
                <div className="text-center m-10">
                    <h1 className="text-4xl font-bold text-gray-800">Shark Seek</h1>
                    <h2 className="text-lg text-gray-600 mt-2">
                        Find reliable sources through RMP and schedule of classes from CSULB in order to
                        perfect your schedule
                    </h2>
                </div>
                <div className="flex justify-center">
                    <div className="w-full max-w-md">
                        <SearchBar/>
                    </div>
                </div>
            </main>
            <Footer creatorName={`Joseph David`} csulbLink={`https://www.csulb.edu/student-records/schedule-of-classes`}/>
        </div>
    );
}