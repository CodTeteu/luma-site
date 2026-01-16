import { render, screen } from "@testing-library/react";
import { siteConfig } from "@/config/site.config";

describe("Site Configuration", () => {
    describe("siteConfig", () => {
        it("should have correct site name", () => {
            expect(siteConfig.name).toBe("LUMA");
        });

        it("should have WhatsApp configuration", () => {
            expect(siteConfig.contact.whatsapp.number).toBeDefined();
            expect(siteConfig.contact.whatsapp.displayText).toBe("Fale no WhatsApp");
        });

        it("should generate correct WhatsApp URL", () => {
            const url = siteConfig.contact.whatsapp.getUrl();
            expect(url).toContain("https://wa.me/");
            expect(url).toContain(siteConfig.contact.whatsapp.number);
        });

        it("should generate WhatsApp URL with message", () => {
            const message = "Hello World";
            const url = siteConfig.contact.whatsapp.getUrl(message);
            expect(url).toContain("?text=");
            expect(url).toContain(encodeURIComponent(message));
        });

        it("should have navigation items", () => {
            expect(siteConfig.navigation.main).toHaveLength(4);
            expect(siteConfig.navigation.main[0]).toHaveProperty("label");
            expect(siteConfig.navigation.main[0]).toHaveProperty("href");
        });

        it("should have business stats", () => {
            expect(siteConfig.stats).toHaveProperty("yearsExperience");
            expect(siteConfig.stats).toHaveProperty("weddingsCompleted");
            expect(siteConfig.stats).toHaveProperty("averageRating");
            expect(siteConfig.stats).toHaveProperty("countriesServed");
        });
    });
});
