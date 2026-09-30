-- Currency is now Bangladeshi Taka; amounts are stored in poisha (1/100 taka). Rename keeps the data.
ALTER TABLE "Programme" RENAME COLUMN "annualFeePence" TO "annualFeePoisha";
ALTER TABLE "FeeCharge" RENAME COLUMN "amountPence" TO "amountPoisha";
ALTER TABLE "Payment" RENAME COLUMN "amountPence" TO "amountPoisha";
