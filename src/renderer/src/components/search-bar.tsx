import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchBar() {
    const [query, setQuery] = useState("");

    const handleSubmit = (e) => {
        if (query === "") return;
        e.preventDefault();
        window.location.href = `/search?q=${query}`;
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
                        onChange={(e) => setQuery(e.target.value)}
                        value={query}
                        placeholder="Search"
                        className="flex-1 my-2 rounded-3xl bg-transparent text-sm text-white placeholder:text-white/70 focus:outline-none"
                    />
                </div>
            </form>
        </div>
    );
}
