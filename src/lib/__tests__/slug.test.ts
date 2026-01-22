/**
 * Slug Utilities Tests
 * Run with: npx ts-node src/lib/__tests__/slug.test.ts
 * Or import in Jest
 */

import {
    normalizeSlug,
    isReservedSlug,
    validateSlug,
    generateSlugFromNames,
    RESERVED_SLUGS
} from "../slug";

// ============================================
// Test normalizeSlug
// ============================================

console.log("=== Testing normalizeSlug ===");

const normalizeTests = [
    { input: "João & Maria", expected: "joao-maria" },
    { input: "  espaços  ", expected: "espacos" },
    { input: "MAIÚSCULAS", expected: "maiusculas" },
    { input: "acentuação-çédilha", expected: "acentuacao-cedilha" },
    { input: "múltiplos---hífens", expected: "multiplos-hifens" },
    { input: "-inicio-fim-", expected: "inicio-fim" },
    { input: "caracteres!@#$%inválidos", expected: "caracteresinvalidos" },
    { input: "under_scores", expected: "under-scores" },
    { input: "", expected: "" },
    { input: "   ", expected: "" },
];

let passed = 0;
let failed = 0;

normalizeTests.forEach(({ input, expected }) => {
    const result = normalizeSlug(input);
    if (result === expected) {
        console.log(`✅ normalizeSlug("${input}") = "${result}"`);
        passed++;
    } else {
        console.log(`❌ normalizeSlug("${input}") = "${result}" (expected: "${expected}")`);
        failed++;
    }
});

// ============================================
// Test isReservedSlug
// ============================================

console.log("\n=== Testing isReservedSlug ===");

const reservedTests = [
    { slug: "login", expected: true },
    { slug: "LOGIN", expected: true },
    { slug: "dashboard", expected: true },
    { slug: "templates", expected: true },
    { slug: "api", expected: true },
    { slug: "maria-joao", expected: false },
    { slug: "meu-casamento", expected: false },
    { slug: "casamento2026", expected: false },
];

reservedTests.forEach(({ slug, expected }) => {
    const result = isReservedSlug(slug);
    if (result === expected) {
        console.log(`✅ isReservedSlug("${slug}") = ${result}`);
        passed++;
    } else {
        console.log(`❌ isReservedSlug("${slug}") = ${result} (expected: ${expected})`);
        failed++;
    }
});

// ============================================
// Test validateSlug
// ============================================

console.log("\n=== Testing validateSlug ===");

const validateTests = [
    { slug: "maria-joao", expectedError: null },
    { slug: "meu-casamento-2026", expectedError: null },
    { slug: "", expectedError: "Slug não pode estar vazio" },
    { slug: "ab", expectedError: "Slug deve ter pelo menos 3 caracteres" },
    { slug: "MAIUSCULAS", expectedError: "Slug deve conter apenas letras minúsculas, números e hífens" },
    { slug: "-inicio", expectedError: "Slug não pode começar ou terminar com hífen" },
    { slug: "fim-", expectedError: "Slug não pode começar ou terminar com hífen" },
    { slug: "dois--hifens", expectedError: "Slug não pode conter hífens consecutivos" },
    { slug: "login", expectedError: "Este slug é reservado. Escolha outro nome." },
    { slug: "dashboard", expectedError: "Este slug é reservado. Escolha outro nome." },
];

validateTests.forEach(({ slug, expectedError }) => {
    const result = validateSlug(slug);
    if (result === expectedError) {
        console.log(`✅ validateSlug("${slug}") = ${result === null ? "null (valid)" : `"${result}"`}`);
        passed++;
    } else {
        console.log(`❌ validateSlug("${slug}") = "${result}" (expected: "${expectedError}")`);
        failed++;
    }
});

// ============================================
// Test generateSlugFromNames
// ============================================

console.log("\n=== Testing generateSlugFromNames ===");

const nameTests = [
    { bride: "Maria", groom: "João", expected: "maria-joao" },
    { bride: "Ana Clara", groom: "Pedro", expected: "ana-clara-pedro" },
    { bride: "", groom: "", expected: "casamento" }, // Falls back due to length
    { bride: "Márcia", groom: "José", expected: "marcia-jose" },
];

nameTests.forEach(({ bride, groom, expected }) => {
    const result = generateSlugFromNames(bride, groom);
    if (result === expected) {
        console.log(`✅ generateSlugFromNames("${bride}", "${groom}") = "${result}"`);
        passed++;
    } else {
        console.log(`❌ generateSlugFromNames("${bride}", "${groom}") = "${result}" (expected: "${expected}")`);
        failed++;
    }
});

// ============================================
// Summary
// ============================================

console.log("\n===================");
console.log(`Total: ${passed + failed} tests`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log("===================");

// Exit with error code if tests failed
if (failed > 0) {
    process.exit(1);
}
