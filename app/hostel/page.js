import { Suspense } from 'react';
import HostelDetailsContent from './HostelDetailsContent';
import EmptyLoader from "next/dist/build/webpack/loaders/empty-loader";


export default function HostelPage() {
    return (
        <Suspense>
            <HostelDetailsContent />
        </Suspense>
    );
}