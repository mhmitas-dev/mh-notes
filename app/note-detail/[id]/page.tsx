"use client"
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Note } from "@/lib/types";
import { supabase } from "@/lib/supabase";
import MarkdownRender from "@/components/shared/MarkdownRender";

function Page() {
    const [note, setNote] = useState<Note | null>(null);
    const { id } = useParams();

    useEffect(() => {
        if (id) getNote();
    }, [id]);

    async function getNote() {
        const { data } = await supabase
            .from('notes')
            .select('*')
            .eq('id', id)
            .single();
        setNote(data);
    }

    if (!note) return <div className="fixed inset-0 h-screen w-screen flex items-center justify-center">Loading...</div>;

    return (
        <main className="my-container py-8">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6">{note.title}</h1>
            <section className="prose space-y-4">
                <MarkdownRender markdown={note.content} />
                {/* {note.content} */}
            </section>
        </main>
    );
}

export default Page;