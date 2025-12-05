import prisma from "../utils/prisma.js";

export const createListing = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user found in request." });
    }

    const { personalInfo, propertyInfo, moreInfo } = req.body;

    const title = propertyInfo?.listingTitle || "";
    const description = propertyInfo?.description || "";
    const country = moreInfo?.country || "";
    const city = moreInfo?.city || personalInfo?.city || "";
    const address = propertyInfo?.address || "";
    const price =
      propertyInfo?.propertyListing === "rent"
        ? null
        : parseFloat(propertyInfo?.price) || null;
    const rentalPrice =
      propertyInfo?.propertyListing === "rent"
        ? parseFloat(propertyInfo?.price) || null
        : null;
    const type = propertyInfo?.propertyType;
    const listingStatus = propertyInfo?.propertyListing;
    const tags = [];
    const amenities = moreInfo?.amenities
      ? Object.keys(moreInfo.amenities).filter((key) => moreInfo.amenities[key])
      : [];
    const reasonForSelling = personalInfo?.reasonForSelling;

    const squareFeet = propertyInfo?.squareFeet
      ? Math.max(1, parseInt(propertyInfo.squareFeet)) || null
      : null;
    const bedrooms = propertyInfo?.bedrooms
      ? Math.max(0, parseInt(propertyInfo.bedrooms)) || null
      : null;
    const bathrooms = propertyInfo?.bathrooms
      ? Math.max(0, parseInt(propertyInfo.bathrooms)) || null
      : null;

    let furnishing = null;
    if (propertyInfo?.furnishing) {
      const furnishingMap = {
        "Fully Furnished": "FURNISHED",
        "Semi-Furnished": "SEMI_FURNISHED",
        Unfurnished: "UNFURNISHED",
      };
      furnishing = furnishingMap[propertyInfo.furnishing] || null;
    }

    const latitude = parseFloat(moreInfo?.latitude);
    const longitude = parseFloat(moreInfo?.longitude);

    let thumbnail = null;
    let images = [];

    if (req.files?.thumbnail?.[0]) {
      thumbnail =
        req.files.thumbnail[0].publicUrl || req.files.thumbnail[0].path;
    }

    if (req.files?.images) {
      images = req.files.images.map((file) => file.publicUrl || file.path);
    }

    if (!personalInfo || !propertyInfo || !moreInfo) {
      return res.status(400).json({
        message:
          "Missing required sections: personalInfo, propertyInfo, and moreInfo are required",
      });
    }

    if (!title) {
      return res.status(400).json({ message: "Property title is required" });
    }

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({
        message: "Valid latitude and longitude coordinates are required.",
      });
    }

    if (
      !personalInfo.fullName ||
      !personalInfo.emailAddress ||
      !personalInfo.phoneNumber
    ) {
      return res.status(400).json({
        message: "Personal information (name, email, phone) is required.",
      });
    }

    if (!country || !city || !address || !type) {
      return res.status(400).json({
        message: "Property location and type information is required.",
      });
    }

    let newListing;
    try {
      newListing = await prisma.listing.create({
        data: {
          title,
          description,
          thumbnail,
          images,
          userId,
          country,
          city,
          address,
          price,
          rentalPrice,
          type,
          listingStatus,
          tags,
          amenities,
          reasonForSelling,
          squareFeet,
          bedrooms,
          bathrooms,
          furnishing,
        },
      });
    } catch (prismaError) {
      console.error("Prisma create error:", prismaError);
      return res.status(400).json({
        message: "Database error while creating listing",
        error: prismaError.message,
        details: prismaError,
      });
    }

    await prisma.$executeRaw`
      UPDATE "Listing"
      SET location = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)::geography
      WHERE id = ${newListing.id};
    `;

    return res.status(201).json({
      message: "Listing created successfully",
      listing: { ...newListing, latitude, longitude },
    });
  } catch (err) {
    console.error("Error creating listing:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const viewListings = async (req, res) => {
  try {
    const {
      listingStatus,
      minPrice,
      maxPrice,
      propertyTypes,
      amenities,
      minArea,
      maxArea,
    } = req.query;

    // Build where clause based on query parameters
    const whereClause = {};

    if (listingStatus) {
      whereClause.listingStatus = listingStatus;
    }

    // Only keep route-based filtering on server side
    // Client-side filtering will handle the rest

    const listings = await prisma.listing.findMany({
      where: whereClause,
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
    });

    const listingsWithCoords = await Promise.all(
      listings.map(async (listing) => {
        const [coords] = await prisma.$queryRaw`
          SELECT ST_X(location::geometry) AS longitude,
                 ST_Y(location::geometry) AS latitude
          FROM "Listing"
          WHERE id = ${listing.id};
        `;
        return { ...listing, ...coords };
      })
    );

    return res.status(200).json(listingsWithCoords);
  } catch (err) {
    console.error("Error fetching listings:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};

export const viewListing = async (req, res) => {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id: Number(id) },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const [coords] = await prisma.$queryRaw`
      SELECT ST_X(location::geometry) AS longitude,
             ST_Y(location::geometry) AS latitude
      FROM "Listing"
      WHERE id = ${parseInt(id)};
    `;

    return res.status(200).json({ ...listing, ...coords });
  } catch (err) {
    console.error("Error fetching listing:", err);
    return res
      .status(500)
      .json({ message: "Server error", error: err.message });
  }
};
