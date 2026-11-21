# AGA Submission and Release Checklist — November 2026

## Verified
- [x] GitHub repository has native SwiftUI iOS prototype
- [x] GitHub simulator compilation completed successfully
- [x] Browser UI tests passed for separate web prototype
- [x] Web API tests passed

## iOS TestFlight prerequisites
- [ ] Confirm active Apple Developer Program membership and team
- [ ] Confirm availability of final bundle ID (currently `com.afterglowave.ios`)
- [ ] Produce approved 1024x1024 app icon, screenshots and product metadata
- [ ] Publish real support contact and privacy policy
- [ ] Review accessibility, privacy, age-rating and data handling
- [ ] Select proper Apple signing team and generate signed device archive
- [ ] Upload signed archive with Xcode / Transporter to App Store Connect
- [ ] Distribute internally via TestFlight and verify on real iPhones

## Full dating/social app release blockers
- [ ] Secure real member profiles and robust sign-in on iOS and Android
- [ ] Mutual invitations, both sides accept before any call
- [ ] Production WebRTC/managed video and connection lifecycle, consent, security, and abuse safeguards
- [ ] Real-time shared multiplayer games and reconnection flow
- [ ] Blocking, reports, filtering, responsive human moderation, safety contacts
- [ ] Account deletion directly inside each native app, plus data retention/deletion details
- [ ] Age safeguards, child-safety policy and actual eligibility enforcement
- [ ] Subscription purchase and restore flow, entitlement verification, cancellations and testing under storefront rules
- [ ] Production backend hosting, monitoring, backups and security review
- [ ] Updated app-store listings and screenshots showing only functioning features
- [ ] On-device QA and non-expiring Apple reviewer access to all relevant features

## Google Play (Android)
- [ ] Build native Android app / Android App Bundle (not present in current GitHub repo)
- [ ] Complete Play Console registration, app content, privacy and data safety forms
- [ ] Configure child-safety and minor-access controls as applicable
- [ ] Offer deletion in the app and through a public web page for account-based app
- [ ] Complete closed testing with 12 continuously opted-in testers for 14 days if the account falls under Google's new personal-account policy
- [ ] Pass production access application and submit an approved AAB

## Submission order
1. Verify Apple membership and TestFlight setup.
2. Build and sign a testable iOS release with actual production ownership.
3. Finish product and safeguarding requirements before public App Store review.
4. Build an Android app, complete its testing and then submit to Google Play.

Never upload Apple private keys, personal passwords, payment secrets or reviewer credentials to this **public** repository.
