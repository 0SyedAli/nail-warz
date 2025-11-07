import {NextResponse } from "next/server"

export async function POST(request) {
  try {
    const formData = await request.formData()
    const notAvailable = formData.get("notAvailable")

    if (!notAvailable) {
      return NextResponse.json({ error: "notAvailable data is required" }, { status: 400 })
    }

    // Parse the JSON string
    const notAvailableSlots = JSON.parse(notAvailable)

    // Here you would typically save to your database
    // For now, we'll just log and return success
    // console.log("Received technician availability update:", {
    //   notAvailable: notAvailableSlots,
    // })

    // Simulate API processing
    await new Promise((resolve) => setTimeout(resolve, 500))

    return NextResponse.json({
      success: true,
      message: "Technician availability updated successfully",
      data: notAvailableSlots,
    })
  } catch (error) {
    console.error("Error updating technician availability:", error)
    return NextResponse.json({ error: "Failed to update technician availability" }, { status: 500 })
  }
}
