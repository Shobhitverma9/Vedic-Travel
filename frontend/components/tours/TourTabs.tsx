'use client';

interface TourTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
    tabs: { id: string; label: string }[];
}

export default function TourTabs({ activeTab, setActiveTab, tabs }: TourTabsProps) {
    return (
        <div className="flex border-b border-gray-200 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 font-bold text-sm whitespace-nowrap border-b-2 transition-all duration-300 ${activeTab === tab.id
                            ? 'border-saffron text-deepBlue bg-saffron/5'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    );
}
