import { z } from "zod";

// Define a Zod schema for a table
export const feedInventorySchema = z.object({
  id: z.string(),
  material: z.string(),
  paid: z.boolean(),
  supplier: z.string(),
  cost: z.number(),
  timestamp: z.string().datetime(), // ISO string for dates
  quantity: z.number(),
});

// Infer the TypeScript type from the Zod schema
export type FeedInventory = z.infer<typeof feedInventorySchema>;
