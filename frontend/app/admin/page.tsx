export default function AdminDashboard() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="text-gray-500 text-sm font-medium uppercase">Total Tours</h2>
                    <p className="text-3xl font-bold text-deepBlue mt-2">Manage</p>
                    <a href="/admin/tours" className="text-saffron text-sm mt-4 inline-block font-semibold hover:underline">
                        View all tours &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
}
