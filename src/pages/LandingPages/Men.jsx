import CatHero from "@/components/CategoryPageComponents/CatHero";
import CatBody from "@/components/CategoryPageComponents/CatBody";
import { useParams } from "react-router-dom";

export default function CategoryPage() {
    const dynamicSlug = useParams().slug;


    return (
        <>
            <CatHero slug={dynamicSlug} />
            <CatBody slug={dynamicSlug} />
        </>
    );
}