import React from "react";
import { Link } from "react-router-dom";
import Logo from "./Logo";

const footerLinks = {
    company: [
        { label: "Features", to: "/" },
        { label: "Pricing", to: "/" },
        { label: "Affiliate Program", to: "/" },
        { label: "Press Kit", to: "/" },
    ],
    support: [
        { label: "Account", to: "/" },
        { label: "Help", to: "/" },
        { label: "Contact Us", to: "/" },
        { label: "Customer Support", to: "/" },
    ],
    legals: [
        { label: "Terms & Conditions", to: "/" },
        { label: "Privacy Policy", to: "/" },
        { label: "Licensing", to: "/" },
    ],
};

function Footer() {
    return (
        <section className="relative overflow-hidden py-10 border-t-2 ">
            <div className="relative z-10 mx-auto max-w-7xl px-4">
                <div className="-m-6 flex flex-wrap gap-y-6">
                    {/* Logo + Copyright */}
                    <div className="w-full p-6 md:w-1/2 lg:w-5/12">
                        <div className="flex h-full flex-col justify-between">
                            <div className="mb-4 inline-flex items-center">
                                <Logo width="100px" />
                            </div>
                         
                        </div>
                    </div>

                    {/* Company Links */}
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <h3
                            className="mb-9 text-xs font-semibold uppercase tracking-wider"
                            aria-label="Company Links"
                        >
                            Company
                        </h3>
                        <ul>
                            {footerLinks.company.map((link, index) => (
                                <li key={index} className="mb-4">
                                    <Link
                                        to={link.to}
                                        className="text-base font-medium text-gray-700 hover:text-gray-600 transition"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div className="w-full p-6 md:w-1/2 lg:w-2/12">
                        <h3
                            className="mb-9 text-xs font-semibold uppercase tracking-wider"
                            aria-label="Support Links"
                        >
                            Support
                        </h3>
                        <ul>
                            {footerLinks.support.map((link, index) => (
                                <li key={index} className="mb-4">
                                    <Link
                                        to={link.to}
                                        className="text-base font-medium text-gray-700 hover:text-gray-600 transition"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div className="w-full p-6 md:w-1/2 lg:w-3/12">
                        <h3
                            className="mb-9 text-xs font-semibold uppercase tracking-wider"
                            aria-label="Legal Links"
                        >
                            Legals
                        </h3>
                        <ul>
                            {footerLinks.legals.map((link, index) => (
                                <li key={index} className="mb-4">
                                    <Link
                                        to={link.to}
                                        className="text-base font-medium text-gray-700 hover:text-gray-600 transition"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <p className="text-sm text-center">
                &copy; {new Date().getFullYear()}. All Rights Reserved by Amarjeet.
            </p>
        </section>
    );
}

export default Footer;
