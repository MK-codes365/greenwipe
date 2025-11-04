
'use server';
/**
 * @fileOverview Manages generation and verification of data wipe certificates.
 * 
 * - verifyCertificate - Verifies a certificate by its ID.
 * - createCertificate - Creates a new certificate for a wiped item.
 * - anchorCertificate - Anchors a certificate to the (simulated) blockchain.
 */

import { ai } from '@/ai/genkit';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { type CreateCertificateInput, type Certificate, type CertificateVerificationOutput } from '@/lib/types';
import prisma from '@/lib/db';


// Tool for creating a certificate
const createCertificateTool = ai.defineTool(
    {
        name: 'createCertificateTool',
        description: 'Creates a new data wipe certificate in the system and returns its ID.',
        inputSchema: z.object({
            itemName: z.string(),
            itemSize: z.string(),
            clientName: z.string(),
            wipeMethod: z.string(),
            userId: z.string(),
        }),
        outputSchema: z.object({ certificateId: z.string() }),
    },
    async (input) => {
    const date = new Date();
    const certificateId = randomUUID();

        const newCertificate: Certificate = {
            ...input,
            certificateId,
            wipeCompletionDate: date.toISOString(),
            verificationMethod: 'Cryptographic Signature (Simulated)',
            reportJson: '', // Will be populated when verified
            anchored: false, // Start as not anchored
            transactionId: null, // No transaction ID initially
            auditTrail: [
                { timestamp: new Date(date.getTime() - 5000).toISOString(), event: `Wipe process initiated for ${input.itemName}.` },
                { timestamp: new Date(date.getTime() - 1000).toISOString(), event: `Wipe completed using ${input.wipeMethod}.` },
                { timestamp: date.toISOString(), event: `Certificate ${certificateId} created.` },
            ]
        };
        
        // Dynamically create the JSON report
        newCertificate.reportJson = JSON.stringify(newCertificate, null, 2);

        await prisma.certificate.create({
            data: {
                id: certificateId,
                userId: input.userId,
                itemName: newCertificate.itemName,
                itemSize: newCertificate.itemSize,
                wipeMethod: newCertificate.wipeMethod,
                wipeCompletionDate: new Date(newCertificate.wipeCompletionDate),
                verificationMethod: newCertificate.verificationMethod,
                clientName: newCertificate.clientName,
                reportJson: newCertificate.reportJson,
                anchored: !!newCertificate.anchored,
                transactionId: newCertificate.transactionId ?? '',
                auditTrail: newCertificate.auditTrail ?? [],
            }
        });
        console.log(`Created certificate with ID: ${certificateId}`);
        return { certificateId };
    }
);

const creationPrompt = ai.definePrompt({
    name: 'certificateCreationPrompt',
    input: { schema: z.object({
        itemName: z.string(),
        itemSize: z.string(),
        clientName: z.string(),
        wipeMethod: z.string(),
        userId: z.string(),
    }) },
    output: { schema: z.object({ certificateId: z.string() }) },
    tools: [createCertificateTool],
    prompt: `A file wipe has been completed. Use the createCertificateTool to generate a new certificate with the provided details and return the certificate ID.
    
    Item Name: {{{itemName}}}
    Item Size: {{{itemSize}}}
    Client Name: {{{clientName}}}
    Wipe Method: {{{wipeMethod}}}
    `
});

export const createCertificateFlow = ai.defineFlow(
    {
        name: 'createCertificateFlow',
        inputSchema: z.object({
            itemName: z.string(),
            itemSize: z.string(),
            clientName: z.string(),
            wipeMethod: z.string(),
            userId: z.string(),
        }),
        outputSchema: z.object({ certificateId: z.string() }),
    },
    async (input) => {
        // Try using the LLM prompt first. If it returns no output (null),
        // fall back to calling the deterministic tool directly to create the certificate.
        let output: { certificateId: string } | undefined;
        try {
            const result = await creationPrompt(input as any);
            output = (result as any)?.output;
        } catch (e) {
            console.error('creationPrompt invocation failed, falling back to tool:', e);
        }

        if (!output) {
            // Fallback: call the tool directly
            try {
                const toolResult = await createCertificateTool(input as any);
                if (!toolResult || !toolResult.certificateId) {
                    throw new Error('Tool fallback did not return a certificateId');
                }
                return { certificateId: toolResult.certificateId };
            } catch (e) {
                console.error('createCertificateTool fallback failed:', e);
                throw new Error('Failed to create certificate.');
            }
        }

        return output;
    }
);

export const anchorCertificateFlow = ai.defineFlow({
    name: 'anchorCertificateFlow',
    inputSchema: z.string(),
    outputSchema: z.object({
        success: z.boolean(),
        transactionId: z.string().optional(),
    }),
}, async (certificateId) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 5000));

    const certificate = await prisma.certificate.findUnique({ where: { id: certificateId } });
    if (!certificate) {
        return { success: false };
    }
    const transactionId = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
    const updatedAuditTrail = [
        ...((certificate.auditTrail as any[]) ?? []),
        { timestamp: new Date().toISOString(), event: 'Certificate anchored to blockchain.' },
    ];
    await prisma.certificate.update({
        where: { id: certificateId },
        data: {
            anchored: true,
            transactionId,
            auditTrail: updatedAuditTrail,
            reportJson: JSON.stringify({ ...certificate, anchored: true, transactionId, auditTrail: updatedAuditTrail }, null, 2),
        }
    });
    console.log(`Anchored certificate ${certificateId} with txID: ${transactionId}`);
    return { success: true, transactionId };
});


// Wrapper function for use in server actions - direct data access
export async function verifyCertificate(certificateId: string): Promise<CertificateVerificationOutput> {
    console.log(`Verifying certificate with ID: ${certificateId}`);
    const certificate = await prisma.certificate.findUnique({ where: { id: certificateId } });
    if (certificate) {
        // Map Prisma result to expected Certificate type
        const mappedCertificate: Certificate = {
            certificateId: certificate.id,
            itemName: certificate.itemName,
            itemSize: certificate.itemSize,
            wipeMethod: certificate.wipeMethod,
            wipeCompletionDate: certificate.wipeCompletionDate instanceof Date ? certificate.wipeCompletionDate.toISOString() : certificate.wipeCompletionDate,
            verificationMethod: certificate.verificationMethod,
            clientName: certificate.clientName,
            reportJson: certificate.reportJson,
            anchored: certificate.anchored,
            transactionId: certificate.transactionId,
            auditTrail: certificate.auditTrail as any[],
        };
        return {
            found: true,
            message: 'Certificate verified successfully.',
            certificate: mappedCertificate,
        };
    } else {
        return {
            found: false,
            message: `Certificate not found. Please check the ID and try again.`,
        };
    }
}

// Wrapper function for use in server actions
export async function createCertificate(input: CreateCertificateInput): Promise<{ certificateId: string }> {
    return createCertificateFlow(input);
}

export async function anchorCertificate(certificateId: string): Promise<{ success: boolean; transactionId?: string; }> {
    return anchorCertificateFlow(certificateId);
}
