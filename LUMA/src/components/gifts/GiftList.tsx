"use client";

import { Gift } from "./GiftCartContext";
import GiftCard from "./GiftCard";

interface GiftListProps {
    gifts: Gift[];
    title?: string;
}

export default function GiftList({ gifts, title = "Lista de Presentes" }: GiftListProps) {
    if (!gifts || gifts.length === 0) {
        return null;
    }

    return (
        <section className="py-16 px-4 bg-gray-50" id="presentes">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-serif text-center text-gray-900 mb-2">
                    {title}
                </h2>
                <p className="text-center text-gray-600 mb-10">
                    Escolha um presente especial para celebrar conosco
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {gifts.map((gift) => (
                        <GiftCard key={gift.id} gift={gift} />
                    ))}
                </div>
            </div>
        </section>
    );
}
