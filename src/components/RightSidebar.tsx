import React from 'react'

const RightSidebar = () => {
    return (
        <section className="right_sidebar text-white-1 w-[310px] hidden xl:flex flex-col border-l border-zinc-800 bg-black-1 pb-6 pt-4 px-6 max-h-[calc(100vh-5px)] overflow-y-auto sticky right-0 top-0">
            <section>
                {/* Placeholder for header/user if needed */}
            </section>
            <section className="flex flex-col gap-8 pt-12">
                <div className="flex flex-col gap-4">
                    <h3 className="font-semibold text-white-1">Top Podcasters</h3>
                    {/* List */}
                    <p className="text-white-2">Coming soon...</p>
                </div>
            </section>
        </section>
    )
}

export default RightSidebar;
