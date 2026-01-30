# Nabung Bareng – Feature Spec

Purpose: Pooled investing dengan teman/keluarga untuk capital lebih besar sehingga premium lebih tinggi.

## Flow
- Create Group: Input nama grup, target amount, invite members (5–10 orang). Generate shareable link (via WA).
- Member Join & Deposit: Tiap member deposit IDRX (tracked proportional). Pool auto-deposit ke Aave (earn interest while waiting).
- Execute Strategy (Voting Required): Admin propose strategi (contoh: "Pasang NUNGGU ETH 40M" atau "Deposit ke Covered Call Vault"). Butuh 50%+1 approval, eksekusi via Thetanuts RFQ/Vault.
- Withdrawal (Voting Required): Member propose withdrawal, 50%+1 approval, voting period 48 jam, auto-execute jika threshold.

## Tracking Requirements
- Kontribusi per member (%)
- Total profit grup
- Active positions
- Voting history

## WhatsApp Integration
- Notifikasi ke grup WA:
  - "✅ Andi deposit 5 juta. Total pool: 25 juta (5/10 orang)"
  - "💸 Cashback 850k masuk! Total: 25,850,000 IDRX"
  - "📊 Voting: Withdraw? (Yes: 6/10, No: 2/10) ✅ APPROVED"
- Implementasi: gunakan WA Business API/Twilio WhatsApp (stub untuk MVP), opt-in consent per member.

## Streak Badge (Shareable)
- Visual card: "Nabung bareng selama [3 bulan]", "Bersama: Andi, Budi, Citra, ..." (max 5 names), "Total profit: 3.2 juta", streak 🔥
- Post-able ke IG Story/Twitter; desain mirip TikTok friend streak.

## Personalized Chatbot Nabung Bareng
- Asisten grup: status pool, rekomendasi strategi, pengingat voting/deposit. Mirip fitur AI di 4.1 namun konteks grup.

## API (Backend, Elysia)
Prefix: /api/group
- POST /create: { name, target_amount, max_members(5-10), admin { id, name, address, wa_phone? } }
- POST /invite: { group_id } -> { link }
- POST /join: { group_id, member { id, name, address, wa_phone? } }
- POST /deposit: { group_id, member_id, amount_idrx }
- POST /propose: { group_id, type: 'STRATEGY'|'WITHDRAWAL', title, details, created_by }
- POST /vote: { group_id, proposal_id, member_id, choice: 'YES'|'NO' }
- POST /execute: { group_id, proposal_id } (auto-check threshold 50%+1)
- GET /tracking/:group_id -> { members, contributions%, total_profit, positions, voting_history }

## Data Model (MVP)
- Group: id, name, adminId, targetAmount, maxMembers, createdAt, inviteCode?, members[]
- Member: id, name?, address, waPhone?
- Contribution: groupId, memberId, amount(IDRX), timestamp
- Proposal: id, groupId, type(STRATEGY|WITHDRAWAL), title, details, createdBy, createdAt, votingDeadline, yesVotes[], noVotes[], requiredApprovalCount, status(PENDING|APPROVED|REJECTED|EXECUTED)
- Position: id, protocol(THETANUTS|AAVE|OTHER), description, principal, pnl?, status(active|settled)

## Voting Logic
- Threshold: 50%+1 dari jumlah member aktif saat proposal dibuat.
- Voting period: 48 jam untuk withdrawal; strategi bisa konfigurabel.
- Auto-execute: jika yesVotes ≥ requiredApprovalCount dan period selesai atau eksekusi manual oleh admin setelah threshold tercapai.

## Integrasi On-chain (outline)
- Aave deposit: auto-deposit IDRX (via bridge/wrapped jika perlu) – stub dahulu.
- Thetanuts RFQ/Vault: gunakan layanan di backend/services/rfq.service.ts dan router /api/orders untuk eksekusi strategi.
- GroupVault.sol sudah tersedia; integrasi lebih lanjut menyusul.

## Security & Compliance
- Consent untuk WA notifications; rate limiting.
- Safe math untuk perhitungan kontribusi & profit.
- Tanda tangan transaksi per member jika perlu; admin multi-sig untuk eksekusi.

## Open Questions
- Pengelolaan IDRX on-chain (chain pilihan, bridging)?
- Otorisasi admin vs co-admin?
- Fee model untuk platform?
