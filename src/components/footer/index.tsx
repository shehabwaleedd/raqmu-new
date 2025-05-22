'use client';

import React from 'react';
import Image from 'next/image';
import TransitionLink from '@/animation/transitionLink';

interface FooterProps {
    logoUrl?: string;
    logoAlt?: string;
    siteTitle?: string;
}

interface FooterSection {
    title: string;
    links: Array<{
        label: string;
        href: string;
    }>;
}

const Footer: React.FC<FooterProps> = ({
    logoUrl,
    logoAlt = 'Logo',
    siteTitle = 'Company'
}) => {
    const footerSections: FooterSection[] = [
        {
            title: 'Services',
            links: [
                { label: 'Commercial', href: '/sectors/commercial' },
                { label: 'Residential', href: '/sectors/residential' },
                { label: 'Industrial', href: '/sectors/industrial' },
                { label: 'Infrastructure', href: '/sectors/infrastructure' },
                { label: 'Renovation', href: '/services/renovation' },
            ]
        },
        {
            title: 'Company',
            links: [
                { label: 'About Us', href: '/about' },
                { label: 'Our Team', href: '/team' },
                { label: 'Careers', href: '/careers' },
                { label: 'News', href: '/news' },
                { label: 'Sustainability', href: '/sustainability' },
            ]
        },
        {
            title: 'Resources',
            links: [
                { label: 'Case Studies', href: '/case-studies' },
                { label: 'Downloads', href: '/downloads' },
                { label: 'Documentation', href: '/docs' },
                { label: 'Support', href: '/support' },
                { label: 'Contact', href: '/contact' },
            ]
        }
    ];

    const socialLinks = [
        {
            platform: 'LinkedIn',
            href: '#',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            )
        },
        {
            platform: 'Instagram',
            href: '#',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
            )
        },
        {
            platform: 'Twitter',
            href: '#',
            icon: (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
            )
        }
    ];

    const currentYear = new Date().getFullYear();

    return (
        <footer className="w-full bg-gray-50  border-black font-helvetica">
            {/* Main Footer */}
            <div className="border-b-2px border-black bg-white">
                <div className="px-6 py-12 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
                        {/* Logo & Description */}
                        <div className="lg:col-span-4">
                            <div className="mb-6">
                                {logoUrl ? (
                                    <TransitionLink href="/" className="inline-block">
                                        <Image src={logoUrl} alt={logoAlt} width={160} height={50} className="h-auto" />
                                    </TransitionLink>
                                ) : (
                                    <TransitionLink href="/" className="inline-block">
                                        <div className="border-2px border-black bg-white px-6 py-3">
                                            <div className="text-xl font-black uppercase tracking-wider text-black">{siteTitle}</div>
                                        </div>
                                    </TransitionLink>
                                )}
                            </div>
                            
                            <p className="text-gray-700 text-base leading-relaxed mb-8 max-w-md">
                                Leading construction and architecture firm delivering exceptional projects across multiple sectors with innovative solutions and sustainable practices.
                            </p>

                            {/* Social Links */}
                            <div className="flex items-center gap-3">
                                {socialLinks.map((social) => (
                                    <a key={social.platform} href={social.href} target="_blank" rel="noopener noreferrer" className="border-2px border-black bg-white hover:bg-black hover:text-white transition-all duration-200 p-3 group">
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Navigation Sections */}
                        <div className="lg:col-span-8">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 lg:gap-12">
                                {footerSections.map((section) => (
                                    <div key={section.title}>
                                        <div className="border-2px border-black bg-gray-50 px-4 py-2 mb-6">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-black">{section.title}</h3>
                                        </div>
                                        <ul className="space-y-3">
                                            {section.links.map((link) => (
                                                <li key={link.href}>
                                                    <TransitionLink href={link.href} className="text-gray-700 hover:text-black transition-colors duration-200 text-base font-medium">
                                                        {link.label}
                                                    </TransitionLink>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Newsletter/CTA Section */}
                    <div className="border-t-2px border-black pt-12 mt-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-black mb-2">Ready to start your project?</h3>
                                <p className="text-gray-700 text-lg">Get in touch with our team to discuss your construction needs.</p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="border-2px border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 px-6 py-3 text-center flex-1">
                                    <TransitionLink href="/contact" className="text-sm font-bold uppercase tracking-wider">
                                        GET A QUOTE
                                    </TransitionLink>
                                </div>
                                <div className="border-2px border-black bg-white text-black hover:bg-gray-50 transition-all duration-200 px-6 py-3 text-center flex-1">
                                    <TransitionLink href="/projects" className="text-sm font-bold uppercase tracking-wider">
                                        VIEW PROJECTS
                                    </TransitionLink>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <p className="text-sm text-gray-600">
                                © {currentYear} {siteTitle}. All rights reserved.
                            </p>
                            <div className="flex items-center gap-6">
                                <TransitionLink href="/privacy" className="text-sm text-gray-600 hover:text-black transition-colors duration-200">
                                    Privacy Policy
                                </TransitionLink>
                                <TransitionLink href="/terms" className="text-sm text-gray-600 hover:text-black transition-colors duration-200">
                                    Terms of Service
                                </TransitionLink>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-600">Website by</span>
                            <a href="https://cairo-studio.com" target="_blank" rel="noopener noreferrer" className="border-2px border-black bg-black text-white hover:bg-white hover:text-black transition-all duration-200 px-3 py-1 text-sm font-bold uppercase tracking-wider">
                                CAIRO-STUDIO
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;