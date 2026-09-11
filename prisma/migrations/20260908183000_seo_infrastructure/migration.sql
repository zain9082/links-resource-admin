-- AlterTable SeoSetting
ALTER TABLE "SeoSetting" ADD COLUMN IF NOT EXISTS "h1" TEXT;
ALTER TABLE "SeoSetting" ADD COLUMN IF NOT EXISTS "robotsFollow" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "SeoSetting" ADD COLUMN IF NOT EXISTS "ogTitle" TEXT;
ALTER TABLE "SeoSetting" ADD COLUMN IF NOT EXISTS "ogDescription" TEXT;
ALTER TABLE "SeoSetting" ADD COLUMN IF NOT EXISTS "ogImage" TEXT;
ALTER TABLE "SeoSetting" ADD COLUMN IF NOT EXISTS "twitterCard" TEXT NOT NULL DEFAULT 'summary_large_image';
ALTER TABLE "SeoSetting" ADD COLUMN IF NOT EXISTS "schemaType" TEXT;
ALTER TABLE "SeoSetting" ADD COLUMN IF NOT EXISTS "customJsonLd" TEXT;
ALTER TABLE "SeoSetting" ADD COLUMN IF NOT EXISTS "sitemapInclude" BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE "SeoSetting" ADD COLUMN IF NOT EXISTS "sitemapPriority" DOUBLE PRECISION NOT NULL DEFAULT 0.5;
ALTER TABLE "SeoSetting" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable Redirect
ALTER TABLE "Redirect" ADD COLUMN IF NOT EXISTS "statusCode" INTEGER NOT NULL DEFAULT 301;
ALTER TABLE "Redirect" ADD COLUMN IF NOT EXISTS "isRegex" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "Redirect" ADD COLUMN IF NOT EXISTS "hitCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "Redirect" ADD COLUMN IF NOT EXISTS "lastHitAt" TIMESTAMP(3);
ALTER TABLE "Redirect" ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

UPDATE "Redirect"
SET "statusCode" = CASE WHEN "permanent" THEN 301 ELSE 302 END
WHERE "statusCode" = 301 OR "statusCode" IS NOT NULL;

-- CreateTable GlobalSeoSettings
CREATE TABLE IF NOT EXISTS "GlobalSeoSettings" (
    "id" TEXT NOT NULL DEFAULT 'global',
    "siteUrl" TEXT NOT NULL DEFAULT 'https://linksresource.com',
    "siteName" TEXT NOT NULL DEFAULT 'Links Resource',
    "titleTemplate" TEXT NOT NULL DEFAULT '%page_title% | %site_name%',
    "defaultMetaDescription" TEXT,
    "defaultOgImage" TEXT,
    "favicon" TEXT,
    "appleTouchIcon" TEXT,
    "defaultLocale" TEXT NOT NULL DEFAULT 'en_GB',
    "gscVerification" TEXT,
    "ga4Id" TEXT,
    "gtmId" TEXT,
    "robotsTxt" TEXT,
    "organizationSchemaJson" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GlobalSeoSettings_pkey" PRIMARY KEY ("id")
);

INSERT INTO "GlobalSeoSettings" ("id", "siteUrl", "siteName", "titleTemplate", "defaultLocale", "robotsTxt", "updatedAt")
VALUES (
  'global',
  'https://linksresource.com',
  'Links Resource',
  '%page_title% | %site_name%',
  'en_GB',
  E'User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\nDisallow: /dashboard/\nDisallow: /login/\nDisallow: /signup/\nDisallow: /search/',
  CURRENT_TIMESTAMP
)
ON CONFLICT ("id") DO NOTHING;

-- CreateTable NotFoundLog
CREATE TABLE IF NOT EXISTS "NotFoundLog" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "hitCount" INTEGER NOT NULL DEFAULT 1,
    "referrer" TEXT,
    "firstSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeen" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "NotFoundLog_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "NotFoundLog_path_key" ON "NotFoundLog"("path");
CREATE INDEX IF NOT EXISTS "NotFoundLog_hitCount_idx" ON "NotFoundLog"("hitCount");
CREATE INDEX IF NOT EXISTS "NotFoundLog_resolved_hitCount_idx" ON "NotFoundLog"("resolved", "hitCount");

-- CreateTable EntityFaq
CREATE TABLE IF NOT EXISTS "EntityFaq" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntityFaq_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EntityFaq_entityType_entityId_sortOrder_idx" ON "EntityFaq"("entityType", "entityId", "sortOrder");
