"use server";

import { dataWipeSuggestion } from "@/ai/flows/data-wipe-suggestion";
import {
  verifyCertificate,
  createCertificate,
  anchorCertificate,
} from "@/ai/flows/certificate-flow";
import type {
  DataWipeSuggestionInput,
  VerifyCertificateInput,
  CreateCertificateInput,
  Stats,
} from "@/lib/types";
import prisma from "@/lib/db";

// ==========================
// Constants
// ==========================
const EWASTE_PER_WIPE_KG = 0.05; // 50 grams
const CO2_PER_WIPE_KG = 0.1; // 100 grams
const ENERGY_PER_WIPE_KWH = 0.02; // 0.02 kWh
const WIPES_PER_TREE = 50; // Equivalent of 1 tree planted for every 50 wipes

// ==========================
// Helpers
// ==========================
async function getOrCreateStats(): Promise<Stats & { id: string }> {
  let stats = await prisma.stats.findUnique({ where: { id: "stats" } });
  if (!stats) {
    stats = await prisma.stats.create({
      data: {
        id: "stats",
        totalWipes: 0,
        pdfDownloads: 0,
        eWasteDiverted: 0,
        co2Saved: 0,
        energySaved: 0,
        treesSaved: 0,
        lastCertificateId: "",
        wipeMethodDistribution: {},
      },
    });
  }
  return stats as any;
}

// ==========================
// Stats Fetch
// ==========================
export async function getStats() {
  const stats = await getOrCreateStats();
  return { success: true, data: stats };
}

// ==========================
// Wipe Events
// ==========================
export async function getWipeEvents() {
  const events = await prisma.wipeEvent.findMany({
    orderBy: { timestamp: "asc" },
  });
  return events.map((e: any) => ({
    ...e,
    date: e.timestamp.toISOString().split("T")[0],
  }));
}

// ==========================
// Increment Wipes
// ==========================
export async function incrementWipes(wipeMethod: string) {
  const stats = await getOrCreateStats();

  const newTotalWipes = stats.totalWipes + 1;
  const newEWasteDiverted = parseFloat(
    (stats.eWasteDiverted + EWASTE_PER_WIPE_KG).toFixed(2)
  );
  const newCo2Saved = parseFloat(
    (stats.co2Saved + CO2_PER_WIPE_KG).toFixed(2)
  );
  const newEnergySaved = parseFloat(
    (stats.energySaved + ENERGY_PER_WIPE_KWH).toFixed(2)
  );
  const newTreesSaved = Math.floor(newTotalWipes / WIPES_PER_TREE);

  // Ensure distribution is valid JSON
  const wipeMethodDistribution: Record<string, number> = {
    ...(typeof stats.wipeMethodDistribution === "object"
      ? (stats.wipeMethodDistribution as Record<string, number>)
      : {}),
  };
  wipeMethodDistribution[wipeMethod] =
    (wipeMethodDistribution[wipeMethod] || 0) + 1;

  const updated = await prisma.stats.update({
    where: { id: "stats" },
    data: {
      totalWipes: newTotalWipes,
      eWasteDiverted: newEWasteDiverted,
      co2Saved: newCo2Saved,
      energySaved: newEnergySaved,
      treesSaved: newTreesSaved,
      wipeMethodDistribution,
    },
  });

  await prisma.wipeEvent.create({
    data: {
      totalWipes: newTotalWipes,
      co2Saved: newCo2Saved,
      eWasteDiverted: newEWasteDiverted,
      energySaved: newEnergySaved,
    },
  });

  return { success: true, data: updated };
}

// ==========================
// Increment PDF Downloads
// ==========================
export async function incrementPdfDownloads() {
  const stats = await getOrCreateStats();
  const updated = await prisma.stats.update({
    where: { id: "stats" },
    data: { pdfDownloads: stats.pdfDownloads + 1 },
  });
  return { success: true, data: updated };
}

// ==========================
// Reset Stats
// ==========================
export async function resetStats() {
  const stats = await prisma.stats.upsert({
    where: { id: "stats" },
    update: {
      totalWipes: 0,
      pdfDownloads: 0,
      eWasteDiverted: 0,
      co2Saved: 0,
      energySaved: 0,
      treesSaved: 0,
      lastCertificateId: "",
      wipeMethodDistribution: {},
    },
    create: {
      id: "stats",
      totalWipes: 0,
      pdfDownloads: 0,
      eWasteDiverted: 0,
      co2Saved: 0,
      energySaved: 0,
      treesSaved: 0,
      lastCertificateId: "",
      wipeMethodDistribution: {},
    },
  });
  return { success: true, data: stats };
}

// ==========================
// AI Suggestion
// ==========================
export async function getWipeSuggestion(input: DataWipeSuggestionInput) {
  try {
    const result = await dataWipeSuggestion(input);
    return { success: true, data: result };
  } catch (error) {
    console.error("AI suggestion failed:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during AI suggestion.";
    return { success: false, error: errorMessage };
  }
}

// ==========================
// Certificate Actions
// ==========================
export async function verifyCertificateAction(input: VerifyCertificateInput) {
  try {
    const result = await verifyCertificate(input.certificateId);
    if (result.found && result.certificate) {
      return { success: true, data: result.certificate };
    } else {
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.error("Certificate verification failed:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during verification.";
    return { success: false, error: errorMessage };
  }
}

export async function anchorCertificateAction(input: { certificateId: string }) {
  try {
    const result = await anchorCertificate(input.certificateId);
    return { success: result.success };
  } catch (error) {
    console.error("Certificate anchoring failed:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during anchoring.";
    return { success: false, error: errorMessage };
  }
}

export async function createCertificateAction(input: CreateCertificateInput) {
  try {
    const result = await createCertificate(input);
    if (result && result.certificateId) {
      await prisma.stats.update({
        where: { id: "stats" },
        data: { lastCertificateId: result.certificateId },
      });
      await incrementWipes(input.wipeMethod || "N/A");
      return { success: true, data: { certificateId: result.certificateId } };
    }
    throw new Error("Certificate creation did not return a certificate ID.");
  } catch (error) {
    console.error("Certificate creation failed:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : "An unknown error occurred during creation.";
    return { success: false, error: errorMessage };
  }
}
