import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const ids = searchParams.get('ids');

    if (!ids) {
        return NextResponse.json({ error: 'Missing ids parameter' }, { status: 400 });
    }

    try {
        // CoinGecko Free API endpoint
        const response = await fetch(
            `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`,
            {
                headers: {
                    'Accept': 'application/json',
                },
                next: { revalidate: 60 } // Cache for 60 seconds
            }
        );

        if (!response.ok) {
            throw new Error(`CoinGecko API error: ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);

    } catch (error) {
        console.error('Price fetch error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch prices' },
            { status: 500 }
        );
    }
}
