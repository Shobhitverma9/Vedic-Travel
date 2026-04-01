import Link from 'next/link';

const tours = [
    {
        id: 'kailash-mansarovar',
        title: 'Kailash Mansarovar Yatra 2026',
        description: 'The Kailash Mansarovar Yatra 2026 – Grab This Opportunity Now!',
        price: '150,000.00',
        oldPrice: '180,000.00',
        imageColor: 'from-blue-800 to-indigo-900', // Placeholder gradient
        slug: 'kailash-mansarovar-yatra-2026'
    },
    {
        id: 'khatushyam',
        title: 'KhatuShyam Salasar Jaipur Yatra',
        description: 'A 5-Days Premium Spiritual Trip Delhi – Salasar Balaji – Shri KhatuShyam Darbar – Jaipur – Delhi',
        price: '15,000.00',
        oldPrice: '21,000.00',
        imageColor: 'from-orange-700 to-rose-900', // Placeholder gradient
        slug: 'khatushyam-salasar-jaipur-yatra'
    },
    {
        id: 'char-dham',
        title: 'Char Dham Yatra 2026',
        description: 'A 10 Days Comfortable Trip Delhi – Gangotri – Yamunotri – Kedarnath – Badrinath – Rishikesh – Haridwar – Delhi',
        price: '90,000.00',
        oldPrice: '120,000.00',
        imageColor: 'from-amber-700 to-orange-900', // Placeholder gradient
        slug: 'char-dham-yatra-2026'
    }
];

export default function NewYearTours() {
    return (
        <section className="py-20 bg-cream">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <span className="text-saffron font-medium mb-2 block">— Tours on Offer!</span>
                    <h2 className="font-sans text-4xl md:text-5xl font-bold text-deepBlue">
                        Thrilling New Tours for New Year 2026
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {tours.map((tour) => (
                        <div key={tour.id} className="group bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                            {/* Image Area */}
                            <div className={`relative h-72 bg-gradient-to-br ${tour.imageColor} flex items-center justify-center overflow-hidden`}>
                                <div className="absolute top-4 left-4 bg-saffron text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-wider z-10">
                                    On Sale
                                </div>
                                {/* Placeholder Text for Image */}
                                <h3 className="text-white/20 font-sans text-4xl font-bold text-center px-4 transform group-hover:scale-105 transition-transform duration-500">
                                    {tour.title}
                                </h3>
                            </div>

                            {/* Content */}
                            <div className="p-8 text-center">
                                <Link href={`/tours/${tour.slug}`} className="block">
                                    <h3 className="text-2xl font-sans font-semibold text-deepBlue mb-4 hover:text-saffron transition-colors">
                                        {tour.title}
                                    </h3>
                                </Link>
                                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                                    {tour.description}
                                </p>
                                <div className="flex items-center justify-center gap-3 font-medium">
                                    <span className="text-gray-400 line-through text-lg">₹{tour.oldPrice}</span>
                                    <span className="text-saffron text-2xl font-bold">₹{tour.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
