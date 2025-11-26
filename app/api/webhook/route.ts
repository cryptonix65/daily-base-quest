import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook handler for Farcaster MiniApp events
 * This endpoint receives notifications about app events
 * 
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/webhooks}
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log("Webhook received:", body);

    // Handle different webhook event types
    switch (body.event) {
      case "app.installed":
        // User installed the mini app
        console.log("App installed by user:", body.data.fid);
        // TODO: Track installation in your database
        break;
        
      case "app.uninstalled":
        // User uninstalled the mini app
        console.log("App uninstalled by user:", body.data.fid);
        // TODO: Update user status in your database
        break;
        
      case "app.notification":
        // Handle notification-related events
        console.log("Notification event:", body.data);
        break;
        
      default:
        console.log("Unknown webhook event:", body.event);
    }

    // Always return 200 to acknowledge receipt
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Optional: Handle GET requests for webhook verification
export async function GET() {
  // Some webhook systems require GET endpoint verification
  return NextResponse.json({ 
    message: "Webhook endpoint active",
    timestamp: new Date().toISOString()
  });
}

