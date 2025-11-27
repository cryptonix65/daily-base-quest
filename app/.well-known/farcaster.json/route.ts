import { withValidManifest } from "@coinbase/onchainkit/minikit";
import { minikitConfig } from "../../../minikit.config";

export async function GET() {
  try {
    const manifest = withValidManifest(minikitConfig);
    
    // Add accountAssociation and baseBuilder to the manifest
    const fullManifest = {
      ...manifest,
      accountAssociation: minikitConfig.accountAssociation,
      baseBuilder: minikitConfig.baseBuilder,
    };
    
    return Response.json(fullManifest, {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("Error generating manifest:", error);
    return Response.json(
      { 
        error: "Failed to generate manifest",
        message: error instanceof Error ? error.message : "Unknown error",
        hint: "Check that NEXT_PUBLIC_URL is set in Vercel environment variables"
      },
      { 
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
