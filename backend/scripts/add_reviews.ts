import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";
import { randomUUID } from "crypto";

dotenv.config({ path: "../.dev.vars" }); // It is run from root maybe? Let's check cwd. Actually if I run it from root, path is ".dev.vars". Let's use ".dev.vars".
dotenv.config({ path: ".dev.vars" });

async function seedReviews() {
  const client = createClient({
    url: process.env.TURSO_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  });

  // Get product ID
  const productRes = await client.execute({
    sql: "SELECT id FROM products WHERE slug = ?",
    args: ["educational-baby-mat-oojc4"]
  });

  if (productRes.rows.length === 0) {
    console.error("Product not found!");
    return;
  }
  const productId = productRes.rows[0].id;
  console.log("Found product ID:", productId);

  const images = [
    '["/images/baby_mat_1.png"]',
    '["/images/baby_mat_2.png"]',
    '["/images/baby_mat_3.png"]',
    '["/images/baby_mat_1.png", "/images/baby_mat_2.png"]',
    '[]',
    '["/images/baby_mat_3.png"]'
  ];

  const reviewsData = [
    {
      username: "Sarah Jenkins",
      rating: 5,
      title: "Absolutely perfect for my 8-month-old!",
      content: "This play mat is everything we wanted. The colors are vibrant and my baby loves pointing at the animals. It's soft, easy to clean, and the quality is definitely premium. Plus, it looks gorgeous in the nursery!",
      images: images[0],
      isVerified: 1
    },
    {
      username: "Emily R.",
      rating: 5,
      title: "Great educational value",
      content: "We've been using this for a few weeks now. The shapes and letters are really clear. It's thick enough to cushion little falls. The close-up details are amazing, it feels very durable.",
      images: images[1],
      isVerified: 1
    },
    {
      username: "Michael Chen",
      rating: 4,
      title: "Nice but slightly smaller than expected",
      content: "My son enjoys playing with his blocks on it. It's a very nice mat, bright and warm. I just wish it was slightly larger, but overall it's a great purchase. The animal prints are very cute.",
      images: images[2],
      isVerified: 0
    },
    {
      username: "Jessica Alba",
      rating: 5,
      title: "Beautiful and safe!",
      content: "I am absolutely in love with this mat. Not only is it educational with the alphabet, but it is also a safe place for my daughter to crawl. Highly recommended to all moms looking for an aesthetic yet functional play mat.",
      images: images[3],
      isVerified: 1
    },
    {
      username: "David Smith",
      rating: 5,
      title: "Easy to clean and fun",
      content: "Spills wipe right off. The numbers and letters are a fun way to start early learning. Solid 5 stars from our family.",
      images: images[4],
      isVerified: 1
    },
    {
      username: "Anna P.",
      rating: 4,
      title: "Good quality materials",
      content: "You can tell the materials are high-end. No weird chemical smells out of the box, which is a huge plus. My baby loves the bright colors.",
      images: images[5],
      isVerified: 1
    }
  ];

  let now = Math.floor(Date.now() / 1000);

  for (const review of reviewsData) {
    await client.execute({
      sql: `INSERT INTO reviews (
        id, product_id, user_id, username, rating, title, content, images, is_verified, helpful_count, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        randomUUID(),
        productId,
        randomUUID(),
        review.username,
        review.rating,
        review.title,
        review.content,
        review.images,
        review.isVerified,
        Math.floor(Math.random() * 20),
        "approved",
        now - Math.floor(Math.random() * 10000000) // random time in past (seconds)
      ]
    });
    console.log("Inserted review by", review.username);
  }

  console.log("Done inserting 6 reviews!");
}

seedReviews().catch(console.error);
