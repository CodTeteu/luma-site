import { briefingSchema, defaultBriefingValues, step1Schema, step2Schema, step3Schema } from "@/lib/briefingSchema";

describe("Briefing Schema Validation", () => {
    describe("step1Schema - Couple & Event", () => {
        it("should validate correct data", () => {
            const validData = {
                brideName: "Maria",
                groomName: "João",
                weddingDate: "2025-12-25",
                weddingTime: "16:00",
                venueName: "Igreja Matriz",
                venueAddress: "Rua das Flores, 123",
            };

            const result = step1Schema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it("should reject empty bride name", () => {
            const invalidData = {
                brideName: "",
                groomName: "João",
                weddingDate: "2025-12-25",
                weddingTime: "16:00",
                venueName: "Igreja",
                venueAddress: "Rua das Flores, 123",
            };

            const result = step1Schema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it("should reject short venue address", () => {
            const invalidData = {
                brideName: "Maria",
                groomName: "João",
                weddingDate: "2025-12-25",
                weddingTime: "16:00",
                venueName: "Igreja",
                venueAddress: "Rua",
            };

            const result = step1Schema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe("step2Schema - Visual Identity", () => {
        it("should validate correct visual identity data", () => {
            const validData = {
                weddingStyle: "classico",
                primaryColor: "#2A3B2E",
                secondaryColor: "#C19B58",
                backgroundColor: "#F7F5F0",
                fontPreference: "classica",
            };

            const result = step2Schema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it("should reject invalid hex color", () => {
            const invalidData = {
                weddingStyle: "classico",
                primaryColor: "not-a-color",
                secondaryColor: "#C19B58",
                backgroundColor: "#F7F5F0",
                fontPreference: "classica",
            };

            const result = step2Schema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it("should reject invalid wedding style", () => {
            const invalidData = {
                weddingStyle: "invalid-style",
                primaryColor: "#2A3B2E",
                secondaryColor: "#C19B58",
                backgroundColor: "#F7F5F0",
                fontPreference: "classica",
            };

            const result = step2Schema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe("step3Schema - PIX Data", () => {
        it("should validate correct PIX data", () => {
            const validData = {
                pixKeyType: "cpf",
                pixKey: "123.456.789-00",
                pixHolderName: "Maria da Silva",
                pixBank: "Nubank",
            };

            const result = step3Schema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it("should reject empty PIX key", () => {
            const invalidData = {
                pixKeyType: "cpf",
                pixKey: "",
                pixHolderName: "Maria da Silva",
                pixBank: "Nubank",
            };

            const result = step3Schema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe("Full briefingSchema", () => {
        it("should validate complete form data", () => {
            const validData = {
                ...defaultBriefingValues,
                brideName: "Maria",
                groomName: "João",
                weddingDate: "2025-12-25",
                weddingTime: "16:00",
                venueName: "Igreja Matriz",
                venueAddress: "Rua das Flores, 123",
                pixKey: "123.456.789-00",
                pixHolderName: "Maria da Silva",
                pixBank: "Nubank",
            };

            const result = briefingSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it("should have correct default values", () => {
            expect(defaultBriefingValues.weddingStyle).toBe("classico");
            expect(defaultBriefingValues.primaryColor).toBe("#2A3B2E");
            expect(defaultBriefingValues.fontPreference).toBe("classica");
        });
    });
});
