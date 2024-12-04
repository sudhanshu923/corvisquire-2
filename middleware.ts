import { NextResponse } from 'next/server';

export function middleware(request: Request) {
    const response = NextResponse.next();

    // Allow all origins, headers, and methods
    response.headers.set('Access-Control-Allow-Origin', '*'); // '*' allows all origins
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // Handle preflight (OPTIONS) requests
    if (request.method === 'OPTIONS') {
        return new NextResponse(null, { status: 200, headers: response.headers });
    }

    return response;
}

// Define the paths where middleware will run
export const config = {
    matcher: ['/api/:path*'], // This ensures that middleware applies to API routes
};
