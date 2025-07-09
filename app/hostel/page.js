"use client"

import { Suspense } from 'react';
import HostelDetailsContent from './HostelDetailsContent';


import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {ArrowLeft, Building2, Phone, Mail, User, Users as UsersIcon, Home, MapPin, GraduationCap, CheckCircle, XCircle, Loader2, ShoppingCart, ShieldCheck, WashingMachine, Info, IdCard} from 'lucide-react';


export default function HostelPage() {

    return (

        <Suspense>

            <HostelDetailsContent />

        </Suspense>

    );

}