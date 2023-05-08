import { InferModel } from 'drizzle-orm';
import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core';

export const songs = pgTable('users', {
  id: serial('id').primaryKey(),
  title: varchar('title').notNull(),
  artist: varchar('artist').notNull(),
  lyrics: text('lyrics').notNull(),
});

export type Song = InferModel<typeof songs>;
