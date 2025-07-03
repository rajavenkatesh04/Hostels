import { Suspense } from 'react';
import HostelDetailsContent from './HostelDetailsContent';

export default function HostelPage() {

    return (

        <Suspense>

            <HostelDetailsContent />

        </Suspense>

    );

}