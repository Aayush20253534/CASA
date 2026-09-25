# Security Policy

## Supported version

Security fixes are applied to the current `main` branch and the production deployment built from it.

## Reporting a vulnerability

Please use GitHub's private vulnerability reporting flow from the repository **Security** tab when it is available. Do not publish exploit details, credentials, private booking information, or proof-of-concept payloads in a public issue.

If private reporting is not available, open a minimal issue stating that you need a private channel for a security report, without including the vulnerability details.

## Scope

This repository is a static Vite/React hotel website. It does not intentionally contain a database, authentication system, payment processor, or server-side booking API. Booking details are prepared locally in the visitor's browser and handed to WhatsApp only after the visitor submits the form.

Secrets must never be committed to this repository or exposed through `VITE_*` variables. Anything shipped to the browser is public by definition.
