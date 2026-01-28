export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="flex h-screen w-full items-center justify-center bg-black-1">
            {children}
        </main>
    );
}
