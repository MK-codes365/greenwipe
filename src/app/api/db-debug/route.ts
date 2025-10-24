import { NextResponse } from 'next/server';
import dns from 'dns';
import net from 'net';

type DnsResult = {
    result?: string | string[];
    error?: string;
};

interface DebugResults {
    dnsLookup: DnsResult;
    dnsResolve: DnsResult;
    dnsResolve4: DnsResult;
    connectionTest: boolean | null;
    connectionTestDirect: boolean | null;
    error?: string;
    originalHost?: string;
    transformedHost?: string;
}

async function dnsLookup(hostname: string): Promise<string> {
    return new Promise((resolve, reject) => {
        dns.lookup(hostname, (err, address) => {
            if (err) reject(err);
            else resolve(address);
        });
    });
}

async function testConnection(host: string, port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const socket = new net.Socket();
        const onError = () => {
            socket.destroy();
            resolve(false);
        };

        socket.setTimeout(5000);
        socket.once('error', onError);
        socket.once('timeout', onError);

        socket.connect(port, host, () => {
            socket.end();
            resolve(true);
        });
    });
}

export async function GET() {
    const results: DebugResults = {
        dnsLookup: {},
        dnsResolve: {},
        dnsResolve4: {},
        connectionTest: null,
        connectionTestDirect: null
    };

    try {
        if (!process.env.DATABASE_URL) {
            throw new Error('DATABASE_URL is not defined');
        }

        const url = new URL(process.env.DATABASE_URL);
        const host = url.hostname;
        results.originalHost = host;
        
        // Transform host for direct connection
        const projectRef = host.split('.')[1];
        results.transformedHost = projectRef ? `db.${projectRef}.supabase.co` : host;
        
        // Try different DNS resolution methods
        try {
            const lookupResult = await dnsLookup(results.transformedHost);
            results.dnsLookup = { result: lookupResult };
        } catch (error: any) {
            results.dnsLookup = { error: error?.message || 'DNS lookup failed' };
        }

        try {
            const resolveResult = await dns.promises.resolve(results.transformedHost);
            results.dnsResolve = { result: resolveResult };
        } catch (error: any) {
            results.dnsResolve = { error: error?.message || 'DNS resolve failed' };
        }

        try {
            const resolve4Result = await dns.promises.resolve4(results.transformedHost);
            results.dnsResolve4 = { result: resolve4Result };
        } catch (error: any) {
            results.dnsResolve4 = { error: error?.message || 'DNS resolve4 failed' };
        }

        // Test connections
        if (results.dnsResolve4.result && Array.isArray(results.dnsResolve4.result)) {
            results.connectionTest = await testConnection(results.dnsResolve4.result[0], 5432);
        }

        // Test direct connection to transformed host
        results.connectionTestDirect = await testConnection(results.transformedHost, 5432);

    } catch (error: any) {
        results.error = error?.message || 'Unknown error occurred';
    }

    return NextResponse.json(results);
}