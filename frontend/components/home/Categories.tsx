

const categories = [
    {
        name: 'Hotels',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        ),
    },
    {
        name: 'Places to eat',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        ),
    },
    {
        name: 'Campfire',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        ),
    },
    {
        name: 'Camping',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2m16-10a4 4 0 10-8 0 4 4 0 008 0zM12 7a4 4 0 100 8 4 4 0 000-8z" />
        ),
    },
    {
        name: 'Mountain Trips',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        ),
    },
    {
        name: 'Town Trips',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
        ),
    },
    {
        name: 'ZOO Parks',
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        ),
    },
];

export default function Categories() {
    return (
        <section className="py-20 bg-cream-light">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <span className="text-saffron font-medium mb-2 block">— Categories</span>
                    <h2 className="font-sans text-4xl md:text-5xl font-bold text-deepBlue">
                        Choose From Your Favorite Tour Categories
                    </h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-center">
                    {categories.map((category, index) => (
                        <div key={index} className="flex flex-col items-center group cursor-pointer">
                            <div className="w-24 h-24 mb-4 flex items-center justify-center text-saffron group-hover:text-deepBlue transition-colors duration-300">
                                <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {category.icon}
                                </svg>
                            </div>
                            <h3 className="font-sans text-lg text-brown-600 group-hover:text-deepBlue transition-colors duration-300">
                                {category.name}
                            </h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
