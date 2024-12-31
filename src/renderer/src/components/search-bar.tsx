import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar() {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        if (searchQuery === "") return;
        e.preventDefault();
        navigate(`/search/${searchQuery}`);
    };

    return (
        <div className="bg-black p-4">
            <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2 rounded-md bg-[#1A1A1A] px-3"
            >
                <div className="flex flex-1 items-center gap-2">
                    <Search className="h-4 w-4 text-white/70" />
                    <input
                        type="text"
                        onChange={(e) => setSearchQuery(e.target.value)}
                        value={searchQuery}
                        placeholder="Search"
                        className="flex-1 my-2 rounded-3xl bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none"
                    />
                </div>
            </form>
        </div>
    );
}
