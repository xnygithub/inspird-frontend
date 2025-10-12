import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const DEFAULT_TAB = "profile";
const allowedTabs = ["profile", "account", "filtering", "subscription"];
export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request,
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
                    supabaseResponse = NextResponse.next({
                        request,
                    })
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    )
                },
            },
        }
    )

    // Do not run code between createServerClient and
    // supabase.auth.getUser(). A simple mistake could make it very hard to debug
    // issues with users being randomly logged out.

    // IMPORTANT: DO NOT REMOVE auth.getUser()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // Prevent logged in users from accessing login page
    if (user && request.nextUrl.pathname.startsWith('/login')) {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)

    }

    // Handle settings routes by redirecting to "/" and bootstrapping modal via cookies
    const { pathname } = request.nextUrl
    const isSettingsRoute =
        pathname === '/settings' ||
        pathname === '/settings/' ||
        pathname.startsWith('/settings/')

    // Only settings cookies here if user is logged in
    if (isSettingsRoute && user) {
        const url = request.nextUrl.clone()
        url.pathname = '/'

        const redirectResponse = NextResponse.redirect(url)
        // Preserve Supabase-managed cookies to avoid session desync
        const supaCookies = supabaseResponse.cookies.getAll()
        supaCookies.forEach((cookie) => redirectResponse.cookies.set(cookie))

        // Set short-lived cookies to open settings UI on the client
        const parts = pathname.split('/').filter(Boolean)
        const tab = allowedTabs.includes(parts[1]) ? parts[1] : DEFAULT_TAB

        redirectResponse.cookies.set('openSettings', '1', {
            path: '/',
            maxAge: 15,
            httpOnly: false,
        })
        redirectResponse.cookies.set('openSettingsTab', tab, {
            path: '/',
            maxAge: 15,
            httpOnly: false,
        })

        return redirectResponse
    }

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/login') &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith('/error')
    ) {
        // no user, potentially respond by redirecting the user to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/login'
        return NextResponse.redirect(url)
    }

    // IMPORTANT: You *must* return the supabaseResponse object as it is.
    // If you're creating a new response object with NextResponse.next() make sure to:
    // 1. Pass the request in it, like so:
    //    const myNewResponse = NextResponse.next({ request })
    // 2. Copy over the cookies, like so:
    //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
    // 3. Change the myNewResponse object to fit your needs, but avoid changing
    //    the cookies!
    // 4. Finally:
    //    return myNewResponse
    // If this is not done, you may be causing the browser and server to go out
    // of sync and terminate the user's session prematurely!

    return supabaseResponse
}