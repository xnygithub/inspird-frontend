import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'


const UNAUTH_PATHS = [
    // Auth
    '/login',
    '/signup',
    '/forgot-password',
    // Home / Landing
    '/',
    // '/home',
    // // Landing
    // '/features',
    // // Information
    // '/pricing',
    // '/terms',
    // '/contact-us',
    // '/faq'
]

const PROTECTED = [
    '/settings',
]

export async function middleware(request: NextRequest) {
    const { supabaseResponse, user } = await updateSession(request)

    // // Prevent logged in users from accessing login page
    if (user && UNAUTH_PATHS.includes(request.nextUrl.pathname)) {
        const url = request.nextUrl.clone()
        url.pathname = '/home'
        return NextResponse.redirect(url)
    }

    if (!user && PROTECTED.includes(request.nextUrl.pathname)) {
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // If user doesnt exist
    // And they are trying to access any path in UNAUTH_PATHS
    // Then redirect to login page
    // if (
    //     !user &&
    //     !UNAUTH_PATHS.includes(request.nextUrl.pathname) &&
    //     !request.nextUrl.pathname.startsWith('/auth') &&
    //     !request.nextUrl.pathname.startsWith('/error')
    // ) {
    //     const url = request.nextUrl.clone()
    //     url.pathname = '/login'
    //     return NextResponse.redirect(url)
    // }

    return supabaseResponse
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * Feel free to modify this pattern to include more paths.
         */
        '/((?!_next/static|_next/image|favicon.ico|api/stripe|api/stripe/.*|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}