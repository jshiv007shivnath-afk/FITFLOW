import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import ts from 'typescript';

const require = createRequire(import.meta.url);
require.extensions['.ts'] = (m, f) => {
  const src = fs.readFileSync(f, 'utf8');
  m._compile(
    ts.transpileModule(src, {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
    f
  );
};

const {
  generateCryptographicOtp,
  sanitizeEmail,
  validatePassword,
  validateGoalsInput,
  checkOtpRateLimit,
  recordOtpSent,
  storeOtp,
  verifyOtp,
  MAX_ATTEMPTS,
} = require('../lib/security.ts');

const { renderOtpEmailHtml } = require('../lib/email.ts');

describe('Better Auth & Security Suite - Cryptographic OTP Generation', () => {
  it('generates a 6-digit numeric OTP', () => {
    const otp = generateCryptographicOtp();
    assert.equal(typeof otp, 'string');
    assert.equal(otp.length, 6);
    assert.match(otp, /^\d{6}$/);
    const num = parseInt(otp, 10);
    assert.ok(num >= 100000 && num <= 999999);
  });

  it('generates unique unpredictable OTPs on subsequent calls', () => {
    const sample = new Set();
    for (let i = 0; i < 50; i++) {
      sample.add(generateCryptographicOtp());
    }
    assert.ok(sample.size >= 48);
  });
});

describe('Better Auth & Security Suite - Input Sanitization & Validation', () => {
  it('sanitizes valid email addresses and trims whitespace', () => {
    assert.equal(sanitizeEmail('  Athlete@FitFlow.app  '), 'athlete@fitflow.app');
    assert.equal(sanitizeEmail('user.name+tag@example.co.uk'), 'user.name+tag@example.co.uk');
  });

  it('rejects invalid or malformed email addresses', () => {
    assert.equal(sanitizeEmail('invalid-email'), null);
    assert.equal(sanitizeEmail('@missingusername.com'), null);
    assert.equal(sanitizeEmail('no-domain@'), null);
    assert.equal(sanitizeEmail(null), null);
    assert.equal(sanitizeEmail(undefined), null);
    assert.equal(sanitizeEmail(12345), null);
  });

  it('enforces password minimum length of 8 characters', () => {
    assert.equal(validatePassword('short').isValid, false);
    assert.equal(validatePassword('1234567').isValid, false);
    assert.equal(validatePassword('12345678').isValid, true);
    assert.equal(validatePassword('superSecurePassword2026!').isValid, true);
  });

  it('validates and bounds numerical fitness targets', () => {
    const valid = validateGoalsInput({
      calorieTarget: '650',
      waterTargetMl: '2500',
      exerciseTargetMin: '60',
    });
    assert.equal(valid.isValid, true);
    assert.equal(valid.calorieTarget, 650);
    assert.equal(valid.waterTargetMl, 2500);
    assert.equal(valid.exerciseTargetMin, 60);

    const invalid = validateGoalsInput({
      calorieTarget: '-100',
      waterTargetMl: '2500',
      exerciseTargetMin: '60',
    });
    assert.equal(invalid.isValid, false);
    assert.ok(invalid.error?.includes('Calorie target'));
  });
});

describe('Better Auth & Security Suite - OTP Rate-Limiting & Brute-Force Lockout', () => {
  const testEmail = `test_${Date.now()}@fitflow.test`;

  it('enforces 1 send request per 60s rate-limit', async () => {
    const check1 = await checkOtpRateLimit(testEmail);
    assert.equal(check1.allowed, true);

    recordOtpSent(testEmail);

    const check2 = await checkOtpRateLimit(testEmail);
    assert.equal(check2.allowed, false);
    assert.ok(typeof check2.retryAfterSec === 'number' && check2.retryAfterSec > 0);
  });

  it('locks out verification after 4 consecutive incorrect attempts', async () => {
    const bruteForceEmail = `brute_${Date.now()}@fitflow.test`;
    const correctCode = '123456';
    await storeOtp(bruteForceEmail, correctCode);

    // Make 4 incorrect attempts
    for (let i = 1; i < MAX_ATTEMPTS; i++) {
      const res = await verifyOtp(bruteForceEmail, '000000');
      assert.equal(res.success, false);
      assert.equal(res.status, 'invalid_code');
      assert.equal(res.remainingAttempts, MAX_ATTEMPTS - i);
    }

    // 5th attempt must trigger lockout
    const lockRes = await verifyOtp(bruteForceEmail, '000000');
    assert.equal(lockRes.success, false);
    assert.equal(lockRes.status, 'locked');
    assert.equal(lockRes.remainingAttempts, 0);
    assert.ok(lockRes.error?.includes('15 minutes') || lockRes.error?.includes('locked'));

    // Further attempts while locked must return locked status even with correct code
    const lockedTry = await verifyOtp(bruteForceEmail, correctCode);
    assert.equal(lockedTry.success, false);
    assert.equal(lockedTry.status, 'locked');
  });

  it('succeeds on first valid OTP and invalidates code for single-use', async () => {
    const validEmail = `singleuse_${Date.now()}@fitflow.test`;
    const testOtp = '849201';
    await storeOtp(validEmail, testOtp);

    const verifySuccess = await verifyOtp(validEmail, testOtp);
    assert.equal(verifySuccess.success, true);
    assert.equal(verifySuccess.status, 'valid');

    // Code is now consumed, second attempt should fail
    const replayTry = await verifyOtp(validEmail, testOtp);
    assert.equal(replayTry.success, false);
  });
});

describe('Better Auth & Security Suite - Responsive Email Template', () => {
  it('renders FitFlow branded HTML email with brand colors and 6-digit digits', () => {
    const html = renderOtpEmailHtml('739102');
    assert.ok(html.includes('FIT<span style="color:#B8F45A;">FLOW</span>'));
    assert.ok(html.includes('#111312'));
    assert.ok(html.includes('#B8F45A'));
    assert.ok(html.includes('10 minutes'));
    assert.ok(html.includes('7'));
    assert.ok(html.includes('3'));
    assert.ok(html.includes('9'));
    assert.ok(html.includes('1'));
    assert.ok(html.includes('0'));
    assert.ok(html.includes('2'));
  });
});
