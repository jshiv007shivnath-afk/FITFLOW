-- ==============================================================================
-- Universal Deletion / Ban Triggers for Supabase Studio
-- Version: 20261026000001
-- ==============================================================================

-- 1. Ensure deleted_accounts table exists
CREATE TABLE IF NOT EXISTS "deleted_accounts" (
    "id" TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "userId" TEXT NOT NULL,
    "email" TEXT NOT NULL UNIQUE,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'banned',
    "deletedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE "deleted_accounts" ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'banned';
CREATE INDEX IF NOT EXISTS "deleted_accounts_email_idx" ON "deleted_accounts" (LOWER("email"));

-- 2. Trigger Function for "user" table deletion
CREATE OR REPLACE FUNCTION handle_user_table_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF pg_trigger_depth() > 1 THEN
        RETURN OLD;
    END IF;

    INSERT INTO "deleted_accounts" ("userId", "email", "name", "status", "deletedAt")
    VALUES (OLD."id", LOWER(TRIM(OLD."email")), OLD."name", 'banned', CURRENT_TIMESTAMP)
    ON CONFLICT ("email") DO UPDATE SET "deletedAt" = CURRENT_TIMESTAMP, "status" = 'banned';

    -- Remove from admin_panel and account if present
    DELETE FROM "admin_panel" WHERE "user_id" = OLD."id";
    DELETE FROM "account" WHERE "userId" = OLD."id";

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_user_delete ON "user";
CREATE TRIGGER trg_user_delete
BEFORE DELETE ON "user"
FOR EACH ROW EXECUTE FUNCTION handle_user_table_delete();

-- 3. Trigger Function for "admin_panel" table deletion
CREATE OR REPLACE FUNCTION handle_admin_panel_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF pg_trigger_depth() > 1 THEN
        RETURN OLD;
    END IF;

    INSERT INTO "deleted_accounts" ("userId", "email", "name", "status", "deletedAt")
    VALUES (OLD."user_id", LOWER(TRIM(OLD."user_email")), OLD."user_name", 'banned', CURRENT_TIMESTAMP)
    ON CONFLICT ("email") DO UPDATE SET "deletedAt" = CURRENT_TIMESTAMP, "status" = 'banned';

    -- Cascade delete user
    DELETE FROM "user" WHERE "id" = OLD."user_id";

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_admin_panel_delete ON "admin_panel";
CREATE TRIGGER trg_admin_panel_delete
BEFORE DELETE ON "admin_panel"
FOR EACH ROW EXECUTE FUNCTION handle_admin_panel_delete();

-- 4. Trigger Function for "account" table deletion
CREATE OR REPLACE FUNCTION handle_account_delete()
RETURNS TRIGGER AS $$
BEGIN
    IF pg_trigger_depth() > 1 THEN
        RETURN OLD;
    END IF;

    IF OLD."user_email" IS NOT NULL THEN
        INSERT INTO "deleted_accounts" ("userId", "email", "name", "status", "deletedAt")
        VALUES (OLD."userId", LOWER(TRIM(OLD."user_email")), OLD."user_name", 'banned', CURRENT_TIMESTAMP)
        ON CONFLICT ("email") DO UPDATE SET "deletedAt" = CURRENT_TIMESTAMP, "status" = 'banned';

        -- Cascade delete user
        DELETE FROM "user" WHERE "id" = OLD."userId";
    END IF;

    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_account_delete ON "account";
CREATE TRIGGER trg_account_delete
BEFORE DELETE ON "account"
FOR EACH ROW EXECUTE FUNCTION handle_account_delete();

-- 5. Safety: Ensure user's personal email is never accidentally banned
DELETE FROM "deleted_accounts" WHERE LOWER("email") = 'jshiv007.shivnath@gmail.com';
