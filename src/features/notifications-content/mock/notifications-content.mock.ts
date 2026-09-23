import type {
  Announcement,
  AnnouncementListResponse,
  NotificationGroup,
  PolicyContent,
  PolicySlug,
} from '../notifications-content.types';

export let MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ANN-001',
    title: 'Platform Maintenance Notice: Sunday 2 AM - 4 AM UTC',
    message:
      'We will be conducting scheduled core infrastructure updates to improve platform reliability. Service booking might experience brief intermittent pauses during this window.',
    target_audience: 'ALL',
    status: 'PUBLISHED',
    created_at: '2026-09-15T08:30:00.000Z',
    updated_at: '2026-09-15T08:30:00.000Z',
    author: 'System Admin',
  },
  {
    id: 'ANN-002',
    title: 'Updated Provider Payout Guidelines & Faster Bank Transfers',
    message:
      'All verified providers can now receive payouts via immediate express settlement. Please verify your updated banking credentials in the provider portal to ensure no delays.',
    target_audience: 'PROVIDERS',
    status: 'PUBLISHED',
    created_at: '2026-09-12T14:15:00.000Z',
    updated_at: '2026-09-13T09:00:00.000Z',
    author: 'Finance Team',
  },
  {
    id: 'ANN-003',
    title: 'Autumn Seasonal Home Cleaning & Repair Discounts',
    message:
      'Announcing seasonal promotional coupons for customers booking home cleaning and electrical inspection packages throughout September and October.',
    target_audience: 'CUSTOMERS',
    status: 'PUBLISHED',
    created_at: '2026-09-08T11:00:00.000Z',
    updated_at: '2026-09-08T11:00:00.000Z',
    author: 'Marketing Operations',
  },
  {
    id: 'ANN-004',
    title: 'Upcoming Verification Policy Updates for Tier 2 Providers',
    message:
      'Drafting the updated background check and trade certificate verification timeline for all tier 2 HVAC and electrical contractors.',
    target_audience: 'PROVIDERS',
    status: 'DRAFT',
    created_at: '2026-09-01T16:45:00.000Z',
    updated_at: '2026-09-05T10:20:00.000Z',
    author: 'Compliance Lead',
  },
  {
    id: 'ANN-005',
    title: 'Summer 2026 Emergency Support Hotline Advisory',
    message:
      'Archived announcement detailing dedicated emergency dispute support phone channels during high summer volume.',
    target_audience: 'ALL',
    status: 'ARCHIVED',
    created_at: '2026-07-01T09:00:00.000Z',
    updated_at: '2026-08-31T23:59:59.000Z',
    author: 'Operations Admin',
  },
];

export let MOCK_NOTIFICATION_GROUPS: NotificationGroup[] = [
  {
    id: 'booking_alerts',
    category: 'Booking & Dispatch Notifications',
    description: 'Alerts sent when bookings are created, confirmed, rescheduled, or completed.',
    items: [
      {
        id: 'booking_created',
        label: 'New Booking Created',
        description: 'Notify customer and provider when a new appointment request is submitted.',
        email: true,
        sms: true,
        push: true,
        in_app: true,
      },
      {
        id: 'booking_confirmed',
        label: 'Booking Confirmed by Provider',
        description: 'Send confirmation receipt to the customer upon provider acceptance.',
        email: true,
        sms: true,
        push: true,
        in_app: true,
      },
      {
        id: 'booking_reminder',
        label: 'Upcoming Job Reminder (24h & 2h)',
        description: 'Send timed reminder notifications to both customer and provider.',
        email: false,
        sms: true,
        push: true,
        in_app: true,
      },
      {
        id: 'booking_completed',
        label: 'Job Completion & Feedback Request',
        description: 'Notify customer upon job completion to verify satisfaction and rate service.',
        email: true,
        sms: false,
        push: true,
        in_app: true,
      },
    ],
  },
  {
    id: 'payment_escrow',
    category: 'Payment & Escrow Alerts',
    description: 'Notifications related to deposits, escrow holds, payout releases, and refund processing.',
    items: [
      {
        id: 'payment_deposited',
        label: 'Escrow Payment Authorization',
        description: 'Notify customer and admin when payment is securely held in escrow.',
        email: true,
        sms: false,
        push: true,
        in_app: true,
      },
      {
        id: 'payout_released',
        label: 'Provider Payout Disbursement',
        description: 'Send settlement notification to provider upon release of payout funds.',
        email: true,
        sms: true,
        push: true,
        in_app: true,
      },
      {
        id: 'refund_processed',
        label: 'Refund Issue Confirmation',
        description: 'Notify customer when an approved refund has been credited back.',
        email: true,
        sms: true,
        push: false,
        in_app: true,
      },
    ],
  },
  {
    id: 'provider_compliance',
    category: 'Provider Onboarding & Compliance',
    description: 'Alerts regarding verification status, document expiration, and profile reviews.',
    items: [
      {
        id: 'provider_kyc_approved',
        label: 'KYC & License Approval',
        description: 'Inform provider when submitted credentials and identity checks are approved.',
        email: true,
        sms: true,
        push: true,
        in_app: true,
      },
      {
        id: 'doc_expiry_warning',
        label: 'Document Expiration Warning',
        description: 'Alert provider 30 days before insurance or trade license expiry.',
        email: true,
        sms: false,
        push: true,
        in_app: true,
      },
    ],
  },
  {
    id: 'customer_engagement',
    category: 'Customer Account & Support',
    description: 'Security alerts, complaint resolution updates, and account activity.',
    items: [
      {
        id: 'complaint_ticket_updated',
        label: 'Dispute / Complaint Status Updates',
        description: 'Send real-time updates when an admin or agent responds to a dispute.',
        email: true,
        sms: false,
        push: true,
        in_app: true,
      },
      {
        id: 'security_login_alert',
        label: 'New Device / Security Login Alert',
        description: 'Security notice when an account is accessed from an unrecognized device.',
        email: true,
        sms: true,
        push: false,
        in_app: false,
      },
    ],
  },
  {
    id: 'system_admin',
    category: 'System & Admin Alerts',
    description: 'Platform health, error spikes, and urgent administrative escalations.',
    items: [
      {
        id: 'dispute_escalated_admin',
        label: 'Urgent Dispute Escalation',
        description: 'Broadcast high-priority notifications to admins when a case escalates.',
        email: true,
        sms: true,
        push: true,
        in_app: true,
      },
      {
        id: 'system_downtime_alert',
        label: 'Critical System Incident Alerts',
        description: 'Immediate alert broadcast when an automated system health check fails.',
        email: true,
        sms: true,
        push: true,
        in_app: true,
      },
    ],
  },
];

export let MOCK_POLICIES: Record<PolicySlug, PolicyContent> = {
  'terms-of-service': {
    id: 'POL-001',
    slug: 'terms-of-service',
    title: 'AWO Platform Terms of Service',
    version: 'v2.4',
    is_active: true,
    updated_at: '2026-09-01T10:00:00.000Z',
    updated_by: 'Legal Compliance',
    content: `# AWO Platform Terms of Service

**Effective Date:** September 1, 2026  
**Last Revised:** September 1, 2026

## 1. Introduction
Welcome to AWO ("Platform", "we", "us", or "our"). By registering, accessing, or utilizing any services provided through the AWO marketplace, you agree to be bound by these Terms of Service.

## 2. Eligibility & Account Responsibilities
- Users must be at least 18 years of age.
- Account holders are strictly responsible for maintaining credential confidentiality.
- All submitted personal and business information must be accurate, current, and complete.

## 3. Marketplace Services & Bookings
- AWO provides a verified marketplace platform connecting Customers with independent Service Providers.
- Providers act as independent contractors and not employees or agents of AWO.
- Contractual obligations for specific service execution exist directly between Customer and Provider.

## 4. Escrow Payments & Protection
- Payments made by Customers are securely held in an escrow holding account until service verification.
- Release of funds to Providers is governed by the AWO Milestone and Completion Policy.

## 5. Prohibited Conduct
- Off-platform payment solicitations are strictly prohibited and subject to immediate account termination.
- Harassment, fraudulent documentation, or sub-contracting to unverified personnel is prohibited.

## 6. Limitation of Liability
To the maximum extent permitted by applicable law, AWO shall not be liable for indirect, incidental, or consequential damages arising from service execution.`,
  },
  'privacy-policy': {
    id: 'POL-002',
    slug: 'privacy-policy',
    title: 'AWO Privacy & Data Protection Policy',
    version: 'v2.1',
    is_active: true,
    updated_at: '2026-08-20T14:30:00.000Z',
    updated_by: 'Privacy Office',
    content: `# AWO Privacy Policy

**Effective Date:** August 20, 2026

## 1. Information We Collect
We collect information required to facilitate secure marketplace bookings and identity verification:
- **Personal Details:** Full name, contact email, phone number, physical address.
- **Provider Credentials:** Government ID, trade license certifications, insurance proof, bank accounts.
- **Location Data:** Real-time geolocation when enabled for on-demand dispatch matching.

## 2. How We Use Data
- Facilitating booking discovery and direct customer-provider coordination.
- Processing secure payments and verifying KYC compliance.
- Preventing fraud, mitigating disputes, and enhancing user safety.

## 3. Data Protection & Security
We utilize enterprise-grade encryption (TLS 1.3 in transit, AES-256 at rest) and comply with global privacy standards.

## 4. Your Rights
Users may request access, correction, or deletion of their personal information at any time via the Admin Support Helpdesk.`,
  },
  'cancellation-policy': {
    id: 'POL-003',
    slug: 'cancellation-policy',
    title: 'Booking Cancellation & Rescheduling Policy',
    version: 'v1.8',
    is_active: true,
    updated_at: '2026-07-15T09:00:00.000Z',
    updated_by: 'Operations Team',
    content: `# AWO Booking Cancellation Policy

**Effective Date:** July 15, 2026

## 1. Customer Cancellations
- **Free Cancellation:** Up to 12 hours before scheduled service appointment time.
- **Late Cancellation (Within 12 hours):** A standard 15% cancellation fee may be applied to compensate the scheduled provider for preparation and reserved slot.
- **Provider En Route / On-Site:** Up to 30% dispatch fee applies if cancelled once provider is on-site.

## 2. Provider Cancellations
- Providers must give at least 8 hours notice for cancellations.
- Unscheduled cancellations impact provider reliability score and dispatch ranking.

## 3. Emergency & Weather Exceptions
In documented cases of severe weather emergencies or unforeseen platform outages, all cancellation fees are completely waived.`,
  },
  'refund-policy': {
    id: 'POL-004',
    slug: 'refund-policy',
    title: 'Dispute Resolution & Customer Refund Policy',
    version: 'v1.5',
    is_active: true,
    updated_at: '2026-06-10T11:15:00.000Z',
    updated_by: 'Dispute Panel',
    content: `# AWO Refund & Compensation Policy

**Effective Date:** June 10, 2026

## 1. Refund Eligibility
Customers are entitled to claim full or partial refunds under the following circumstances:
- Provider failed to show up without prior communication.
- Work performed does not meet agreed quality standards, and provider refuses remediation.
- Incomplete service delivery where partial milestones were unfulfilled.

## 2. Claim Submission Window
Refund requests must be formally filed through the AWO Helpdesk within **48 hours** of job completion marking.

## 3. Processing Timeline
- Admin dispute investigation turnaround: 24 to 48 business hours.
- Approved refund disbursement: 3 to 5 business days back to original payment method.`,
  },
  'about-us': {
    id: 'POL-005',
    slug: 'about-us',
    title: 'About AWO Platform & Company Mission',
    version: 'v1.2',
    is_active: true,
    updated_at: '2026-05-01T08:00:00.000Z',
    updated_by: 'Editorial Team',
    content: `# About AWO

AWO is a next-generation on-demand home and facility services platform dedicated to connecting households and commercial businesses with thoroughly vetted, top-tier service professionals.

## Our Mission
Empowering local service professionals with transparent digital tools and fair payouts while delivering reliable, high-quality, and escrow-protected services to everyday customers.

## Key Pillars
- **Trust & Verification:** Multi-point background checks, credential audits, and genuine customer reviews.
- **Financial Protection:** Secure escrow holding ensures peace of mind for every transaction.
- **Operational Excellence:** 24/7 dedicated support and transparent dispute resolution.`,
  },
};

/**
 * Filter & paginate mock announcements for dev mode
 */
export function filterAndPaginateAnnouncements(
  data: Announcement[],
  page = 1,
  pageSize = 20,
  filters: { status?: string; search?: string; audience?: string } = {}
): AnnouncementListResponse {
  let filtered = [...data];

  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(
      (a) => a.status.toLowerCase() === filters.status?.toLowerCase()
    );
  }

  if (filters.audience && filters.audience !== 'all') {
    filtered = filtered.filter(
      (a) => a.target_audience.toLowerCase() === filters.audience?.toLowerCase()
    );
  }

  if (filters.search && filters.search.trim()) {
    const q = filters.search.toLowerCase().trim();
    filtered = filtered.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.message.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
    );
  }

  // Sort descending by created_at
  filtered.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const total = filtered.length;
  const startIndex = (page - 1) * pageSize;
  const paginated = filtered.slice(startIndex, startIndex + pageSize);

  return {
    data: paginated,
    metadata: {
      page,
      page_size: pageSize,
      total,
    },
  };
}
