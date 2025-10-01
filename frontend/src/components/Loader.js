import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Loader = ({ message }) => {
    return (_jsxs("div", { className: "absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm", children: [_jsx("div", { className: "w-16 h-16 border-4 border-dashed rounded-full animate-spin border-cyan-400" }), _jsx("p", { className: "mt-4 text-lg text-cyan-200 font-mono tracking-wider", children: message })] }));
};
