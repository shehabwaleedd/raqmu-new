import TransitionLink from '@/animation/transitionLink';

export interface BreadcrumbItem {
    label: string;
    href: string;
    current?: boolean;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
    return (
        <nav className="flex items-center gap-2 font-helvetica">
            {items.map((item, index) => (
                <div key={item.href} className="flex items-center gap-2">
                    {item.current ? (
                        <div className="border-2px border-black bg-black text-white px-3 py-1">
                            <span className="text-xs font-bold uppercase tracking-wider">{item.label}</span>
                        </div>
                    ) : (
                        <div className="border-2px border-black bg-white hover:bg-gray-50 transition-colors duration-200 px-3 py-1">
                            <TransitionLink href={item.href} className="text-xs font-bold uppercase tracking-wider text-black hover:text-gray-600 transition-colors duration-200">
                                {item.label}
                            </TransitionLink>
                        </div>
                    )}
                    {index < items.length - 1 && (
                        <div className="border-2px border-black bg-gray-50 w-6 h-6 flex items-center justify-center">
                            <span className="text-xs font-bold text-black">▸</span>
                        </div>
                    )}
                </div>
            ))}
        </nav>
    );
}