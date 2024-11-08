const AuthLayout = ({
    children
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="flex items-center justify-center h-full bg-stone-100">
            {children}
        </div>
    );
}

export default AuthLayout;